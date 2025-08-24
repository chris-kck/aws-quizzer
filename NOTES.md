# NOTES: Interactivity wiring and modal handling

This app uses Block Kit modals to show a question and collect answers. Here is the exact wiring for opening the modal and normalizing payloads for single- vs multi-answer questions.

## Open modal (views.open)
Use the Slack client to open the modal built by `views/question_modal.ts`.

```ts
// Example: inside a handler after fetching the next question
import { buildQuestionModal } from "./views/question_modal.ts";

const question = /* result from get_next_question */;
await client.views.open({
  trigger_id, // from the action payload
  view: buildQuestionModal(question, 1, 3),
});
```

- `callback_id` on the modal is `quiz_modal`.
- The answer input uses `block_id: "answers"` and `action_id: "answer_submit"`.
- For multi-answer questions: element is `checkboxes` with `selected_options`.
- For single-answer questions: element is `radio_buttons` with `selected_option`.

## action_id handlers and payload normalization
Listen to `view_submission` for `callback_id: quiz_modal`. Extract the selected option(s) from `state.values["answers"].answer_submit`.

```ts
// Pseudo-code / example with Deno Slack SDK style
export default async function handleViewSubmission(event: any, client: any) {
  if (event.type === "view_submission" && event.view?.callback_id === "quiz_modal") {
    const pm = JSON.parse(event.view.private_metadata || "{}");
    const questionId = pm.question_id;

    const state = event.view.state?.values || {};
    const answer = state["answers"]["answer_submit"]; // element payload

    // Normalize to choice_ids: string[]
    let choice_ids: string[] = [];
    if (answer?.type === "checkboxes") {
      choice_ids = (answer.selected_options || []).map((o: any) => o.value);
    } else if (answer?.type === "radio_buttons") {
      if (answer.selected_option?.value) choice_ids = [answer.selected_option.value];
    }

    // Call submit_answer function
    await client.workflows.steps.complete({
      outputs: { choice_ids, question_id: questionId },
    });

    return { response_action: "clear" };
  }
}
```

Alternatively, if listening to `block_actions` for live changes on `answer_submit` action_id, your filter is:

- `payload.type === "block_actions"`
- `payload.actions[0].action_id === "answer_submit"`
- Extract similarly from `payload.actions[0].selected_option` (radio) or `selected_options` (checkboxes).

## Example normalization helper

```ts
export function normalizeChoiceIdsFromAction(action: any): string[] {
  if (!action) return [];
  if (action.type === "checkboxes") {
    return (action.selected_options || []).map((o: any) => o.value);
  }
  if (action.type === "radio_buttons") {
    return action.selected_option?.value ? [action.selected_option.value] : [];
  }
  return [];
}
```

## Leaderboard ranking suggestion
- Sort by `correct` desc.
- Tie-breaker by `total` asc.
- Optionally compute percentage `correct/total` to display.

## Scheduling suggestion
- Use two cron triggers (e.g., 09:00 and 15:00) to call a dispatcher workflow.
- Dispatcher reads `UserProfile` for users opted into the relevant `quiz_type` and invokes `get_next_question` for each.
- Respect `timezone` when scheduling per-user or enqueue messages accordingly.

## Rate-limiting
- Cap `daily_limit` for questions per user (default 3).
- Optionally implement streak tracking and award bonus points.

```ts
// Example streak increment
scores[user_id] = {
  correct: cur.correct + (isCorrect ? 1 : 0),
  total: cur.total + 1,
  // streak: isCorrect ? (cur.streak ?? 0) + 1 : 0,
};
```
