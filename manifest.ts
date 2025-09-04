import { Manifest } from "deno-slack-sdk/mod.ts";
import { Question } from "./datastores/question.ts";
import { UserProfile } from "./datastores/user_profile.ts";
import { UserSeenQuestion } from "./datastores/user_seen_question.ts";
import { LeaderboardDaily } from "./datastores/leaderboard_daily.ts";
import SampleWorkflow from "./workflows/sample_workflow.ts";
import SampleObjectDatastore from "./datastores/sample_datastore.ts";

export default Manifest({
  name: "aws-quizzer",
  description: "Daily AWS quizzes + leaderboards",
  icon: "assets/icon.png",
  "features": {
    "app_home": {
      "home_tab_enabled": true,
      "messages_tab_enabled": true,
      "messages_tab_read_only_enabled": false
    },
    "bot_user": {
      "display_name": "zork"
    },
    "slash_commands": [
      {
        "command": "/zork",
        "description": "You see a mailbox in the field.",
        "usage_hint": "/zork open mailbox",
        "url": "https://example.com/slack/slash/please"
      }
    ]
  },
  workflows: [ SampleWorkflow ], // add workflows after scaffolding
  datastores: [Question, UserProfile, UserSeenQuestion, LeaderboardDaily, SampleObjectDatastore],
  // Required scopes for features used in this scaffold
  botScopes: [
    "chat:write",
    "chat:write.public",
    "commands",
    "app_mentions:read",
    "users:read",
    "triggers:write",
    "datastore:read",
    "datastore:write",
    "reactions:write"
  ],
});


