import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import StartQuizWorkflow from "../workflows/start_quiz_workflow.ts";

const startQuizShortcut: Trigger<typeof StartQuizWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Start AWS Quiz",
  description: "Start a quiz modal",
  workflow: `#/workflows/${StartQuizWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: { value: TriggerContextData.Shortcut.interactivity },
    user_id: { value: TriggerContextData.Shortcut.user_id },
    quiz_type: { value: "CP" }, // default; can duplicate triggers per type or open a type selector
  },
};

export default startQuizShortcut;


