/**
 * Helper function that returns a Block Kit view for one question.
 * If question.answer_ids length > 1 -> render checkboxes (multi-answer)
 * else -> render radio_buttons (single-answer).
 *
 * This file exports a function `buildQuestionModal(question, index, total)`
 */
export function buildQuestionModal(question: any, index = 1, total = 3) {
  const qText = `*${question.quiz_type}* — Q${index} of ${total}\n${question.question}`;
  const choices = (question. choices || []).map((c: any) => {
    return {
      text: { type: "plain_text", text: c.label },
      value: c.id,
    };
  });

  const isMulti = (question.answer_ids ?? []).length > 1;
  const answerBlock = isMulti ? {
    type: "input",
    block_id: "answers",
    element: {
      type: "checkboxes",
      action_id: "answer_submit",
      options: choices.map((o: any) => ({ text: { type: "plain_text", text: o.text.text }, value: o.value })),
    },
    label: { type: "plain_text", text: "Select all that apply" },
  } : {
    type: "input",
    block_id: "answers",
    element: {
      type: "radio_buttons",
      action_id: "answer_submit",
      options: choices.map((o: any) => ({ text: { type: "plain_text", text: o.text.text }, value: o.value })),
    },
    label: { type: "plain_text", text: "Choose one" },
  };

  return {
    type: "modal",
    callback_id: "quiz_modal",
    private_metadata: JSON.stringify({ question_id: question.id }),
    title: { type: "plain_text", text: "AWS Quiz" },
    submit: { type: "plain_text", text: "Submit" },
    close: { type: "plain_text", text: "Skip" },
    blocks: [
      { type: "section", text: { type: "mrkdwn", text: qText } },
      answerBlock,
      { type: "context", elements: [{ type: "mrkdwn", text: `Q ${index} of ${total} • difficulty: ${question.difficulty ?? "n/a"}` }] },
    ],
  };
}


