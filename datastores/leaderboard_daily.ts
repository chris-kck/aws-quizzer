import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

/**
 * Aggregated daily leaderboard, keyed by YYYY-MM-DD|quiz_type
 * scores: { [user_id]: { correct: number, total: number } }
 */
export const LeaderboardDaily = DefineDatastore({
  name: "LeaderboardDaily",
  primary_key: "id",
  attributes: {
    id: { type: Schema.types.string },
    quiz_type: { type: Schema.types.string },
    date: { type: Schema.types.string }, // YYYY-MM-DD
    scores: { type: Schema.types.object },
  },
  indexes: ["date", "quiz_type"],
});


