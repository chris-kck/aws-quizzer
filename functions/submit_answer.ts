import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const SubmitAnswer = DefineFunction({
  callback_id: "submit_answer",
  title: "Submit Answer",
  source_file: "functions/submit_answer_handler.ts",
  input_parameters: {
    properties: {
      user_id: { type: Schema.types.string },
      question_id: { type: Schema.types.string },
      quiz_type: { type: Schema.types.string },
      choice_ids: { type: Schema.types.array, items: { type: Schema.types.string } }, // supports multi-answer
    },
    required: ["user_id", "question_id", "quiz_type", "choice_ids"],
  },
  output_parameters: {
    properties: {
      isCorrect: { type: Schema.types.boolean },
      explanation: { type: Schema.types.string },
    },
    required: ["isCorrect"],
  },
});


