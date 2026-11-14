// Builds footer-test.html: the footer examples from RULES.md run through T3's Markdown pipeline
// (remark-gfm, rehype-raw, rehype-sanitize with T3's schema change), tables wrapped the way T3 wraps them, <details>
// replaced by T3's own collapsible markup, styled by T3's own CSS (subset) plus footer.css, with in-page checks that
// log PASS/FAIL. Usage: node build.mjs <RULES.md> <t3-subset.css> <footer.css> <out.html>
// Page flags (URL hash): dark, nocss (no footer CSS), team-always-show / team-always-hide and made-hide /
// made-always-open (the ✦ switches), mac-app (the add-on has confirmed the Mac app), folded,
// lane-N (each case's chat lane N px wide, as in a narrowed window whose sidebar leaves a narrow chat pane).
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
// T3's table component: <div class="chat-markdown-table-container" data-expanded="false"><ScrollArea><table/></ScrollArea><controls/></div>.
// Its ScrollArea (Base UI) clips to a scrolling viewport and mounts a horizontal scrollbar, hidden until hovered, only
// while the table overflows; the checks add that scrollbar the same way once the page has laid out.
const wrapTables = (html) => html.replace(/<table>([\s\S]*?)<\/table>/g, (_, t) =>
  `<div class="chat-markdown-table-container" data-expanded="false"><div data-slot="scroll-area" class="w-full max-w-full relative overflow-hidden"><div data-slot="scroll-area-viewport"><table>${t}</table></div></div>` +
  `<div class="mt-0.5 flex items-center justify-between select-none" data-ctl><span></span><button type="button" aria-label="Copy table">⧉</button></div></div>`);
// T3's details component (bundle function TO, Base UI collapsible): a wrapper div, the root, a trigger button with a
// chevron and the summary text, and a panel that is unmounted while closed.
const CHEVRON = (open) => `<svg style="transform: rotate(${open ? 90 : 0}deg)" class="size-4 shrink-0 text-muted-foreground transition-transform" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>`;
const wrapDetails = (html, folded, madeOpen) => {
  // The footer's folds follow the last hr's verdict table: the Made so far list (its summary carries itemprop="made";
  // written folded, opened only where the add-on would open it) and then the team rundown.
  const footerStart = html.lastIndexOf("<hr>");
  const footer = html.slice(footerStart).match(/^<hr>\s*<div class="chat-markdown-table-container"(?:(?!<hr>)[\s\S])*?<span itemprop="settle-(?:yes|no)"[\s\S]*?<\/table><\/div><\/div><div[^>]*data-ctl>[\s\S]*?<\/div><\/div>\s*(?=<details)/);
  let teamOffset = footer ? footerStart + footer[0].length : -1;
  const madeFold = teamOffset < 0 ? null : html.slice(teamOffset).match(/^<details>\s*<summary><span itemprop="made">(?:(?!<details)[\s\S])*?<\/details>\s*/);
  const madeOffset = madeFold ? teamOffset : -1;
  if (madeFold) teamOffset = html.startsWith("<details", teamOffset + madeFold[0].length) ? teamOffset + madeFold[0].length : -1;
  // innermost first, so a fold inside a fold (a Needs you item holding its advice) works; the team fold holds no
  // fold, so it is replaced in the first pass, where offsets still match teamOffset
  let pass = 0, prev;
  do {
    prev = html;
    const first = pass === 0;
    html = html.replace(/<details( open(?:="")?)?>\s*<summary>((?:(?!<details|<summary)[\s\S])*?)<\/summary>((?:(?!<details)[\s\S])*?)<\/details>/g, (_, open, summary, body, offset) => {
      const isOpen = first && offset === madeOffset ? !!madeOpen : !!open && !(folded && first && offset === teamOffset);
      return `<div class="my-2 border-y border-border/60"><div data-slot="collapsible" data-markdown-details="" data-markdown-details-open="${isOpen}">` +
        `<button type="button" data-slot="collapsible-trigger" class="cursor-pointer flex w-full items-center gap-2 py-2 text-left text-sm font-medium text-foreground" data-markdown-details-summary=""${isOpen ? ' data-panel-open=""' : ""} aria-expanded="${isOpen}">${CHEVRON(isOpen)}<span>${summary}</span></button>` +
        (isOpen ? `<div data-slot="collapsible-panel" class="overflow-hidden" data-open=""><div class="pb-3 ps-6" data-markdown-details-content="">${body}</div></div>` : "") +
        `</div></div>`;
    });
  } while (html !== prev && ++pass < 5);
  return html;
};

