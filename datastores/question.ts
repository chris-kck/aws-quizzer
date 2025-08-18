import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

/**
 * Stores quiz questions.
 * - `answer_ids` is an array supporting multi-answer questions (e.g. ["B","C"])
 * - `choices` is an array of objects { id: "A", label: "..." }
 */
export const Question = DefineDatastore({
  name: "Question",
  primary_key: "id",
  attributes: {
    id: { type: Schema.types.string },
    quiz_type: { type: Schema.types.string }, // CP | DVA | SAA | AI
    question: { type: Schema.types.string },
    choices: { type: Schema.types.array, items: { type: Schema.types.object } },
    answer_ids: { type: Schema.types.array, items: { type: Schema.types.string } },
    explanation: { type: Schema.types.string },
    tags: { type: Schema.types.array, items: { type: Schema.types.string } },
    difficulty: { type: Schema.types.string },
    hash: { type: Schema.types.string }, // optional stable hash for dedupe
  },
  indexes: ["quiz_type"],
});


