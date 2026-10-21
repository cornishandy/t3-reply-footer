// Builds footer-test.html: the footer examples from RULES.md run through T3's Markdown pipeline
// (remark-gfm, rehype-raw, rehype-sanitize with T3's schema change), tables wrapped the way T3 wraps them, <details>
// replaced by T3's own collapsible markup, styled by T3's own CSS (subset) plus footer.css, with in-page checks that
// log PASS/FAIL. Usage: node build.mjs <RULES.md> <t3-subset.css> <footer.css> <out.html>
// Page flags (URL hash): dark, nocss (no footer CSS), team-always-show / team-always-hide (the ✦ switch), folded.
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(new URL("./package.json", import.meta.url));
const load = (m) => import(require.resolve(m));
const { unified } = await load("unified");
const remarkParse = (await load("remark-parse")).default;
const remarkGfm = (await load("remark-gfm")).default;
const remarkRehype = (await load("remark-rehype")).default;
const rehypeRaw = (await load("rehype-raw")).default;
const { default: rehypeSanitize, defaultSchema } = await load("rehype-sanitize");
const rehypeStringify = (await load("rehype-stringify")).default;

const [sectionPath, t3cssPath, footerCssPath, outPath] = process.argv.slice(2);
// T3's CHAT_MARKDOWN_SANITIZE_SCHEMA: the default schema with `title` removed from "*" (other additions don't touch tables or spans).
const schema = { ...defaultSchema, attributes: { ...defaultSchema.attributes, "*": defaultSchema.attributes["*"].filter((a) => a !== "title") } };
const md = (src) => String(unified().use(remarkParse).use(remarkGfm).use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw).use(rehypeSanitize, schema).use(rehypeStringify).processSync(src));
// T3's table component: <div class="chat-markdown-table-container" data-expanded="false"><ScrollArea><table/></ScrollArea><controls/></div>
const wrapTables = (html) => html.replace(/<table>([\s\S]*?)<\/table>/g, (_, t) =>
  `<div class="chat-markdown-table-container" data-expanded="false"><div data-slot="scroll-area" class="w-full max-w-full relative"><div data-slot="scroll-area-viewport"><table>${t}</table></div></div>` +
  `<div class="mt-0.5 flex items-center justify-between select-none" data-ctl><span></span><button type="button" aria-label="Copy table">⧉</button></div></div>`);
// T3's details component (bundle function TO, Base UI collapsible): a wrapper div, the root, a trigger button with a
// chevron and the summary text, and a panel that is unmounted while closed.
const CHEVRON = `<svg class="size-4 shrink-0 text-muted-foreground transition-transform" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>`;
const wrapDetails = (html, folded) => html.replace(/<details( open(?:="")?)?>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g, (_, open, summary, body) => {
  const isOpen = !!open && !folded;
  return `<div class="my-2 border-y border-border/60"><div data-slot="collapsible" data-markdown-details="" data-markdown-details-open="${isOpen}">` +
    `<button type="button" data-slot="collapsible-trigger" class="cursor-pointer flex w-full items-center gap-2 py-2 text-left text-sm font-medium text-foreground" data-markdown-details-summary=""${isOpen ? ' data-panel-open=""' : ""} aria-expanded="${isOpen}">${CHEVRON}<span>${summary}</span></button>` +
    (isOpen ? `<div data-slot="collapsible-panel" class="overflow-hidden" data-open=""><div class="pb-3 ps-6" data-markdown-details-content="">${body}</div></div>` : "") +
    `</div></div>`;
});

