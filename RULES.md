## End every reply to Andy with a footer
End every reply to Andy (each turn's last message), even short ones, with a footer: the turn's plan (what finished, what's running, what needs him, what's next), honest time against the plan, anything changed to save usage, whether the thread is finished, and who did the work. `---`, one plan table, a Made so far list once the thread has made something for him to open, a team rundown when other agents worked, one small line. T3's add-ons draw it as one card: the verdict red or green, running steps in the theme's accent, finished steps crossed out, who and when on the right. Copy these shapes.

A quiet turn:

```
---

| <span itemprop="settle-yes">🟢 Safe to settle</span> |   |   |
|---|---|--:|
| Done | ~~Answer your question~~ | Opus · 1 min |

<sub>Needs you -- · Decided for you -- · Skills -- · Written by Claude Opus 5.5 xhigh · Claude usage: normal pace · 2.1 of 5.5 points today</sub>
```

A busy turn, idle until Andy acts, with no usable card (a four-option ballot and an action):

```
---

| <span itemprop="settle-no">🔴 Don't settle yet</span> | paused for 1 and 2 | 4 of 6 done · then about 10 min |
|---|---|--:|
| Done | ~~Write the script~~ | Opus · 22 min · planned 20 |
|   | ~~Pick the stills~~ | Gemini · 6 min · planned 5 |
|   | ~~Review the code~~ | Sol · 11 min · planned 10 |
|   | ~~Pull facts from 40 sources~~ <span itemprop="failed">Haiku failed twice; Opus finished it</span> | Opus · <span itemprop="over">18 min · planned 8</span> |
| Needs you | **1. Hosting** · Where should the [podcast page](/Users/you/Library/Caches/podcast/index.html) live? A: tailnet, private to your devices (recommended; Opus and Astra agree). B: ChatGPT Sites, public. C: GitHub Pages, public. D: keep it local. <ins>Reply</ins> `1A`, `1B`, `1C`, `1D`, `all` or `explain 1`. Blocks publishing. |   |
| Next | Publish the page | Opus · ~5 min |
| Needs you | **2. Sign in** · <ins>Sign in</ins> to GitHub in the browser window I opened, then <ins>reply</ins> "signed in". Blocks the push. |   |
| Next | Push to GitHub | Opus · ~2 min |
| Time | 58 min so far since you asked at 8:58 PM; about 10 more once you answer | <span itemprop="over">planned ~45 min · expect ~1 h 10</span> |
| Usage | ~8 five-hour points (~1.3 week points) expected at the default efforts (baseline); about 6 so far (this thread and its children, estimated); no efforts lowered | 5-hour 41% · refills 11:00 PM |
| Saved usage | <span itemprop="saved">No second (Opus) review of the script</span> (T1 Trim): a small risk a wording slip gets through (my judgment) | ~1 Claude point |
| Decided for you | Chapters follow the film's acts, counted with `jq '.acts \| length'`; ask and I'll split them by scene. |   |

<details><summary><span itemprop="made">Made so far</span> · 3: 1 page, 1 audio, 1 visual</summary>

| Pages | [Podcast page](/Users/you/Library/Caches/podcast/index.html) | <span itemprop="mac-only">Mac only · </span>draft, not published · 9:48 PM |
|---|---|---|
| Audio | [Episode master](/Users/you/Library/Caches/podcast/master.mp3) | <span itemprop="mac-only">Mac only · </span>41 min long · 9:31 PM |
| Visuals | [Stills shortlist](/Users/you/Library/Caches/podcast/visuals/stills-shortlist.html) | <span itemprop="mac-only">Mac only · </span>in this thread · 9:12 PM |

</details>

<details open><summary>Team · Opus wrote this reply, with Sol, Gemini and Haiku</summary>

| Lead | Claude Opus 5.5 *xhigh* | wrote this reply |
|---|---|---|
| Reviewer | GPT-6.1-Sol *xhigh* | code review · 11 min |
|   | Gemini 4 Argon *high* | read the stills · 6 min |
| Researcher | Claude Haiku 5.5 *high* | fact pull, 40 sources · <span itemprop="failed">failed twice, moved to Opus</span> · 18 min |

</details>

<sub>Skills: movie-podcast · Notes: gates skipped for the page copy (small task) · Claude usage: trimming · 3.2 of 6.0 points today</sub>
```

The next turn, after Andy answers 1 with a card still open for 2:

```
---

| <span itemprop="settle-no">🔴 Don't settle yet</span> | 1 open; check running | 1 of 3 done · then about 15 min |
|---|---|--:|
| Answered | ~~1. Hosting~~ tailnet, [podcast page](http://my-mac.your-tailnet.ts.net:9780/movies/podcast/) |   |
| Done | ~~Publish to the tailnet~~ | Opus · 3 min · planned 5 |
| Running | <span itemprop="running">Check the published page on a phone</span> | Astra · 10:02–10:15 PM · added · planned 10 |
| Needs you | **2. Sign in** (still open) · <ins>Sign in</ins> to GitHub in the browser window I opened. Blocks the push. Answer the open card. |   |
| Next | Push to GitHub | Opus · ~2 min |
| Time | 1 h 5 min so far since you asked at 8:58 PM, 2 min of it waiting on you; about 15 more once you sign in | <span itemprop="over">planned ~45 min · expect ~1 h 20</span> |
| Usage | ~8 five-hour points (~1.3 week points) expected at the default efforts (baseline); about 7 so far (this thread and its children, estimated); this thread at high, no change expected for publishing (my judgment) | 5-hour 52% · refills 11:00 PM |
| Saved usage | <span itemprop="saved">This thread runs at high, not xhigh</span>, since 9:58 PM (you approved): no change expected for publishing steps (my judgment) | under 10% of a turn |

<details><summary><span itemprop="made">Made so far</span> · 3: 1 page, 1 audio, 1 visual</summary>

| Pages | [Podcast page](http://my-mac.your-tailnet.ts.net:9780/movies/podcast/) | phone page · 9:58 PM |
|---|---|---|
| Audio | [Episode master](/Users/you/Library/Caches/podcast/master.mp3) | <span itemprop="mac-only">Mac only · </span>41 min long · 9:31 PM |
| Visuals | [Stills shortlist](/Users/you/Library/Caches/podcast/visuals/stills-shortlist.html) | <span itemprop="mac-only">Mac only · </span>in this thread · 9:12 PM |

</details>

<details open><summary>Team · Opus wrote this reply, with Astra</summary>

| Lead | Claude Opus 5.5 *high* | wrote this reply |
|---|---|---|
| Reviewer | GPT-6-Astra *xhigh* | checks the published page · running |

</details>

<sub>Decided for you -- · Skills -- · Claude usage: trimming · 3.6 of 6.0 points today</sub>
```

When he resolves the last open item: `| Answered | 🎉 All answered, thanks! ~~2. Sign in~~ done |   |`.

**Layout.**
- Blank lines before and after `---`, after the plan table, after each `<summary>…</summary>`, before and after each `</details>` and before the `<sub>` line. One physical line per row, always three cells (an unused cell holds one space); escape every literal `|` in a cell as `\|`, in code and links too; no `\` line endings.
- **Header row:** the verdict; a reason of 5 words or fewer (empty when green); progress `N of M done` (N = Done rows, M = Done + Running + Next rows, continuation rows included), then `· ETA 10:05 PM` when nothing listed waits on Andy, or `· then about 10 min` (from when he acts to the end, running work included) when something does; empty for a turn with one step or none. Separator `|---|---|--:|`.
- **Plan rows** in time order, each label on the first row of its run: `Answered` (`~~N. Topic~~ answer`, one row per item resolved since the last reply); `Done` (`~~step~~`, steps finished this turn, the deliverable linked); `Running` (`<span itemprop="running">step</span>`); `Needs you` (each open item right above the step it unblocks, else after Running); `Next`; `Time`; `Usage`; `Saved usage`; `Decided for you` (this turn's choices Andy may want to change, and how; no reply needed, not carried forward). Steps read like a plan: 2–6 words naming the subject (`Review the card CSS`), no trailing punctuation. A quick answer is one Done row (`~~Answer your question~~`); a turn that only records an answer shows its Answered row and the plan still to come, with no invented Done step.
- **Who and when** (third cell): Done `Sol · 11 min · planned 8`; Running `Sol · 9:41–9:55 PM · planned 10`; Next `Opus · ~5 min`; a step added later `added · planned 5` (estimated before it started) or `added · not estimated beforehand`; empty for Answered, Needs you and Decided for you. Short names: Opus, Fable, Haiku, Sonnet, Sol, Astra, Grok, Gemini (4 Argon), Flash (3.8 Flash); a script says `script`.
- **Honest time** (Andy, 19 Oct 2026: end-to-end and per-task time "against pre-determined expectation"):
  - Before work of more than one step, estimate the whole and each step in your first message of the task (an opening note counts), and record the request time and plan (in the living handoff file for multi-turn work). Every later footer, across turns and handovers, compares against those numbers; a re-plan is shown beside the original (`planned ~45 min, re-planned 1 h 30`).
  - **Time row** in every footer of a planned task, first reply to last (waiting, answer-only and one-step turns included; only a quick standalone answer has none). Second cell: the time since Andy asked and when (`58 min so far since you asked at 8:58 PM; about 10 more once you answer`; `in all` at the end), naming time spent waiting on him, never subtracting it. Third cell: the planned total and, while work remains, the expected total (`planned ~45 min · expect ~1 h 10`); at the end, the difference (`· 13 over`, `· 5 under`, `· on plan` within 10%). Count queues, usage pauses, failed runs, retries, gates and publishing; never add up parallel steps.
  - **Sources:** now from `date`; Andy's request from T3's run record (`t3_thread_read` with `runLimit`: the `requestedAt` of the run his message started) or the transcript's timestamp; a step from its first request (the `delegate_task` call or a run's `requestedAt`) to its accepted result, through retries and fallbacks (a finished result counts even if a status still says running). If a start can't be read, say so (`request time unknown; at least 40 min`); never substitute a later time.
  - Compare unrounded; show whole minutes (at least 1) in Mac local time (`h:mm PM`). Round estimates up to `~1`, `~2`, `~5` or `~10 min`, then in steps of 5 (`~1 h 15`), and clock ETAs up to the next 5 minutes. Wrap a time or expected total more than a quarter, and at least 5 minutes, over plan in `<span itemprop="over">`.
- **Usage row** (Andy, 20 Oct 2026: "always transparently report expected usage vs quality savings/degradation", with the baseline), in every footer that has a Time row, right after it. Second cell: this task's expected Claude use at the default efforts (the baseline, in 5-hour points, plus week points once it's a point or more), the amount used so far (a task planning no Claude use writes `no Claude use planned`), and any lowered effort with its quality effect in a few words (details in Saved usage). Third cell: the 5-hour window now and its refill (`5-hour 41% · refills 11:00 PM`), adding `· runs out ~10:40 PM at this pace` when `claude-tier` prints a 5-hour pace note. `thread-cost` gives only one Claude session's recent split between context and output, not a task total or plan points, so report "used so far" only from an accounting scoped to this task's lead and child calls, saying what it covers (`about 0.5 so far, this thread only`), or write `used so far: unmeasured`. Converting API-equivalent dollars to points (about $4 per 5-hour point, 20 Oct 2026) is a rough estimate.
- **Saved usage** (Andy, 19 Oct 2026: only "the changes from default, and what impact if any"): one row per change from the default that a usage rule caused this turn (a tier, dire straits, a Codex-gate fallback, a skipped optional reviewer, a lower effort for a helper), and one for this thread's own lowered effort while it's in effect. Give the default, what ran instead and the rule, and the likely quality effect, marked measured (name the test) or your judgment; the third cell gives the rough saving (`~1 Claude point`, `under 10% of a turn`, `unmeasured`). Put the change in `<span itemprop="saved">`. Nothing changed, no row.
- **Made so far** (Andy, 12 Nov 2026: a section "for anything non-text created in the thread (and have it survive handoffs) … so I don't have to scroll up to find these things"; his six card answers that evening set the rest). From the reply in which the thread first makes something for Andy to open, every footer carries the list, right after the plan table and above the team rundown, quick answers included; a thread that has made nothing has no list.
  - **Shape:** `<details>` (never `open`: the ✦ add-ons open short lists in a wide pane), the summary `<span itemprop="made">Made so far</span> · N: ` then how many of each kind, its name in lower case and singular for one (`· 14: 3 pages, 3 audio, 8 visuals`; `· 3: 1 page, 1 audio, 1 visual`; `2 videos`, but `audio` never takes an s). Then a blank line and a three-column table, one thing per row, whose first row doubles as the header row (as `Lead` does in the team rundown), so the `|---|---|---|` line is always the second line, also after a new first row goes in above it. Its columns: the kind, on the first row of its group only; the thing's name in plain words, as the link; a note.
  - **Listed:** things made for Andy to open, and only those: pages and sites, Claude artifacts and phone pages (`Pages`); `Audio`; `Video`; visuals shown inline in the thread (`Visuals`); `Images`; and `Documents` (PDFs, slides, spreadsheets, a data export made for him). Never repos, pull requests or code. Never your own working files (briefs, logs, handoff files, and checks or screenshots he wasn't shown). Anything non-text you showed him or linked for him in a reply, or made because he asked, is a thing made for him. Things your helpers made for him count. Kinds in that order, empty kinds left out, newest first inside a kind (by when each thing was made or last changed). One row per thing: a visual you redraw or a page you publish keeps its row, with the link and note updated; versions made for him to compare keep a row each.
  - **Notes:** what he gets or where it is, then when it was made or last changed: `public site · 9 Nov` (only when it really is public), `phone page · 7 Nov`, `in this thread · 8:51 PM` (shown inline), `earlier thread · 8 Nov` (made before a handover), `41 min long · 9 Nov`. A clock time for today, a date otherwise. A thing that opens only on his Mac (a local file) starts its note with `<span itemprop="mac-only">Mac only · </span>`; the add-ons hide those words inside the Mac app.
  - **Links** open the thing itself: a published page, site or artifact by its live URL; everything else, a page not yet published included, by the absolute path of the copy you saved. So link the lasting copy where there is one (a project folder, a skill's output folder); otherwise save every visual you show inline, and every audio, video, image or document you make for him, in the thread's work folder under `~/Library/Caches` (make one if the thread has none; never the scratchpad or `/tmp`, and never T3's own attachment copy, which may not last), and show an inline visual from that saved file (`html_render` takes its path). If the thing moved, update its link. If its link no longer works, the row stays, named without a link and without `Mac only`; its note says `no longer opens · 8 Nov`, or `deleted · 8 Nov` only when you know it was deleted. The date stays as it was. A secret-bearing link never appears, and a page that logs its opens is named without its link (**Links**).
  - **Kept** in the handoff file's section 9, `Made in this thread` (the same three columns, each thing's date and time in full; `Nothing yet` until there is one), updated in the turn a thing is made or changes; the footer shows that section's rows (not its `| Kind | Thing | Note |` header line, when it has one), each with a clock time for today or a date otherwise. A thread with no handoff file copies the list forward from its last footer, turning an earlier day's clock times into dates, and copies it into section 9 when it starts a file. After a handover the new thread first changes `in this thread` to `earlier thread` in section 9's notes (its heading stays `Made in this thread`), then shows the whole list from its first footer on. A row leaves the list only when Andy asks.
- **Team rundown,** only when another agent started or reported this turn: `<details open><summary>Team · Opus wrote this reply, with Sol and Astra</summary>`, a blank line, a table headed `| Lead | <this reply's exact model> *effort* | wrote this reply |`, then one row per agent grouped by role (Gatekeeper for pre-OK and final OK, Reviewer, Builder, Researcher; the closest fit; the role on its group's first row only): exact model and effort, then job · status (`running`, how long once done, or a failure in `<span itemprop="failed">`); a blank line, then `</details>`. Always write `open`; the ✦ add-ons panel decides how Andy sees it.
- **The `<sub>` line:** `Needs you --`, `Decided for you --` and `Skills --` for each empty field; `Skills: …` (invoked this turn) and `Notes: …` when they have content; `Written by <exact model> <effort>` when there's no rundown; then the usage.
- **Markup:** the verdict in `<span itemprop="settle-yes">` or `settle-no`; the `running`, `failed`, `over`, `saved`, `made` and `mac-only` spans above; `<ins>` on the words Andy acts on (`<ins>Reply</ins>`, `<ins>Sign in</ins>`); `~~…~~` only on Done steps and Answered items; bold only item topics. No other markup, no model pills, no ⚡ or 🔶.

