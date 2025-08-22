export function buildResultMessage(isCorrect: boolean, explanation = "") {
  return {
    text: isCorrect ? "✅ Correct!" : "❌ Not quite.",
    blocks: [
      { type: "section", text: { type: "mrkdwn", text: isCorrect ? "*✅ Correct!*" : "*❌ Not quite.*" } },
      ...(explanation ? [{ type: "context", elements: [{ type: "mrkdwn", text: `_Explanation:_ ${explanation}` }] }] : []),
    ],
  };
}


