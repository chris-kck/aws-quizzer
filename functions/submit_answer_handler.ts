import { SlackFunction } from "deno-slack-sdk/mod.ts";
import { SubmitAnswer } from "./submit_answer.ts";
import { Question } from "../datastores/question.ts";
import { UserSeenQuestion } from "../datastores/user_seen_question.ts";
import { LeaderboardDaily } from "../datastores/leaderboard_daily.ts";

/**
 * Evaluate answer(s), mark question as seen (24h TTL), update daily leaderboard.
 * Returns isCorrect boolean and explanation.
 */
export default SlackFunction(SubmitAnswer, async ({ inputs, client }) => {
  const { user_id, question_id, quiz_type, choice_ids } = inputs as any;

  // Fetch question
  const q = await client.apps.datastore.get({ datastore: Question.name, id: question_id });
  const answer_ids: string[] = q.item?.answer_ids ?? [];

  // Compare sets for exact match (order doesn't matter)
  const correctSet = new Set(answer_ids.map((s) => s.trim()));
  const chosenSet = new Set(choice_ids.map((s) => s.trim()));
  const isCorrect = (correctSet.size === chosenSet.size) &&
    [...correctSet].every((a) => chosenSet.has(a));

  // Mark seen with TTL 24h
  const ttl = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
  await client.apps.datastore.put({
    datastore: UserSeenQuestion.name,
    item: { id: `${user_id}|${question_id}`, user_id, question_id, quiz_type, seen_at: Date.now(), ttl },
  });

  // Update leaderboard for today
  const date = new Date().toISOString().slice(0, 10);
  const lid = `${date}|${quiz_type}`;
  const existing = await client.apps.datastore.get({ datastore: LeaderboardDaily.name, id: lid });
  const scores = existing.item?.scores ?? {};
  const cur = scores[user_id] ?? { correct: 0, total: 0 };
  scores[user_id] = { correct: cur.correct + (isCorrect ? 1 : 0), total: cur.total + 1 };
  await client.apps.datastore.put({ datastore: LeaderboardDaily.name, item: { id: lid, quiz_type, date, scores } });

  return { outputs: { isCorrect, explanation: q.item?.explanation ?? "" } };
});


