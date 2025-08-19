import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

/**
 * Tracks which questions a user has seen today to prevent repeats.
 * TTL should be set (seconds since epoch) when writing - e.g. 24h.
 */
export const UserSeenQuestion = DefineDatastore({
  name: "UserSeenQuestion",
  primary_key: "id",
  attributes: {
    id: { type: Schema.types.string }, // e.g. `${user_id}|${question_id}`
    user_id: { type: Schema.types.string },
    question_id: { type: Schema.types.string },
    quiz_type: { type: Schema.types.string },
    seen_at: { type: Schema.types.integer },
    ttl: { type: Schema.types.integer }, // epoch seconds to expire
  },
  indexes: ["user_id", "quiz_type"],
});