const section = fs.readFileSync(sectionPath, "utf8");
const examples = [...section.matchAll(/```\n([\s\S]*?)```/g)].map((m) => m[1]).filter((b) => b.startsWith("---"));
if (examples.length !== 3) throw new Error(`expected 3 footer examples, found ${examples.length}`);
const [quiet, busy, nextTurn] = examples;
const body = "Here is the reply body, with a table of its own:\n\n| Plan | Cost |\n|---|---|\n| A long body row that wraps to fit the chat lane, since it is not part of the footer and keeps T3's plain table look | $5 |\n\nAnd a closing paragraph.\n\n";
const R9 = fs.readFileSync(new URL("./fixtures/round9-busy.md", import.meta.url), "utf8");
// a real Sol footer (20 Oct 2026) whose long who-and-when cells squeezed the step column in a table layout
const LONGMETA = fs.readFileSync(new URL("./fixtures/long-meta.md", import.meta.url), "utf8");
// the Thread health watch's footer (7 Nov 2026 shape, made-up items): each Needs you item is a fold in the step cell,
// some holding a nested advice fold; WATCH_OPEN opens item 2 and its advice
const WATCH = fs.readFileSync(new URL("./fixtures/watch-folds.md", import.meta.url), "utf8");
const WATCH_OPEN = WATCH.replace("<details><summary>**2.", "<details open><summary>**2.").replace("<details><summary>Grok + Gemini both pick: A", "<details open><summary>Grok + Gemini both pick: A");
const LONG = "a".repeat(220);
const longStep = `---\n\n| <span itemprop="settle-no">🔴 Don't settle yet</span> | review running | 0 of 1 done · ETA 11:55 PM |\n|---|---|--:|\n| Running | <span itemprop="running">Check \`${LONG}\` then [open this page](https://example.invalid/${LONG})</span> | Sol · 11:40–11:55 PM · planned 15 |\n| Needs you | **1. Inspect** · <ins>Read</ins> \`${LONG}\`. Blocks nothing. |   |\n\n<sub>Decided for you -- · Skills -- · Written by Claude Opus 5.5 xhigh · Claude usage: protecting · 1.0 of 9.8 points today</sub>\n`;
// the rundown followed by <sub> with no blank line between: <sub> arrives bare, not in a paragraph
const directSub = nextTurn.replace("</details>\n\n<sub>", "</details>\n<sub>");
// the screenshot of 25 Oct 2026: a footer written without its `---` or verdict hook is a plain three-column table, which
// in a narrow chat lane ran off the right edge with no sign it scrolled
const NOHOOK = "| 🔴 Don't settle yet | Watch remains open | 1 of 2 done · ETA 9:05 PM |\n|---|---|--:|\n| Still running / due | State | Next check |\n| [Thread health watch (48)](t3-thread://v1/example) | Persistent LaunchAgent (`PID 87049`) + webhook 2 still bound to this thread; next scan at 9:05 PM | script · every 5 min |\n";
// six columns with a long path: too many words for a phone-width lane, so it may scroll, but then it must say so
const WIDE = "| File | Before | After | Change | Owner | Notes |\n|---|---|---|---|---|---|\n| `/Users/you/Documents/ChatGPT/t3-reply-footer/footer.css` | 175 lines | 210 lines | +35 | Opus | container queries for narrow chat lanes |\n| `test/build.mjs` | 1 | 2 | +1 | Opus | lane wrapper |\n";
// a long thread's list (14 things, three kinds) under a quiet card with no team rundown; then the same with a bare <sub>
const MADELONG = fs.readFileSync(new URL("./fixtures/made-long.md", import.meta.url), "utf8");
// a thread's first thing: a one-row list (one visual), under the same quiet card
const MADEONE = fs.readFileSync(new URL("./fixtures/made-one.md", import.meta.url), "utf8");
// a handover reply (Andy, 13 Nov 2026: "list somewhere with links to the previous and any next handover thread"):
// Saved usage, Decided for you and a last Threads row together, so the label column must still fit "Decided for you"
// It also carries an overdue time on a blue Running row (40 real footers did), which the contrast check now covers
const THREADS = fs.readFileSync(new URL("./fixtures/threads-last.md", import.meta.url), "utf8");
const cases = [
  { id: "quiet", kind: "footer", md: body + quiet },
  { id: "busy", kind: "footer", timed: true, team: true, made: 3, md: body + "<details open><summary>Body details beside footer</summary>\n\nBody disclosure stays open.\n\n</details>\n\n" + busy },
  { id: "next-turn", kind: "footer", timed: true, team: true, made: 3, md: body + nextTurn },
  { id: "made-long", kind: "footer", made: 14, md: body + MADELONG },
  { id: "made-direct-sub", kind: "footer", made: 14, md: body + MADELONG.replace("</details>\n\n<sub>", "</details>\n<sub>") },
  { id: "made-one", kind: "footer", made: 1, md: body + MADEONE },
  { id: "threads-last", kind: "footer", timed: true, md: body + THREADS },
  { id: "long-token", kind: "footer", md: body + longStep },
  { id: "long-meta", kind: "footer", team: true, md: body + LONGMETA },
  { id: "direct-sub", kind: "footer", timed: true, team: true, made: 3, md: body + directSub },
  // a round-9 footer already in an old thread (two columns): T3's own table look, nothing restyled
  { id: "watch-folds", kind: "footer", folds: true, md: body + WATCH },
  { id: "watch-folds-open", kind: "footer", folds: true, md: body + WATCH_OPEN },
  { id: "round9", kind: "plain", md: body + R9 },
  // a body hr followed by a table, then the real footer: only the footer's tables change
  { id: "two-hrs", kind: "footer", timed: true, team: true, made: 3, md: "Intro.\n\n---\n\n| Body | Table |\n|---|---|\n| after an earlier hr | stays plain |\n\nMore body.\n\n" + nextTurn },
  // an old-style or foreign reply: hr + table without the verdict hook stays T3's own table, and so does a body <details>
  { id: "no-hr-footer", kind: "plain", md: "Status after compaction:\n\n" + NOHOOK },
  { id: "wide-table", kind: "plain", mayScroll: true, md: "Changed files:\n\n" + WIDE },
  { id: "no-hook", kind: "plain", md: "Body.\n\n<details open><summary>Body details</summary>\n\n| Inside | Body details |\n|---|---|\n| stays | T3's own look |\n\n</details>\n\n---\n\n| Status | Value |\n|---|---|\n| Needs you | a long cell that wraps like any reply table, since this table has no verdict hook and gets no card layout |\n" },
];
// a footer pasted into a user message: T3 draws it in a shrink-to-fit bubble, which must keep its width (a size
// container there would collapse it), so only assistant rows get the t3x-lane container
cases.push({ id: "user-paste", kind: "user", md: cases[0].md });
// T3's timeline rows carry data-message-role; a user bubble sizes to its content
const row = (c, inner) => c.kind === "user"
  ? `<div data-message-role="user" style="display:flex;justify-content:flex-end"><div data-bubble style="width:fit-content;max-width:80%">${inner}</div></div>`
  : `<div data-message-role="assistant">${inner}</div>`;
