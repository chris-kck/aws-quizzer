import { Manifest } from "deno-slack-sdk/mod.ts";
import { Question } from "./datastores/question.ts";
import { UserProfile } from "./datastores/user_profile.ts";
import { UserSeenQuestion } from "./datastores/user_seen_question.ts";
import { LeaderboardDaily } from "./datastores/leaderboard_daily.ts";

export default Manifest({
  name: "aws-quizzer",
  description: "Daily AWS quizzes + leaderboards",
  icon: "assets/icon.png",
  workflows: [], // add workflows after scaffolding
  datastores: [Question, UserProfile, UserSeenQuestion, LeaderboardDaily],
  // Required scopes for features used in this scaffold
  botScopes: [
    "chat:write",
    "commands",
    "app_mentions:read",
    "users:read",
    "triggers:write",
    "datastore:read",
    "datastore:write",
    "reactions:write"
  ],
});


