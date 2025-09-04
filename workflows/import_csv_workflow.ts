import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { ImportQuestions } from "../commands/import_questions.ts";

const ImportCSVWorkflow = DefineWorkflow({
  callback_id: "import_csv_workflow",
  title: "Import Questions from CSV",
  input_parameters: {
    properties: {
      csv: { type: Schema.types.string },
    },
    required: ["csv"],
  },
});

ImportCSVWorkflow.addStep(ImportQuestions, { csv: ImportCSVWorkflow.inputs.csv });

export default ImportCSVWorkflow;


