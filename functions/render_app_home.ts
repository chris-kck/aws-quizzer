import { DefineFunction, SlackFunction } from "deno-slack-sdk/mod.ts";
import { LeaderboardDaily } from "../datastores/leaderboard_daily.ts";
import { buildAppHomeView } from "../app_home/render_home.ts";

// Renders the App Home for a user using buildAppHomeView
export const RenderAppHome = DefineFunction({
  callback_id: "render_app_home",
  title: "Render App Home",
  source_file: "functions/render_app_home.ts",
  input_parameters: { properties: { user_id: { type: "string" } }, required: ["user_id"] },
});

export default SlackFunction(RenderAppHome, async ({ inputs, client }) => {
  const user_id = (inputs as any).user_id as string;
  const date = new Date().toISOString().slice(0, 10);

  // Query all leaderboard docs for today (any quiz_type)
  const res = await client.apps.datastore.query({
    datastore: LeaderboardDaily.name,
    expression: "#d = :d",
    expression_attributes: { "#d": "date" },
    expression_values: { ":d": date },
    limit: 50,
  });

  // Aggregate personal and top scores across quiz types for the day
  let personal = { correct: 0, total: 0 };
  const aggregated: Record<string, { user_id: string; correct: number; total: number }> = {};
  for (const item of res.items ?? []) {
    const scores = item.scores ?? {};
    for (const uid of Object.keys(scores)) {
      const s = scores[uid];
      if (!aggregated[uid]) aggregated[uid] = { user_id: uid, correct: 0, total: 0 };
      aggregated[uid].correct += s.correct ?? 0;
      aggregated[uid].total += s.total ?? 0;
      if (uid === user_id) {
        personal.correct += s.correct ?? 0;
        personal.total += s.total ?? 0;
      }
    }
  }
  const topScores = Object.values(aggregated)
    .sort((a, b) => (b.correct - a.correct) || (a.total - b.total))
    .slice(0, 5);

  // Publish App Home view
  await client.views.publish({
    user_id,
    view: buildAppHomeView(user_id, personal, topScores),
  });

  return { outputs: {} };
});