const section = fs.readFileSync(sectionPath, "utf8");
const examples = [...section.matchAll(/```\n([\s\S]*?)```/g)].map((m) => m[1]).filter((b) => b.startsWith("---"));
if (examples.length !== 3) throw new Error(`expected 3 footer examples, found ${examples.length}`);
const [quiet, busy, nextTurn] = examples;
const body = "Here is the reply body, with a table of its own:\n\n| Plan | Cost |\n|---|---|\n| A long body row that should stay on one line with T3's ellipsis because it is not part of the footer at all | $5 |\n\nAnd a closing paragraph.\n\n";
const R9 = fs.readFileSync(new URL("./fixtures/round9-busy.md", import.meta.url), "utf8");
// a real Sol footer (20 Oct 2026) whose long who-and-when cells squeezed the step column in a table layout
const LONGMETA = fs.readFileSync(new URL("./fixtures/long-meta.md", import.meta.url), "utf8");
const LONG = "a".repeat(220);
const longStep = `---\n\n| <span itemprop="settle-no">🔴 Don't settle yet</span> | review running | 0 of 1 done · ETA 11:55 PM |\n|---|---|--:|\n| Running | <span itemprop="running">Check \`${LONG}\` then [open this page](https://example.invalid/${LONG})</span> | Sol · 11:40–11:55 PM · planned 15 |\n| Needs you | **1. Inspect** · <ins>Read</ins> \`${LONG}\`. Blocks nothing. |   |\n\n<sub>Decided for you -- · Skills -- · Written by Claude Opus 5.5 xhigh · Claude usage: protecting · 1.0 of 9.8 points today</sub>\n`;
// the rundown followed by <sub> with no blank line between: <sub> arrives bare, not in a paragraph
const directSub = nextTurn.replace("</details>\n\n<sub>", "</details>\n<sub>");
const cases = [
  { id: "quiet", kind: "footer", md: body + quiet },
  { id: "busy", kind: "footer", timed: true, team: true, md: body + busy },
  { id: "next-turn", kind: "footer", timed: true, team: true, md: body + nextTurn },
  { id: "long-token", kind: "footer", md: body + longStep },
  { id: "long-meta", kind: "footer", team: true, md: body + LONGMETA },
  { id: "direct-sub", kind: "footer", timed: true, team: true, md: body + directSub },
  // a round-9 footer already in an old thread (two columns): T3's own table look, nothing restyled
  { id: "round9", kind: "plain", md: body + R9 },
  // a body hr followed by a table, then the real footer: only the footer's tables change
  { id: "two-hrs", kind: "footer", timed: true, team: true, md: "Intro.\n\n---\n\n| Body | Table |\n|---|---|\n| after an earlier hr | stays plain |\n\nMore body.\n\n" + nextTurn },
  // an old-style or foreign reply: hr + table without the verdict hook stays T3's own table, and so does a body <details>
  { id: "no-hook", kind: "plain", md: "Body.\n\n<details open><summary>Body details</summary>\n\n| Inside | Body details |\n|---|---|\n| stays | T3's own look |\n\n</details>\n\n---\n\n| Status | Value |\n|---|---|\n| Needs you | a long cell that should keep T3's one-line ellipsis behaviour, since this table has no verdict hook at all |\n" },
];
const html = (fold) => cases.map((c) => `<section data-case="${c.id}" data-kind="${c.kind}"${c.timed ? " data-timed" : ""}${c.team ? " data-team" : ""}><h2>${c.id}</h2><div class="chat-markdown w-full min-w-0 text-sm leading-relaxed">${wrapDetails(wrapTables(md(c.md)), fold)}</div></section>`).join("\n");

