import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const GetNextQuestion = DefineFunction({
  callback_id: "get_next_question",
  title: "Get Next Question",
  source_file: "functions/get_next_question_handler.ts",
  input_parameters: {
    properties: {
      user_id: { type: Schema.types.string },
      quiz_type: { type: Schema.types.string },
    },
    required: ["user_id", "quiz_type"],
  },
  output_parameters: {
    properties: {
      question: { type: Schema.types.object },
    },
    required: ["question"],
  },
});


