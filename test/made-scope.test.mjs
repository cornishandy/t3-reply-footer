// Raw-Markdown unit tests for the v4 Q1 outside-link inclusion & exclusion rules (PROPOSAL-V4.md / RULES.md).
// Required by Opus R2/R3/R4 & verified by Astra Final Gate:
//   (1) A multi-URL `Sources:` / `References:` bibliography in a raw Markdown reply adds ZERO `Link` rows.
//   (2) A single inline factual citation inside a prose sentence in a raw Markdown reply adds ZERO `Link` rows.
// Plus positive checks: safe http(s) URLs in footer plan rows (`Done`, `Needs you`, `Answered`) or explicitly
// presented as destinations to open/review DO qualify; `t3-thread://`, local code paths, and secrets stay out.
import { test } from "node:test";
import assert from "node:assert/strict";

const SECRET_RE = /(?:[?&](?:token|key|api_key|secret|sig|signature|auth|password|access_token)=|hooks\.slack\.com\/services\/|discord\.com\/api\/webhooks\/)/i;
const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const BIBLIO_HEADING_RE = /^(?:#{1,6}\s+|\*\*)?(?:sources|references|bibliography|further reading|citations)\s*:?\s*(?:\*\*)?$/i;
const FOOTNOTE_DEF_RE = /^\[\^[^\]]+\]:/;
const PRESENTED_CUE_RE = /\b(?:here(?:'s| is)\b|requested (?:directory|catalog|site|page)|browse\b|pull request|pr\s*#?\d+|repo(?:sitory)?|issue\s*#?\d+|live (?:page|site|tool|app)|(?:open|review|check|view)\s+(?:the\s+|this\s+)?(?:live|staging|demo|pr|page|site|repo|issue|link|explorer|dashboard|catalog|directory))\b/i;
const CITATION_CUE_RE = /\b(?:per|according to|see|via|from|documented in|defined in|spec(?:ification)?|study|wikipedia|mdn|wcag|rfc)\b/i;

/** Parse a raw Markdown assistant reply (body + footer) and return the outside http(s) URLs that qualify as Made so far `Link` rows under Q1. */
export function extractOutsideLinksFromReply(rawMarkdown) {
  const text = String(rawMarkdown || "");
  const sepIdx = text.lastIndexOf("\n---\n");
  const body = sepIdx >= 0 ? text.slice(0, sepIdx) : text;
  const footer = sepIdx >= 0 ? text.slice(sepIdx + 5) : "";

  const seen = new Set();
  const out = [];
  const add = (url, label) => {
    if (!/^https?:\/\//i.test(url)) return;
    if (SECRET_RE.test(url)) return;
    if (seen.has(url)) return;
    seen.add(url);
    out.push({ url, label });
  };

  // Clause (a): Footer plan rows (`Done`, `Needs you`, `Answered`) — only before the first `<details>` fold
  const planPart = footer.split("<details")[0] || "";
  let curKind = "";
  for (const line of planPart.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|")) continue;
    const cells = trimmed.replace(/^\|/, "").replace(/\|$/, "").split(/(?<!\\)\|/).map((c) => c.trim());
    if (cells.length < 3 || cells[0].includes("---") || cells[0].includes("settle-")) continue;
    if (cells[0]) curKind = cells[0];
    if (!["Done", "Needs you", "Answered"].includes(curKind)) continue;
    for (const m of cells[1].matchAll(LINK_RE)) add(m[2], m[1]);
  }

  // Clause (b): Raw body paragraphs/lines — skip Sources/References/Bibliography sections, footnotes, and inline factual citations
  let inBiblio = false;
  for (const rawLine of body.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    if (BIBLIO_HEADING_RE.test(line)) { inBiblio = true; continue; }
    if (/^#{1,6}\s+/.test(line)) { inBiblio = false; continue; }
    if (FOOTNOTE_DEF_RE.test(line)) continue;
    if (inBiblio) {
      // List items or indented continuations under Sources:/References: stay excluded
      if (/^(?:[-*+]|\d+\.)\s+/.test(line) || line.startsWith("[")) continue;
      inBiblio = false;
    }
    const links = [...line.matchAll(LINK_RE)];
    if (!links.length) continue;
    // Strip inline code and link syntax to check surrounding prose context
    const stripped = line.replace(/`[^`]*`/g, "").replace(LINK_RE, "$1").trim();
    const isStandaloneLinkBullet = /^(?:[-*+]|\d+\.)\s+\[[^\]]+\]\([^)]+\)(?:\s*[—–:-].*)?$/.test(line);
    if (!isStandaloneLinkBullet && CITATION_CUE_RE.test(stripped) && !PRESENTED_CUE_RE.test(stripped)) continue;
    if (isStandaloneLinkBullet || PRESENTED_CUE_RE.test(stripped)) {
      for (const m of links) add(m[2], m[1]);
    }
  }
  return out;
}

test("Q1 required test 1: raw multi-URL Sources:/References: bibliography reply adds zero Link rows", () => {
  const reply = `Here is the contrast analysis across light and dark modes. Both themes clear 4.5:1 on hover.

Sources:
- [WCAG 2.1 Contrast](https://www.w3.org/TR/WCAG21/#contrast-minimum)
- [MDN color-mix()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix)
- [Nielsen Norman scanning study](https://www.nngroup.com/articles/how-users-read-on-the-web/)

References:
1. [CSS Containment Level 3](https://drafts.csswg.org/css-contain-3/)

[^1]: [HTML details element](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-details-element)

---

| <span itemprop="settle-yes">🟢 Safe to settle</span> |   |   |
|---|---|--:|
| Done | ~~Summarize contrast findings~~ | Neon · 2 min |

<sub>Needs you -- · Decided for you -- · Skills -- · Written by Gemini 4 Neon xhigh</sub>
`;
  assert.deepEqual(extractOutsideLinksFromReply(reply), []);
});

test("Q1 required test 2: raw single inline factual citation inside a sentence adds zero Link rows", () => {
  const reply = `Per the [MDN specification](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details), \`<details>\` starts collapsed unless the \`open\` attribute is present.

---

| <span itemprop="settle-yes">🟢 Safe to settle</span> |   |   |
|---|---|--:|
| Done | ~~Answer your question~~ | Neon · 1 min |

<sub>Needs you -- · Decided for you -- · Skills -- · Written by Gemini 4 Neon xhigh</sub>
`;
  assert.deepEqual(extractOutsideLinksFromReply(reply), []);
});

test("Q1 positive & boundary checks on raw Markdown reply: plan-row and presented destinations enter; bibliography, inline citations, local code, secrets and t3-thread:// stay out", () => {
  const reply = `Here is the requested directory to browse: [ui-skills.com catalog](https://ui-skills.com)

Per [Wikipedia](https://en.wikipedia.org/wiki/Contrast_ratio), 4.5:1 is WCAG AA normal text. I also inspected [footer.css](file:///Users/example/repo/footer.css#L10-L20).

Sources:
- [MDN URL API](https://developer.mozilla.org/en-US/docs/Web/API/URL)

---

| <span itemprop="settle-no">🔴 Don't settle yet</span> | paused for 1 | 1 of 2 done |
|---|---|--:|
| Done | ~~Open [PR 412](https://github.com/org/repo/pull/412)~~ | Neon · 3 min |
| Needs you | **1. Review** · Check [staging site](https://staging.example.com) and skip [webhook](https://hooks.slack.com/services/T0/B0/SECRET). |   |
| Next | Merge PR | Neon · ~2 min |
| Threads | <span itemprop="threads">Previous: [Earlier work](t3-thread://v2/env/123)</span> |   |

<sub>Decided for you -- · Skills -- · Written by Gemini 4 Neon xhigh</sub>
`;
  assert.deepEqual(extractOutsideLinksFromReply(reply), [
    { url: "https://github.com/org/repo/pull/412", label: "PR 412" },
    { url: "https://staging.example.com", label: "staging site" },
    { url: "https://ui-skills.com", label: "ui-skills.com catalog" },
  ]);
});