const checks = String.raw`
let fails = 0; const out = []; const log = (ok, msg) => { if (!ok) fails++; out.push((ok ? "PASS " : "FAIL ") + msg); };
const cs = (el, p) => getComputedStyle(el, p);
const rgb = (s) => { const n = (s.match(/[\d.]+/g) || []).map(Number); return s.startsWith("color(srgb") ? n.slice(0, 3).map((v) => v * 255) : n.slice(0, 3); };
const isRed = (c) => { const [r, g, b] = rgb(c); return r > g + 60 && r > b + 60; };
const isGreen = (c) => { const [r, g, b] = rgb(c); return g > r + 30 && g > b + 15; };
const clear = (c) => c === "rgba(0, 0, 0, 0)" || c === "transparent";
// a row's tint sits on its cells (desktop grid) or on the row itself (phones)
const tinted = (tr) => !clear(cs(tr).backgroundColor) || !clear(cs(tr.children[1]).backgroundColor);
const phone = innerWidth <= 480, H = location.hash;
const nocss = H.includes("nocss");
const team = (H.match(/team-([a-z-]+)/) || [])[1];
if (team) document.documentElement.setAttribute("data-t3x-footer-team", team);
const parts = (sec) => {
  const md = sec.querySelector(".chat-markdown");
  const hr = [...md.querySelectorAll(":scope > hr")].at(-1);
  const card = hr && hr.nextElementSibling?.matches(".chat-markdown-table-container") ? hr.nextElementSibling : null;
  const rundown = card?.nextElementSibling?.querySelector(":scope > [data-markdown-details]") ? card.nextElementSibling : null;
  const strip = (rundown || card)?.nextElementSibling;
  const sub = strip?.tagName === "SUB" ? strip : strip?.tagName === "P" && strip.firstElementChild?.tagName === "SUB" ? strip.firstElementChild : null;
  return { md, hr, card, rundown, strip, sub };
};

// contrast of text against its painted background (cell tint over card over page)
const cv = document.createElement("canvas"); cv.width = cv.height = 1; const cx = cv.getContext("2d", { willReadFrequently: true });
const parse = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = "#000"; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
const lin = (v) => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; };
const L = ([r, g, b]) => .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b);
const over = (top, bot) => { const a = top[3]; return [0, 1, 2].map((i) => top[i] * a + bot[i] * (1 - a)).concat(1); };
function bgOf(el) { const stack = []; for (let e = el; e; e = e.parentElement) { const c = parse(cs(e).backgroundColor); if (c[3] > 0) stack.push(c); } let acc = [255, 255, 255, 1]; if (document.documentElement.classList.contains("dark")) acc = [10, 10, 10, 1]; for (const c of stack.reverse()) acc = over(c, acc); return acc; }
const contrast = (el) => { const bg = bgOf(el), fg = over(parse(cs(el).color), bg); const [a, b] = [L(fg), L(bg)].sort((x, y) => y - x); return (a + .05) / (b + .05); };

for (const sec of document.querySelectorAll("section")) {
  const id = sec.dataset.case, { md, card, rundown, strip, sub } = parts(sec);
  const conts = [...md.querySelectorAll(".chat-markdown-table-container")];
  const plain = sec.dataset.kind === "plain" ? conts : conts.filter((c) => c !== card && !rundown?.contains(c));
  if (nocss) {
    if (sec.dataset.kind !== "footer") continue;
    // Without the add-ons: T3's own tables. The header row must show in full (T3 cuts cells at 24rem with "…").
    // T3 scrolls a wide table sideways on a phone; what must hold is that no header cell is cut off with "…"
    for (const th of card.querySelectorAll("thead th")) log(th.scrollWidth <= th.clientWidth + 1, id + ": no-add-ons header cell not cut off (" + th.textContent.slice(0, 40) + ")");
    log(cs(card.querySelector("[data-ctl]")).display !== "none", id + ": no-add-ons keeps T3's table controls");
    continue;
  }
  for (const o of plain) {
    log(cs(o.querySelector("[data-ctl]")).display !== "none", id + ": non-footer table keeps its controls");
    log(cs(o.querySelector("td")).whiteSpace === "nowrap", id + ": non-footer cells keep T3's one-line ellipsis");
    log(cs(o).borderTopWidth === "0px", id + ": non-footer table gets no card border");
  }
  for (const d of md.querySelectorAll("[data-markdown-details]")) if (!rundown?.contains(d))
    log(cs(d.parentElement).borderTopWidth === "1px" && parseFloat(cs(d.querySelector("[data-markdown-details-summary]")).fontSize) === 14, id + ": a body <details> keeps T3's look");
  if (sec.dataset.kind !== "footer") continue;

  log(!!card, id + ": the plan table follows the last hr");
  if (!card) continue;
  log(cs(card).display !== "none" && card.offsetHeight > 40 && card.querySelector("tbody td").offsetHeight > 10, id + ": the card is visible");
  for (const p of sec.querySelectorAll(".chat-markdown > p:not(:has(sub))")) log(cs(p).display !== "none" && p.offsetHeight > 0 && parseFloat(cs(p).fontSize) === 14, id + ": body paragraph untouched");
  for (const tr of card.querySelectorAll("tr")) log(tr.children.length === 3, id + ": row has 3 cells (" + tr.textContent.slice(0, 30) + ")");
  log(cs(card).borderTopWidth === "1px" && cs(card).borderTopLeftRadius !== "0px", id + ": card border and rounded corners");
  log(cs(card.querySelector("[data-ctl]")).display === "none", id + ": table controls hidden");
  const tds = [...card.querySelectorAll("tbody td")];
  log(tds.every((td) => cs(td).textOverflow === "clip"), id + ": no ellipsis in footer cells");
  log(card.querySelector("table").getBoundingClientRect().width <= card.getBoundingClientRect().width + 0.5, id + ": card fits its column (no sideways scroll)");

  const verdict = card.querySelector("thead [itemprop^=settle-]");
  log(!!verdict, id + ": verdict hook survived sanitising");
  const vc = cs(verdict).color;
  log(verdict.getAttribute("itemprop") === "settle-no" ? isRed(vc) : isGreen(vc), id + ": verdict colour " + vc);
  log(+cs(verdict.closest("th")).fontWeight >= 600, id + ": verdict bold");
  const ths = card.querySelectorAll("thead th");
  log(+cs(ths[1]).fontWeight < 600 && +cs(ths[2]).fontWeight < 600, id + ": reason and progress not bold");
  log(!clear(cs(card.querySelector("thead")).backgroundColor), id + ": verdict header tinted");
  if (ths[2].textContent.trim()) log(ths[2].getBoundingClientRect().right >= card.getBoundingClientRect().right - 16, id + ": progress sits at the right edge");

  const rows = [...card.querySelectorAll("tbody tr")];
  for (const tr of rows) {
    const [label, step, meta] = tr.children;
    log(+cs(label).fontWeight < 600, id + ": status label regular (" + (label.textContent.trim() || "blank") + ")");
    log(+cs(meta).fontWeight < 600, id + ": who-and-when regular");
  }
  for (const d of card.querySelectorAll("tbody del")) log(cs(d).textDecorationLine.includes("line-through"), id + ": done step crossed out (" + d.textContent.slice(0, 24) + ")");
  for (const r of card.querySelectorAll("tbody [itemprop~=running]")) {
    const tr = r.closest("tr");
    log(tinted(tr), id + ": running row tinted");
    log(cs(r, "::before").content !== "none" && cs(r, "::before").width !== "auto", id + ": running dot");
  }
  for (const s of card.querySelectorAll("tbody strong")) {
    log(+cs(s).fontWeight >= 600, id + ": item topic bold (" + s.textContent + ")");
    log(tinted(s.closest("tr")), id + ": needs-you row tinted");
  }
  for (const sv of card.querySelectorAll("tbody [itemprop~=saved]")) {
    const tr = sv.closest("tr");
    log(tinted(tr) && (cs(tr.children[0]).boxShadow !== "none" || cs(tr).boxShadow !== "none"), id + ": saved-usage row tinted with a bar");
  }
  if (sec.hasAttribute("data-timed")) log(!!card.querySelector("tbody [itemprop~=saved]"), id + ": saved-usage row present");
  for (const i of card.querySelectorAll("tbody ins")) log(cs(i).textDecorationLine.includes("underline"), id + ": action word underlined (" + i.textContent + ")");
  for (const f of md.querySelectorAll("[itemprop~=failed]")) log(isRed(cs(f).color), id + ": failure in red");
  for (const o of card.querySelectorAll("[itemprop~=over]")) { const [r, g, bl] = parse(cs(o).color); log(r > bl + 40 && g > bl, id + ": overrun in the warning colour (" + o.textContent + ")"); }
  if (sec.hasAttribute("data-timed")) {
    const time = rows.find((tr) => tr.children[0].textContent.trim() === "Time");
    log(!!time && /(so far|in all) since you asked at \d/.test(time.children[1].textContent) && /planned .* · (expect|\d+ over|\d+ under|on plan)/.test(time.children[2].textContent), id + ": Time row: so far / in all since you asked, against the plan");
    log(time && rows.slice(rows.indexOf(time) + 1).every((tr) => ["", "Usage", "Saved usage", "Decided for you"].includes(tr.children[0].textContent.trim()) && !tr.querySelector("del, [itemprop~=running], strong")), id + ": Time row after the plan, before Usage, Saved usage and Decided for you");
  }
  const metaCells = rows.map((tr) => tr.children[2]).filter((td) => td.textContent.trim());
  for (const m of metaCells) log(cs(m).textAlign === (phone ? "left" : "right"), id + ": who-and-when aligned " + (phone ? "left on phones" : "right"));
  // rows size to their words (Andy, 20 Oct 2026, "Still off"): who-and-when stays on one line beside the step, or drops
  // under it (left-aligned on phones, right-aligned on desktop) instead of wrapping into a narrow column
  const box = (el) => el.getBoundingClientRect(), lineH = (el) => parseFloat(cs(el).lineHeight);
  const steps = rows.map((tr) => tr.children[1]);
  log(steps.every((td) => Math.abs(box(td).left - box(steps[0]).left) < 1), id + ": steps start in one column");
  for (const tr of rows) log(tr.children[0].scrollWidth <= tr.children[0].clientWidth + 1, id + ": status label not cut off (" + (tr.children[0].textContent.trim() || "blank") + ")");
  for (const tr of rows) {
    const [, step, meta] = tr.children;
    if (!meta.textContent.trim()) continue;
    const beside = box(meta).top < box(step).bottom - 1, oneLine = box(meta).height <= lineH(meta) * 1.5 + parseFloat(cs(meta).paddingTop) + parseFloat(cs(meta).paddingBottom);
    const name = id + ": who-and-when (" + meta.textContent.slice(0, 24) + ")";
    if (phone) log(!beside, name + " drops under its step on phones");
    else if (beside) {
      log(oneLine, name + " beside the step stays on one line");
      const stepOneLine = box(step).height <= lineH(step) * 1.5 + parseFloat(cs(step).paddingTop) + parseFloat(cs(step).paddingBottom);
      log(stepOneLine || box(step).width + 1 >= Math.min(288, 0.55 * box(tr).width), name + " leaves a wrapping step at least 18rem");
    } else log(Math.abs(box(meta).right - box(tr).right) < 1, name + " drops under its step at the right edge");
  }
  if (!phone) { const rights = metaCells.map((m) => box(m).right); log(rights.every((r) => Math.abs(r - rights[0]) < 1), id + ": who-and-when lines up on the right"); }

  if (rundown) {
    const trigger = rundown.querySelector("[data-markdown-details-summary]");
    if (team === "always-hide") { log(cs(rundown).display === "none", id + ": always-hide hides the team list"); }
    else {
      log(cs(rundown).borderTopWidth === "0px" && parseFloat(cs(trigger).fontSize) === 12, id + ": team summary small, no rules");
      log(+cs(trigger).fontWeight === 400, id + ": team summary not bold");
      if (team === "always-show") log(cs(trigger).pointerEvents === "none" && cs(trigger.querySelector("svg")).display === "none", id + ": always-show can't fold");
      else log(cs(trigger).pointerEvents !== "none" && cs(trigger.querySelector("svg")).display !== "none", id + ": team list trigger stays clickable (T3 folds it)");
      const cells = [...rundown.querySelectorAll("th, td")];
      if (cells.length) {
        log(cells.every((c) => +cs(c).fontWeight === 400), id + ": nothing bold in the team list");
        log(cells.every((c) => cs(c).textOverflow === "clip" && (c.cellIndex === 1 ? cs(c).whiteSpace === "nowrap" : cs(c).whiteSpace === "normal")), id + ": team cells wrap (model names kept whole), no ellipsis");
        log(cs(rundown.querySelector("[data-ctl]")).display === "none", id + ": team table controls hidden");
        log(rundown.querySelector("thead th").textContent === "Lead", id + ": team list starts with Lead");
      }
    }
  } else if (sec.hasAttribute("data-team")) log(false, id + ": team rundown found under the card");
  log(!!sub && parseFloat(cs(sub).fontSize) === 11 && cs(sub).display !== "none", id + ": small line 11px");
  const pipeCell = [...md.querySelectorAll("td")].find((td) => td.textContent.includes("jq"));
  if (pipeCell) log(pipeCell.textContent.includes(".acts | length"), id + ": escaped pipe shows as | in its cell");

  let worst = 99, bad = [];
  for (const el of [...card.querySelectorAll("th, td, [itemprop], ins, strong"), ...(rundown && team !== "always-hide" ? rundown.querySelectorAll("th, td, button span, [itemprop]") : []), sub].filter(Boolean)) {
    if (!el.offsetParent || !el.textContent.trim()) continue;
    const r = contrast(el); worst = Math.min(worst, r); if (r < 4.5) bad.push(r.toFixed(2) + " " + el.textContent.slice(0, 30));
  }
  log(!bad.length, id + ": contrast >= 4.5:1 (worst " + worst.toFixed(2) + ")" + (bad.length ? " " + bad.join("; ") : ""));
}
out.push((fails ? fails + " FAILED" : "ALL PASSED") + " (" + (document.documentElement.classList.contains("dark") ? "dark" : "light") + ", " + innerWidth + "px" + (team ? ", team " + team : "") + (nocss ? ", no add-ons" : "") + ")");
const pre = document.createElement("pre"); pre.id = "results"; pre.textContent = out.join("\n"); pre.style.display = "none"; document.body.append(pre);
`;

const page = (fold) => `<!doctype html><html><head><meta charset="utf-8"><title>footer test</title>
<script>if (location.hash.includes("dark")) document.documentElement.classList.add("dark");</script>
<style>${fs.readFileSync(t3cssPath, "utf8")}</style>
<style>body{background:var(--background);color:var(--foreground);font-family:var(--font-sans,system-ui);margin:0;padding:16px} section{max-width:720px;margin:0 auto 28px} h2{font:600 11px/1 ui-monospace,monospace;color:var(--muted-foreground);margin:0 0 6px}</style>
<style id="footer-css">${fs.readFileSync(footerCssPath, "utf8")}</style>
<script>if (location.hash.includes("nocss")) document.getElementById("footer-css").remove();</script>
</head><body>${html(fold)}<script>${checks}</script></body></html>`;
fs.writeFileSync(outPath, page(false));
fs.writeFileSync(outPath.replace(/\.html$/, "-folded.html"), page(true));
console.log("wrote", outPath, "and the folded copy");