const html = (fold, madeOpen) => cases.map((c) => `<section data-case="${c.id}" data-kind="${c.kind}"${c.mayScroll ? " data-may-scroll" : ""}${c.timed ? " data-timed" : ""}${c.team ? " data-team" : ""}${c.made ? ` data-made="${c.made}"` : ""}${c.folds ? " data-folds" : ""}><h2>${c.id}</h2>${row(c, `<div class="chat-markdown w-full min-w-0 text-sm leading-relaxed">${wrapDetails(wrapTables(md(c.md)), fold, madeOpen)}</div>`)}</section>`).join("\n");

const checks = String.raw`
let fails = 0; const out = []; const log = (ok, msg) => { if (!ok) fails++; out.push((ok ? "PASS " : "FAIL ") + msg); };
const cs = (el, p) => getComputedStyle(el, p);
const rgb = (s) => { const n = (s.match(/[\d.]+/g) || []).map(Number); return s.startsWith("color(srgb") ? n.slice(0, 3).map((v) => v * 255) : n.slice(0, 3); };
const isRed = (c) => { const [r, g, b] = rgb(c); return r > g + 60 && r > b + 60; };
const isGreen = (c) => { const [r, g, b] = rgb(c); return g > r + 30 && g > b + 15; };
const clear = (c) => c === "rgba(0, 0, 0, 0)" || c === "transparent";
// a row's tint sits on its cells (desktop grid) or on the row itself (phones)
const tinted = (tr) => !clear(cs(tr).backgroundColor) || !clear(cs(tr.children[1]).backgroundColor);
const H = location.hash;
// each section is a chat lane; the footer's narrow layout follows the width of the reply (footer.css gives a reply that
// ends in a footer card its own t3x-lane container, since T3 no longer has one)
const laneOf = (sec) => sec.getBoundingClientRect().width;
for (const vp of document.querySelectorAll("[data-slot=scroll-area-viewport]")) if (vp.scrollWidth > vp.clientWidth + 1) {
  const bar = document.createElement("div"); bar.dataset.slot = "scroll-area-scrollbar"; bar.dataset.orientation = "horizontal"; bar.className = "opacity-0";
  bar.innerHTML = '<div data-slot="scroll-area-thumb"></div>'; vp.after(bar);
}
const nocss = H.includes("nocss");
const team = (H.match(/team-([a-z-]+)/) || [])[1];
if (team) document.documentElement.setAttribute("data-t3x-footer-team", team);
const madeMode = (H.match(/made-(hide|always-open)/) || [])[1];
if (madeMode) document.documentElement.setAttribute("data-t3x-footer-made", madeMode);
const macApp = H.includes("mac-app");
if (macApp) document.documentElement.setAttribute("data-t3x-mac-app", "");
const madeOpen = document.body.hasAttribute("data-made-open");
const parts = (sec) => {
  const md = sec.querySelector(".chat-markdown");
  const hr = [...md.querySelectorAll(":scope > hr")].at(-1);
  const card = hr && hr.nextElementSibling?.matches(".chat-markdown-table-container") ? hr.nextElementSibling : null;
  const isFold = (el) => !!el?.querySelector(":scope > [data-markdown-details]");
  const isMade = (el) => isFold(el) && !!el.querySelector(":scope > [data-markdown-details] > [data-markdown-details-summary] [itemprop~=made]");
  const made = isMade(card?.nextElementSibling) ? card.nextElementSibling : null;
  const afterMade = (made || card)?.nextElementSibling;
  const rundown = isFold(afterMade) && !isMade(afterMade) ? afterMade : null;
  const strip = (rundown || made || card)?.nextElementSibling;
  const sub = strip?.tagName === "SUB" ? strip : strip?.tagName === "P" && strip.firstElementChild?.tagName === "SUB" ? strip.firstElementChild : null;
  return { md, hr, card, made, rundown, strip, sub };
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
  const id = sec.dataset.case, { md, card, made, rundown, strip, sub } = parts(sec);
  const lane = laneOf(sec), phone = lane < 480;
  if (sec.dataset.kind === "user") {
    log(cs(md).containerType === "normal", id + ": a user message is not made a size container");
    if (!nocss) log(sec.querySelector("[data-bubble]").getBoundingClientRect().width > Math.min(200, lane / 2), id + ": a pasted footer keeps its bubble's width (" + Math.round(sec.querySelector("[data-bubble]").getBoundingClientRect().width) + ")");
    continue;
  }
  const conts = [...md.querySelectorAll(".chat-markdown-table-container")];
  const plain = sec.dataset.kind === "plain" ? conts : conts.filter((c) => c !== card && !rundown?.contains(c) && !made?.contains(c));
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
    log(cs(o).borderTopWidth === "0px", id + ": non-footer table gets no card border");
    const vp = o.querySelector("[data-slot=scroll-area-viewport]"), bar = o.querySelector("[data-slot=scroll-area-scrollbar]");
    const over = vp.scrollWidth > vp.clientWidth + 1;
    // Andy, 25 Oct 2026: "it should dynamically resize so I can see full width of table, within reason. currently
    // requires scroll horizontally without any indication that scroll is even necessary"
    if (over) log(!!bar && +cs(bar).opacity === 1 && cs(bar).display !== "none" && cs(bar.firstElementChild).backgroundColor !== cs(bar).backgroundColor, id + ": a table that scrolls shows its scrollbar");
    // Andy, 7 Nov 2026: wrap at every lane width, not just narrow ones
    log([...o.querySelectorAll("th, td")].every((c) => cs(c).whiteSpace === "normal" && c.scrollWidth <= c.clientWidth + 1), id + ": cells wrap, nothing cut off");
    if (!sec.hasAttribute("data-may-scroll") || lane >= 400) log(!over, id + ": the table fits the lane (" + vp.scrollWidth + " in " + vp.clientWidth + ")");
  }
  for (const d of md.querySelectorAll("[data-markdown-details]")) {
    const trigger = d.querySelector("[data-markdown-details-summary]");
    const open = d.dataset.markdownDetailsOpen === "true";
    log(trigger.getAttribute("aria-expanded") === String(open) && trigger.hasAttribute("data-panel-open") === open && !!d.querySelector('[data-slot="collapsible-panel"]') === open, id + ": disclosure state matches trigger and panel");
    const chevron = trigger.querySelector("svg");
    log(chevron.style.transform === (open ? "rotate(90deg)" : "rotate(0deg)") && (!chevron.getBoundingClientRect().width || cs(chevron).transform === (open ? "matrix(0, 1, -1, 0, 0, 0)" : "matrix(1, 0, 0, 1, 0, 0)")), id + ": chevron points " + (open ? "down when open" : "right when closed"));
    if (card?.contains(d)) {
      // a folded Needs you item in the card: one tight line, no T3 fold border, margin or padding, the card's own type
      const wrap = d.parentElement, nested = !!d.parentElement.closest("[data-markdown-details-content]");
      log(cs(wrap).borderTopWidth === "0px" && cs(wrap).borderBottomWidth === "0px" && (nested || cs(wrap).marginTop === "0px"), id + ": card fold has no border or margin");
      log(parseFloat(cs(trigger).paddingTop) === 0 && parseFloat(cs(trigger).fontSize) <= 13 && +cs(trigger).fontWeight < 600, id + ": card fold summary is compact and regular");
      if (!nested && !open) {
        const tr = d.closest("tr"), lines = Math.round(trigger.querySelector("span").getBoundingClientRect().height / 20);
        log(tinted(tr) && cs(tr).boxShadow !== "none", id + ": folded Needs you row keeps its band and bar");
        log(lane < 480 || lines === 1, id + ": folded item is one line (" + lines + ")");
        log(tr.getBoundingClientRect().height <= lines * 20 + 6, id + ": folded row is tight (" + Math.round(tr.getBoundingClientRect().height) + "px)");
      }
    } else if (made?.contains(d)) {
      log(open === madeOpen, id + ": the Made fold is folded as written, open only where the add-on opens it");
    } else if (!rundown?.contains(d)) {
      log(open && !!d.querySelector('[data-slot="collapsible-panel"]'), id + ": body details stays open even when footer team is folded");
      log(cs(d.parentElement).borderTopWidth === "1px" && parseFloat(cs(trigger).fontSize) === 14, id + ": a body <details> keeps T3's look");
    } else log(open === !document.body.hasAttribute("data-folded"), id + ": only footer team follows fixture fold state");
  }
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
  // Andy, 7 Nov 2026: "when window is wider than the footer table, please have it expand to fit, within reason":
  // in a lane of 40rem or more a busy card (5+ rows) fills the lane up to 52rem; a shorter card keeps fitting its words
  if (lane >= 640) {
    const cw = card.getBoundingClientRect().width, rows = card.querySelectorAll("tbody tr").length;
    if (rows >= 5) log(Math.abs(cw - Math.min(lane, 832)) <= 1, id + ": busy card fills the wide lane (" + Math.round(cw) + " in " + Math.round(lane) + ")");
    else log(cw < Math.min(lane, 832) - 1, id + ": short card fits its words (" + Math.round(cw) + " in " + Math.round(lane) + ")");
  }

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
  // Needs you rows, ordinary and folded (Andy, 13 Nov 2026: "Needs You text should be in red"; the team's pick): the
  // label in red, a red bar and a red tint; the topic keeps the text colour
  const needsYou = rows.filter((tr) => tr.querySelector(":scope > td:nth-child(2) > strong:first-child, :scope > td:nth-child(2) > div:first-child > [data-markdown-details] > [data-markdown-details-summary] strong:first-child"));
  for (const tr of needsYou) {
    const shadow = cs(tr).boxShadow !== "none" ? cs(tr).boxShadow : cs(tr.children[0]).boxShadow, bar = (shadow.match(/(?:rgba?|color|oklch|oklab|lch|lab)\([^)]*\)/) || ["transparent"])[0];
    const band = clear(cs(tr).backgroundColor) ? cs(tr.children[1]).backgroundColor : cs(tr).backgroundColor;
    if (tr.children[0].textContent.trim()) log(isRed(cs(tr.children[0]).color), id + ": Needs you label in red");
    const asRgb = (c) => "rgb(" + parse(c).slice(0, 3).join(", ") + ")";
    log(isRed(asRgb(bar)) && isRed(asRgb(band)), id + ": Needs you row has a red bar and a red tint (" + bar + "; " + band + ")");
    log(!isRed(cs(tr.querySelector("strong")).color), id + ": Needs you topic keeps the text colour");
  }
  if (sec.hasAttribute("data-folds")) {
    const first = rows.find((tr) => tr.children[0].textContent.trim() === "Needs you");
    log(!!first && isRed(cs(first.children[0]).color) && !isRed(cs(first.children[1].querySelector("strong")).color), id + ": Needs you label in red, the item's topic not");
    const items = rows.filter((tr) => tr.querySelector(":scope > td:nth-child(2) > div > [data-markdown-details]"));
    const isClosed = (tr) => !tr.querySelector("[data-markdown-details-open=true]");
    log(items.every((tr, i) => i === 0 || !isClosed(tr) || !isClosed(items[i - 1]) || tr.getBoundingClientRect().top - items[i - 1].getBoundingClientRect().bottom <= 1), id + ": folded items sit close together");
  }
  // the Threads row: last, linking its neighbours, never quiet like Decided for you
  for (const t of card.querySelectorAll("tbody [itemprop~=threads]")) {
    const tr = t.closest("tr");
    log(tr === rows[rows.length - 1], id + ": Threads row is the last row");
    log(/^(Previous: .+?)?( · )?(Next: .+)?$/.test(t.textContent.trim()) && t.querySelectorAll("a").length >= 1 && [...t.querySelectorAll("a")].every((a) => a.textContent.trim()), id + ": Threads row names its neighbours as links");
    const quiet = card.querySelector("tbody tr:has(> td:last-child:empty):not(:has(strong, del, [itemprop])) td:nth-child(2)"), time = rows.find((r) => r.children[0].textContent.trim() === "Time");
    log((!time || cs(tr.children[1]).color === cs(time.children[1]).color) && (!quiet || cs(tr.children[1]).color !== cs(quiet).color), id + ": Threads row not quiet");
  }
  // one label width per card (footer.css: 5.1em, 6.3em with Saved usage, 7.9em with Decided for you, which is the last
  // row or the row before a last Threads row); phones fix labels at 4.9rem, so this is checked in wider lanes only
  if (!phone && rows.length) {
    const last = rows[rows.length - 1], lastIsThreads = !!last.querySelector("[itemprop~=threads]"), before = rows[rows.length - 2];
    const decided = lastIsThreads ? !!before && !before.children[2].textContent.trim() : !last.children[2].textContent.trim();
    const want = decided ? 7.9 : card.querySelector("tbody [itemprop~=saved]") ? 6.3 : 5.1;
    const td = rows[0].children[0], em = (parseFloat(cs(td).minWidth) - parseFloat(cs(document.documentElement).fontSize)) / parseFloat(cs(td).fontSize);
    log(Math.abs(em - want) < 0.06, id + ": label column " + want + "em (" + em.toFixed(2) + "em)");
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
    log(time && rows.slice(rows.indexOf(time) + 1).every((tr) => ["", "Usage", "Saved usage", "Decided for you", "Threads"].includes(tr.children[0].textContent.trim()) && !tr.querySelector("del, [itemprop~=running], strong")), id + ": Time row after the plan, before Usage, Saved usage and Decided for you");
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

  if (made) {
    const trigger = made.querySelector("[data-markdown-details-summary]"), name = trigger.querySelector("[itemprop~=made]");
    const count = +sec.dataset.made;
    log(made.previousElementSibling === card && (!rundown || rundown.previousElementSibling === made), id + ": the Made list sits right under the card, above the team list");
    log(new RegExp("^Made so far · " + count + ": \\d+ [a-z]+(, \\d+ [a-z]+)*$").test(trigger.textContent.trim()), id + ": Made summary names the count and the kinds");
    if (nocss) { /* T3's own fold look */ }
    else if (madeMode === "hide") {
      log(cs(made).display === "none", id + ": hide hides the Made list");
      if (rundown && team !== "always-hide") log(cs(rundown).display !== "none" && cs(rundown).marginTop === "7.2px", id + ": hiding the Made list leaves the team list in place");
    } else {
      log(cs(made).display !== "none" && cs(made).borderTopWidth === "0px" && parseFloat(cs(trigger).fontSize) === 12 && +cs(trigger).fontWeight === 400, id + ": Made summary small, plain, no rules");
      log(cs(name).color !== cs(trigger).color, id + ": the words Made so far stand out from the count");
      if (madeMode === "always-open") log(cs(trigger).pointerEvents === "none" && cs(trigger.querySelector("svg")).display === "none", id + ": always-open blocks pointer clicks and hides the chevron");
      else log(cs(trigger).pointerEvents !== "none" && cs(trigger.querySelector("svg")).display !== "none", id + ": Made list trigger stays clickable");
      if (rundown && team !== "always-hide") log(parseFloat(cs(rundown).marginTop) < 3, id + ": the team list sits close under the Made list");
      const rows = [...made.querySelectorAll("tr")];
      if (madeOpen) log(rows.length === count, id + ": one row per thing (" + rows.length + " of " + count + ")");
      if (rows.length) {
        const cells = rows.flatMap((tr) => [...tr.children]), phone = laneOf(sec) < 480;
        log(cells.every((c) => +cs(c).fontWeight === 400 && cs(c).textOverflow === "clip"), id + ": nothing bold or cut off in the Made list");
        log(cs(made.querySelector("[data-ctl]")).display === "none", id + ": Made table controls hidden");
        const kinds = rows.map((tr) => tr.children[0].textContent.trim()).filter(Boolean);
        const ORDER = ["Pages", "Audio", "Video", "Visuals", "Images", "Documents"];
        log(kinds.length === new Set(kinds).size && kinds.every((k) => ORDER.includes(k)) && kinds.every((k, i) => !i || ORDER.indexOf(k) > ORDER.indexOf(kinds[i - 1])), id + ": each kind is named once, in order (" + kinds.join(", ") + ")");
        log(rows.every((tr) => tr.children[1].querySelector("a[href]")), id + ": every name is its link");
        const b = (el) => el.getBoundingClientRect(), right = b(sec).right;
        log(cells.every((c) => b(c).right <= right + 1) && made.querySelector("[data-slot=scroll-area-viewport]").scrollWidth <= made.querySelector("[data-slot=scroll-area-viewport]").clientWidth + 1, id + ": the Made list fits the lane");
        if (phone) log(rows.every((tr) => b(tr.children[2]).top >= b(tr.children[1]).bottom - 1 && Math.abs(b(tr.children[2]).left + parseFloat(cs(tr.children[2]).paddingLeft) - b(tr.children[1]).left) < 1), id + ": in a narrow lane each note drops under its name, in line with it");
        else log(rows.every((tr) => Math.abs(b(tr.children[2]).top - b(tr.children[1]).top) < 1 && cs(tr.children[2]).whiteSpace === "nowrap" && b(tr.children[2]).height < 26), id + ": in a wide lane each note stays on its name's line");
        const mac = [...made.querySelectorAll("[itemprop~=mac-only]")];
        // A note starts with Mac only (a local file) or with its phone-page link (RULES.md, On his phone).
        const phoneNotes = rows.filter((tr) => { const a = tr.children[2].querySelector("a[href]"); return a && a.textContent.trim() === "phone page"; });
        log(mac.length + phoneNotes.length > 0 && mac.every((m) => (cs(m).display === "none") === macApp), id + ": Mac only shows unless the Mac app is confirmed");
        if (phoneNotes.length) log(phoneNotes.every((tr) => cs(tr.children[2].querySelector("a[href]")).display !== "none"), id + ": a phone-page note shows its link");
      }
    }
    if (team === "always-hide" && madeMode !== "hide" && !nocss) log(cs(made).display !== "none", id + ": hiding the team list leaves the Made list");
  } else if (sec.hasAttribute("data-made")) log(false, id + ": Made list found under the card");
  else log(!md.querySelector("[itemprop~=made]"), id + ": no Made list where nothing was made");

  if (rundown) {
    const trigger = rundown.querySelector("[data-markdown-details-summary]");
    if (team === "always-hide") { log(cs(rundown).display === "none", id + ": always-hide hides the team list"); }
    else {
      log(cs(rundown).borderTopWidth === "0px" && parseFloat(cs(trigger).fontSize) === 12, id + ": team summary small, no rules");
      log(+cs(trigger).fontWeight === 400, id + ": team summary not bold");
      if (team === "always-show") log(cs(trigger).pointerEvents === "none" && cs(trigger.querySelector("svg")).display === "none", id + ": always-show blocks pointer clicks and hides the chevron");
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
  for (const el of [...card.querySelectorAll("th, td, [itemprop], ins, strong"), ...(rundown && team !== "always-hide" ? rundown.querySelectorAll("th, td, button span, [itemprop]") : []), ...(made && madeMode !== "hide" ? made.querySelectorAll("th, td, a, button span, [itemprop]") : []), sub].filter(Boolean)) {
    if (!el.offsetParent || !el.textContent.trim()) continue;
    const r = contrast(el); worst = Math.min(worst, r); if (r < 4.5) bad.push(r.toFixed(2) + " " + el.textContent.slice(0, 30));
  }
  log(!bad.length, id + ": contrast >= 4.5:1 (worst " + worst.toFixed(2) + ")" + (bad.length ? " " + bad.join("; ") : ""));
}
out.push((fails ? fails + " FAILED" : "ALL PASSED") + " (" + (document.documentElement.classList.contains("dark") ? "dark" : "light") + ", " + innerWidth + "px, lane " + Math.round(laneOf(document.querySelector("section"))) + "px" + (team ? ", team " + team : "") + (madeMode ? ", made " + madeMode : "") + (macApp ? ", mac app" : "") + (madeOpen ? ", made open" : "") + (nocss ? ", no add-ons" : "") + ")");
const pre = document.createElement("pre"); pre.id = "results"; pre.textContent = out.join("\n"); pre.style.display = "none"; document.body.append(pre);
`;

