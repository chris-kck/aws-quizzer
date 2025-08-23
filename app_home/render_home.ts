/**
 * Simple App Home rendering helper showing personal daily stats and a top-5 leaderboard.
 * This is a minimal version; it's fine to extend for better visuals.
 */
export function buildAppHomeView(userId: string, personalScores: any, topScores: any[]) {
  const personalText = `Your today: ${personalScores?.correct ?? 0}/${personalScores?.total ?? 0}`;
  const leaderboardBlocks = [
    { type: "section", text: { type: "plain_text", text: "🏆 Today's Leaderboard" } },
  ];
  for (const entry of topScores) {
    // entry: { user_id, correct, total }
    leaderboardBlocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `<@${entry.user_id}> — ${entry.correct}/${entry.total}` },
    });
  }
  return {
    type: "home",
    blocks: [
      { type: "section", text: { type: "mrkdwn", text: `*AWS Quiz Hub*\n${personalText}` } },
      { type: "divider" },
      ...leaderboardBlocks,
    ],
  };
}


