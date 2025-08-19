import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

/**
 * Stores per-user settings and opt-in preferences.
 */
export const UserProfile = DefineDatastore({
  name: "UserProfile",
  primary_key: "user_id",
  attributes: {
    user_id: { type: Schema.types.string },
    display_name: { type: Schema.types.string },
    quiz_type_opt_in: { type: Schema.types.array, items: { type: Schema.types.string } }, // e.g. ["CP","SAA"]
    daily_limit: { type: Schema.types.number }, // number of questions per day
    time_window: { type: Schema.types.string }, // e.g. "09:00-17:00"
    timezone: { type: Schema.types.string }, // IANA tz
  },
});