const page = (fold, madeOpen) => `<!doctype html><html><head><meta charset="utf-8"><title>footer test</title>
<script>if (location.hash.includes("dark")) document.documentElement.classList.add("dark");</script>
<style>${fs.readFileSync(t3cssPath, "utf8")}</style>
<style>body{background:var(--background);color:var(--foreground);font-family:var(--font-sans,system-ui);margin:0;padding:16px} section{max-width:var(--lane,720px);margin:0 auto 28px;} h2{font:600 11px/1 ui-monospace,monospace;color:var(--muted-foreground);margin:0 0 6px}
/* T3's ScrollArea (scroll-area component, Base UI): utility classes the subset lacks */
@layer utilities{.relative{position:relative}.max-w-full{max-width:100%}.opacity-0{opacity:0}
[data-slot=scroll-area-viewport]{height:100%;overflow:auto;overscroll-behavior:contain}
[data-slot=scroll-area-scrollbar][data-orientation=horizontal]{position:absolute;left:0;right:0;bottom:0;display:flex;flex-direction:column;height:.375rem;margin:0 .25rem 1px;transition:opacity .15s .3s}
[data-slot=scroll-area-thumb]{position:relative;flex:1;border-radius:9999px;background:var(--app-scrollbar-thumb)}}</style>
<script>{ const m = location.hash.match(/lane-(\\d+)/); if (m) document.documentElement.style.setProperty("--lane", m[1] + "px"); }</script>
<style id="footer-css">${fs.readFileSync(footerCssPath, "utf8")}</style>
<script>if (location.hash.includes("nocss")) document.getElementById("footer-css").remove();</script>
</head><body${fold ? ' data-folded=""' : ""}${madeOpen ? ' data-made-open=""' : ""}>${html(fold, madeOpen)}<script>${checks}</script></body></html>`;
// three pages: as written (team open, Made folded); team folded with Made open; both open
fs.writeFileSync(outPath, page(false, false));
fs.writeFileSync(outPath.replace(/\.html$/, "-folded.html"), page(true, true));
fs.writeFileSync(outPath.replace(/\.html$/, "-made-open.html"), page(false, true));
console.log("wrote", outPath, "with its folded and made-open copies");
