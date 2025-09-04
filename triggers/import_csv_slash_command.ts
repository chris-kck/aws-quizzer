import type { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import ImportCSVWorkflow from "../workflows/import_csv_workflow.ts";

export const importCsvSlash: Trigger<typeof ImportCSVWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Import Questions CSV",
  description: "Provide CSV content to import questions",
  workflow: `#/workflows/${ImportCSVWorkflow.definition.callback_id}`,
  inputs: {
    csv: { value: "" },
  },
};

export default importCsvSlash;


