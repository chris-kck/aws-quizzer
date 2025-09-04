import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { buildQuestionModal } from "../views/question_modal.ts";
import { Question } from "../datastores/question.ts";
import { UserSeenQuestion } from "../datastores/user_seen_question.ts";

export const OpenQuestionModal = DefineFunction({
  callback_id: "open_question_modal",
  title: "Open Question Modal",
  source_file: "functions/open_question_modal.ts",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
      question: { type: Schema.types.object },
      user_id: { type: Schema.slack.types.user_id },
      quiz_type: { type: Schema.types.string },
      index: { type: Schema.types.number },
      total: { type: Schema.types.number },
    },
    required: ["interactivity"],
  },
});

export default SlackFunction(OpenQuestionModal, async ({ inputs, client }) => {
  const { interactivity, index = 1, total = 1 } = inputs as any;
  let question = (inputs as any).question as any;
  const user_id = (inputs as any).user_id as string | undefined;
  const quiz_type = (inputs as any).quiz_type as string | undefined;

  // If question not provided, try to fetch using user_id and quiz_type
  if (!question && user_id && quiz_type) {
    const seenRes = await client.apps.datastore.query({
      datastore: UserSeenQuestion.name,
      expression: "#uid = :uid AND #qt = :qt",
      expression_attributes: { "#uid": "user_id", "#qt": "quiz_type" },
      expression_values: { ":uid": user_id, ":qt": quiz_type },
      limit: 100,
    });
    const seenSet = new Set((seenRes.items ?? []).map((i: any) => i.question_id));

    const qres = await client.apps.datastore.query({
      datastore: Question.name,
      expression: "#qt = :qt",
      expression_attributes: { "#qt": "quiz_type" },
      expression_values: { ":qt": quiz_type },
      limit: 200,
    });
    const pool = (qres.items ?? []).filter((q: any) => !seenSet.has(q.id));
    if (pool.length) {
      question = pool[Math.floor(Math.random() * pool.length)];
    }
  }

  if (!question) return { outputs: {} };
  await client.views.open({
    trigger_id: interactivity?.interactivity_pointer,
    view: buildQuestionModal(question, index, total),
  });
  return { outputs: {} };
});


