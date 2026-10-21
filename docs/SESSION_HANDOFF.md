# Session handoff

## History
- 18–19 Oct 2026: Footer redesign, rounds 1–10. Mockups were reviewed by GPT-6.1-Sol, GPT-6-Astra, Gemini and Grok, and Claude Fable 5.1 gave the final OK.
- 19–20 Oct 2026: Round 11 built and installed: a three-column card, the verdict in the header, a four-mode team list, Time / Usage / Saved usage rows, and wrapping rows.
- 20 Oct 2026: Moved out of the T3 scratch folder into this repo. The test harness was made portable: Chrome is found automatically or set with `CHROME`, and dependencies install with `npm ci`. Its row-order check now allows the Usage row.

## Where things live on the author's Mac
- The source of truth for the rules is `~/.claude/CLAUDE.md` (mirrored in `~/.codex/AGENTS.md` and `~/.gemini/GEMINI.md`). Update `RULES.md` here when that changes, and replace personal paths and hostnames before committing.
- The installed CSS is the end of the t3-extras add-on's `extras.css`. Copy `footer.css` here when it changes.

## Resume prompt
> Continue the T3 reply footer in ~/Documents/ChatGPT/t3-reply-footer. Read README.md and docs/DECISIONS.md, run test/run.sh, then <change>. Keep RULES.md in sync with ~/.claude/CLAUDE.md, replacing personal paths and hostnames.
