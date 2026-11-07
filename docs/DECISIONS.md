# Decisions

Dated choices that shaped the footer, oldest first.

- **18 Oct 2026:** Labelled rows, one per field. The rules live in the agent instructions, and a stylesheet draws them. Every field is kept, with `--` for empty ones, which are shown quietly.
- **19 Oct 2026:** One row per agent in the team list. Effort is shown as a plain level (`xhigh`), never with the word "effort". No pills, ⚡ or 🔶: "just be plain and legible". The verdict reads "Safe to settle" / "Don't settle yet".
- **19 Oct 2026:** Column widths size to their content within limits instead of staying fixed. Code chips stay for reply codes. Underlines (`<ins>`) mark the words the human acts on. No bold in the team list.
- **19 Oct 2026:** One plan list in time order: finished steps crossed out, then the running step in the accent colour, then what's next. Each open question sits right above the step it blocks.
- **19 Oct 2026 (round 11):** The verdict moved into the table header, giving one three-column card (status · step · who and when). The team list became an option with four modes, starting open by default.
- **19 Oct 2026:** Honest end-to-end and per-step time, measured against the estimate made before the work started. Overruns of more than a quarter, and at least 5 minutes, are flagged.
- **20 Oct 2026:** Only changes from the defaults are reported, with their likely quality effect (Saved usage). A Usage row gives the expected cost against a baseline in every planned footer.
- **20 Oct 2026:** Rows are lines that wrap. Who-and-when sits on the right while it fits beside the step; otherwise it drops underneath (always on phones).
- **20 Oct 2026:** Published as its own public repo. Personal paths and the tailnet hostname in the examples were replaced with placeholders.
- **25 Oct 2026:** Narrow layouts follow the chat lane's width, not the window's: in a narrowed window the chat pane could be under 400px while the window stayed over 480px, so tables ran off the right edge with no sign they scrolled ("it should dynamically resize so I can see full width of table, within reason"). Under a 36rem lane, reply tables wrap to fit; a table that still scrolls shows its scrollbar. Wider lanes keep T3's one-line cells.
- **7 Nov 2026:** Reply tables wrap to fit the lane at every width, not only under 36rem (Andy picked "wrap everywhere" over keeping T3's one-line cells in wide panes), so long cells are never cut off with "…".
- **7 Nov 2026:** In a lane of 40rem or more, a busy card (five or more rows) widens to the lane, up to 52rem ("when window is wider than the footer table, please have it expand to fit, within reason"). Astra picked full width; Gemini preferred a card that grows only a little. Full width won because it cut the most wrapped lines while keeping who-and-when on one right edge.
- **7 Nov 2026:** T3 Nightly removed the `chat-lane` container the narrow and wide layouts were keyed to, so they stopped applying in the live app. footer.css now gives each reply that ends in a footer card its own container (`t3x-lane`), only those replies, since making every reply text a container would collapse T3's shrink-to-fit message bubbles. The tests no longer supply `chat-lane`.
