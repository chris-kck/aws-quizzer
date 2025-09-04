import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { buildQuestionModal } from "../views/question_modal.ts";

export const OpenQuestionModal = DefineFunction({
  callback_id: "open_question_modal",
  title: "Open Question Modal",
  source_file: "functions/open_question_modal.ts",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
      question: { type: Schema.types.object },
      index: { type: Schema.types.number },
      total: { type: Schema.types.number },
    },
    required: ["interactivity", "question"],
  },
});

export default SlackFunction(OpenQuestionModal, async ({ inputs, client }) => {
  const { interactivity, question, index = 1, total = 1 } = inputs as any;
  if (!question) return { outputs: {} };
  await client.views.open({
    trigger_id: interactivity?.interactivity_pointer,
    view: buildQuestionModal(question, index, total),
  });
  return { outputs: {} };
});