**Verdict** (it tells Andy whether the thread is finished; T3: Cmd+Shift+S).
- `🟢 Safe to settle` is the most conservative reading of "finished" (Andy, 22 Oct 2026: "rely on the settle as the most conservative interpretation of can settle … what I want to get out of the original and followup requests and if those have actually been achieved or not. not just are there any open tasks left"). Before choosing it, reread his original request and every follow-up in the thread, name the outcome each was for (what he wanted to get, not the steps you listed), and check each against evidence seen this session (a test run, the live page, the file, the command's output), never a worker's self-report, a plan's tick or memory. When in doubt, red.
- Green only if every such outcome is achieved and checked (or Andy dropped it), with no known caveat, partial fix, untested required path, "should work", workaround, or remaining follow-up that leaves a requested outcome unachieved; and, as the reply ends, nothing is open, nothing you started is running or due to report here (agents, background commands, PR watches, scheduled tasks reporting here, servers needing stopping), and you've promised no more here. Read "running" from T3's own task state, not from files or memory: check `task_status` (or `t3_thread_list` with `includeSubagents`) for every task this thread started. A task whose result is already in hand but still shows running gets closed with `task_cancel` first, since T3 keeps the thread under Working while it shows; never close one whose work isn't finished. A top-level thread you launched for Andy that doesn't report here doesn't count.
- Otherwise `🔴 Don't settle yet`, reason `paused for 1 and 2` when you're idle until Andy acts, else what's still going plus any open count (`refresh running`, `2 open; review running`), or the unmet outcome (`fix unverified on phone`, `follow-up 2 not achieved`).
- **Quick verify close** (Andy, 22 Oct 2026): before proposing green, spend about 1–3 minutes checking the actual final result against the original and follow-up outcomes, using existing evidence and tools. For a page, UI, document or visual artifact, open/render the final version at the intended reading width, inspect the screenshot for legibility, and exercise the critical requested interaction. For behavior, use the smallest meaningful test or saved replay; for promised performance, use measured end-to-end timing for that scope. Show the proof to Andy when useful, otherwise inspect it yourself and name the concrete observation in the Goals line. Changed instructions, hashes, a build or a worker's “done” alone do not demonstrate changed behavior. If required proof is missing or unclear, stay red and name the exact missing check, its owner and wake condition.
- **Keep verification relevant and simple** (Andy, 22 Oct 2026): run a test only when it can expose a material failure in the requested outcome, such as wrong output, a crash on valid use, lost work, a leak or broken promised behavior. Prefer the real failing example or a representative saved case. Skip implementation-mirroring assertions, contrived checks that cannot find a consequential failure, and extra bookkeeping such as a mandatory proof JSON record. Reuse sufficient evidence; do not add a model batch, a new approval, exhaustive device testing or speculative work just to close. A completed lead turn can still have a live child; check actual task state. An unrelated untested path does not create a new requirement. Keep existing permission gates and protected independent reviews. A verdict never overrides a keep-unsettled instruction; auto-settlement still requires explicit approval.
- **Goals check:** a green verdict on a planned task or a thread with follow-ups comes with one short body line per request: `Goals: 1. <outcome> — achieved (<evidence>); 2. …`. Any outcome you can't write as achieved with evidence makes it red. A quick standalone answer needs none. Say when you'll continue only if a resume is actually set up; for PR watches, say settling stops them. Offers and finished pages left open never make it red. Never cancel or skip work to reach green. 🟢 and 🔴 appear only in the verdict; never use ✅.
- Never settle the thread yourself (`t3_thread_organize`) without Andy's explicit request (his standing one: an old thread settles itself right after a handover); the verdict only reports readiness. Outside T3, write `🟢 Wrapped up` or `🔴 Not wrapped up yet`, with the same test.

**Needs you.**
- Every open item, even while other work continues: only questions, decisions, risky approvals or actions Andy must handle before work can proceed (signing in, entering a secret, clicking in an app); not your next steps, running agents, offers or choices you can make. Never invent items or request approvals already given.
- Each row: `**N. Topic** · …` (number inside the bold), about 40 words, naming the actual thing and what it blocks, standing alone, with `<ins>` on the words he acts on. Actions say where to do it and how to report completion. Send sign-ins and secrets to a private place, never chat.
- With a card open, end the row with "Answer the open card" and give no options. Without a usable card, give a ballot: stable option letters, recommendation first and marked, brief reasons and who favours each, then every valid reply. `all` takes your last ballot's recommendations, never marking actions done; `explain N` gets item N explained.
- Keep an open item's number. A new item gets one above the highest used since the list was last empty; restart at 1 only when it's empty. Repeat unresolved items in every later reply with `(still open)` until resolved, explicitly dropped by Andy or irrelevant.

**Ask with buttons when you can.**
- Use allowed question tools within their limits (Claude's `AskUserQuestion`: four questions of four options; synchronous Codex `request_user_input`: three of three; async tools: their own schemas), with every eligible open item in a card. Blocking tools: finish independent work, raise cards, handle answers, then finish the turn. Async tools: raise cards, keep working, finish with unanswered items open, handle answers on arrival. Never duplicate pending cards; wait for a batch to return before the next.
- Use footer ballots when tools are unavailable or disallowed, options don't fit or cards were dismissed. After `Not now` or dismissal, keep the items open and don't reopen cards that turn unprompted; offer again when Andy asks or context changes. Subagents report to their coordinator, never ask Andy.
- **In a card:** one question per item, in footer order, headed `<number>. <topic>` (12 characters maximum), naming the thing and ending with what it blocks; the last option is always `Explain and ask me more`. Decisions get at most three real options in Claude, two in synchronous Codex, recommendation first with `(Recommended)` in its label, each with a short reason and who favours it; if they don't fit, use a footer ballot. Actions get `Done` and `Not now`. When idle until Andy acts, start the question with "I'm waiting on you now:" and notify him, naming the item: `osascript -e 'display notification "…" with title "T3 needs you"'`. Explain keeps the item open: explain with an example per option, ask a follow-up or two about what matters to him, then ask again, as often as he wants.
- **Offers** go in a card whenever cards are possible (the turn's card or one of their own; a T0 effort offer stays one body line), headed `Optional`, with `Yes, do it`, `No thanks` and `Explain and ask me more`. They aren't open items, never enter Needs you or turn the verdict red; closing the card declines them. An offer or question left only in the body is a miss: Andy sees something the footer and cards don't show.
- **Who favours it:** only models' stated views, never invented agreement, including any option a reviewer wanted (`Opus, Sol and Astra agree`, `Sol prefers B`, `my view only`). Don't consult models just to fill it, except on gate-covered calls (substantial work, published artifacts or skills), where one quick Sol or Astra opinion (Codex gate) or Opus subagent is worthwhile.
- **Defaults:** recommendations come first (one click or the `1` key; T3 pre-selects nothing). On an explicit dismiss or cancel, take the recommendation for each easily undone choice and record it under Decided for you, never as answered. Hard-to-undo choices, anything leaving his Mac (publishing, deleting, sending, paying, force-pushing) and all actions stay open. Pending async cards, missing answers and unexplained tool errors aren't dismissals; otherwise silence approves nothing.
- **Resolution:** valid decisions and approvals resolve questions (write-ins count); `Done` resolves an action only when it's complete; `Not now` defers it, keeping it open unless Andy drops it. Show each newly resolved item once in the Answered row, struck through with its answer (`~~1. Hosting~~ tailnet`), outside the open count. Start the row with `🎉 All answered, thanks!` only in the first footer after the last open item resolves; 🎉 doesn't change the verdict test.
- The body holds the reasoning; the footer lists. Keep each item's number the same in body, cards and footer.

**Links** (Andy, 16 Oct 2026; Sol, Astra and Gemini agreed). Put each link inline where its thing is named, never on a line of its own: this turn's new or updated main deliverable in the Done row that made it; an open item's page, PR, file, doc or thread inside its Needs you row, repeated while it stays open; a just-resolved item's link once, beside its Answered receipt. When the same deliverable also appears in Done, keep its link only in Answered. Leave out other recent links. The Made so far list (**Layout**) is separate: it repeats each thing the thread has made in every footer, takes none of these links out of the plan rows, and doesn't count against "give it once"; secret-bearing links and pages that log their opens keep their limits there too. An inline visual's link in the list is its saved file, a real link, so "named, not linked" doesn't apply to it there. Usually give one per item, the thing Andy would open; if one link fits twice, give it once, in the open item. Label each in plain words. Local files take an absolute path (in a Markdown link, wrap one with spaces in `<…>`). Never invent a link (a page shown only inline is named, not linked), never link anything secret-bearing (tokens, webhook URLs) or change sharing to get a link, and say when a link has stopped working. A page that logs its opens (such as a blind reading test) gets its URL once per thread, then only its name, since Mac link previews fetch links. Links change no counts, cards or verdict.

**Explain every reference where it appears** (Andy, 16 Oct 2026: "I'm a human, I don't automatically know what that is referencing"). Whenever a reply names something from earlier work (a plan step, rule, item, test, batch, file, codename or count), add a short plain-English explanation in parentheses right there, every time, even if explained before or in the same reply's footer, cards or questions. Example: "…with rule 3 (judge a reply together with the post it replies to), on production's 1,138 unclear posts (the 3% that September's Gemini run couldn't call funny or not)…", not "…with rule 3, on the 1,138 unclears…".

**Team and usage.**
- Name models exactly (`Claude Opus 5.5`, `GPT-6.1-Sol`, `Gemini 4 Argon`) in the team rundown and `Written by`; the who-and-when cells use the short names. Read your own with `t3_thread_configuration` once per T3 session and after changes; elsewhere use session settings or `effort unknown`; never guess. List every agent you started or that reported this turn (subagents, `delegate_task` children, `codex exec` runs) with its exact launch model and effort.
- Effort is the level alone (`*xhigh*`), never the word "effort"; Gemini 4 Argon (High) is `*high*`. Add `Fast` after it only for Claude Fast mode or Codex's Fast tier; name Ultracode, Ultrathink or Codex's ultra as the effort when used. `Notes:` in the small line holds other required notices (`gates skipped (small task)`, Codex work moved to Claude, `this thread runs at max (your pick)`).
- The usage ends the `<sub>` line, exactly as `claude-tier` or `lab-usage` prints it after `footer:` (e.g. `Claude usage: protecting · 23.0 of 9.8 points today`), or `Claude usage: protected (effort test)` for protected work, or `Claude usage: unknown` with no reading.
- The footer is only for Andy. Agent-assigned work (subagent briefs, `delegate_task` prompts, agent- or script-started `codex exec` runs) omits it and ends with one line: `Model/effort: …; skills used: …; agents: …; needs Andy: …` (what only he can decide or do, or none). Ask your subagents for it; carry their "needs Andy" items into Needs you in your own words.

**Before sending,** check: footer present; the verdict test and its span, with "running" read from T3's task state; every question or offer in the body also in a card or a Needs you row; times from `date` against the plan, the Time row and the Usage row; a Saved usage row for every change a usage rule made; every unresolved item with number, link and `(still open)`, above the step it unblocks; receipts once, in Answered only; three cells and one line per row, each literal `|` escaped; exact models and efforts in the rundown or `Written by`; the Made so far list when the thread has made anything for Andy to open, matching the handoff file's section 9 when there is one; the usage line.

This section is the same in `~/.claude/CLAUDE.md`, `~/.codex/AGENTS.md` and `~/.gemini/GEMINI.md`; change all three together.

