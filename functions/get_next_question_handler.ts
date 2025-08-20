import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { GetNextQuestion } from "./get_next_question.ts";
import { Question } from "../datastores/question.ts";
import { UserSeenQuestion } from "../datastores/user_seen_question.ts";

/**
 * Fetch a random unseen question for the user for a specific quiz_type.
 * Uses UserSeenQuestion to filter repeats for 24h period.
 */
export default SlackFunction(GetNextQuestion, async ({ inputs, client }) => {
  const { user_id, quiz_type } = inputs as any;

  // Query seen questions for today (limit 100)
  const seenRes = await client.apps.datastore.query({
    datastore: UserSeenQuestion.name,
    expression: "#uid = :uid AND #qt = :qt",
    expression_attributes: { "#uid": "user_id", "#qt": "quiz_type" },
    expression_values: { ":uid": user_id, ":qt": quiz_type },
    limit: 100,
  });
  const seenSet = new Set((seenRes.items ?? []).map((i: any) => i.question_id));

  // Query Question pool for quiz_type (sample up to 200)
  const qres = await client.apps.datastore.query({
    datastore: Question.name,
    expression: "#qt = :qt",
    expression_attributes: { "#qt": "quiz_type" },
    expression_values: { ":qt": quiz_type },
    limit: 200,
  });

  const pool = (qres.items ?? []).filter((q: any) => !seenSet.has(q.id));
  if (!pool.length) {
    // No unseen questions left
    return { outputs: { question: null } };
  }
  const next = pool[Math.floor(Math.random() * pool.length)];
  // return the question object (includes choices, question.id, difficulty)
  return { outputs: { question: next } };
});


