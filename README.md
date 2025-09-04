# aws-quizzer (Slack Deno app)

A Slack app skeleton for daily quizzes & leaderboards using Slack's Deno SDK. Supports single and multi-answer questions and CSV import.

eg https://docs.slack.dev/tools/deno-slack-sdk/tutorials/virtual-running-buddies-app/#datastore

## Quick Start (dev)
1. Install Slack CLI (follow Slack docs) and Deno (https://deno.land).
2. `slack login`
3. Add app credentials & environment variables in Slack CLI configuration or your environment:
   - `SLACK_BOT_TOKEN` (xoxb-...)
   - `SLACK_SIGNING_SECRET`
4. `slack deploy --remote` to push the manifest & datastores
5. Use `slack run` to test functions locally and simulate triggers
6. Create datastores and run the CSV import command (or via slash command) with `sample_questions.csv`

## CSV format
See `sample_questions.csv`. For multi-answer, use `B|C` in `answer_keys`.

## Developer notes
- Datastores: Question, UserProfile, UserSeenQuestion, LeaderboardDaily.
- Functions:
  - `get_next_question` -> picks unseen question.
  - `submit_answer` -> evaluates and updates leaderboard.
  - `import_questions` -> CSV upload/parse.
- Views:
  - Build modals with `views.open` and render single-question modals using `views/question_modal.ts`.
- TTL & non-repeat:
  - When marking seen, set `ttl` of UserSeenQuestion to now + 24h (epoch seconds). This prevents repeats in a day.

## Testing payload examples
- `get_next_question` input:
```json
{ "user_id": "U123", "quiz_type": "CP" }

	•	submit_answer input:

{ "user_id": "U123", "question_id": "q-uuid", "quiz_type": "CP", "choice_ids": ["B"] }

Next steps
	•	Implement scheduled dispatcher workflow that iterates opted-in users and calls get_next_question.
	•	Wire Block Kit modal submit events to submit_answer.
	•	Build App Home rendering for leaderboard and opt-in settings.

---
16) Add `tests/payloads/get_next_question.json` and `tests/payloads/submit_answer.json` with sample JSON shown in README.

---

**Extra implementation & UX notes** (include in your project README or create `NOTES.md`):
- UI: For single-answer questions use `radio_buttons`. For multi-answer use `checkboxes`. The `answer_submit` action will contain either one `selected_option` or an array `selected_options` depending on block type — but in the Deno function payload, normalize to `choice_ids` array.
- Leaderboard ranking: sort by `correct` desc, tie-breaker `total` asc (or whatever you prefer). You can compute percent as `correct/total`.
- Rate-limiting: clamp `daily_limit` (default 3) to prevent leaderboard being dominated by volume. You can reward streaks separately.
- Scheduling: use Slack workflow triggers (cron) to run dispatcher at times of day (e.g., 09:00 & 15:00 local time). Respect user timezone setting in `UserProfile`.
- Non-repeats: store `UserSeenQuestion` entries with TTL (24h). On midnight UTC you will get new pool. If a user exhausts pool, either notify them or allow repeats after 24h.
- CSV import: prefer the Deno std CSV parser (used here). For collaborative editing, consider Google Sheets integration and a periodic sync.

---

**Testing & local run hints**
- Use `slack run` to simulate `views.open` and the view_submission event.
- Use `slack invoke` (or Slack CLI simulation features) to run `get_next_question` and `submit_answer` with sample payloads.
- Populate Question datastore using `commands/import_questions.ts` with `sample_questions.csv`.

---

**Deliverable**: create all files above, plus tests/payloads and `NOTES.md`. Provide console commands in `README.md` to `slack login`, `slack deploy`, and `slack run`.
