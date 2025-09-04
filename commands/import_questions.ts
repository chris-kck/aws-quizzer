/**
 * Slash command / CSV import handler that parses a CSV string and upserts Questions.
 * CSV columns:
 * quiz_type,question,choice_a,choice_b,choice_c,choice_d,answer_keys,explanation,tags,difficulty
 * - answer_keys supports multi-answers using pipe e.g. B|C
 */
import { DefineFunction, SlackFunction } from "deno-slack-sdk/mod.ts";
import { Question } from "../datastores/question.ts";
// Use Deno std CSV parser
import { parse } from "https://deno.land/std@0.196.0/csv/mod.ts";

export const ImportQuestions = DefineFunction({
  callback_id: "import_questions",
  title: "Import Questions (CSV)",
  input_parameters: { properties: { csv: { type: "string" } }, required: ["csv"] },
});

export default SlackFunction(ImportQuestions, async ({ inputs, client }) => {
  const csv = (inputs as any).csv as string;
  const parsed = await parse(csv, { skipFirstRow: false }) as string[][];
  // Expect header on first row
  const rows = parsed.slice(1);
  for (const cols of rows) {
    if (cols.length < 10) continue; // skip incomplete
    const [quiz_type, rawQuestion, a, b, c, d, answer_keys, explanation, tags, difficulty] = cols;
    const id = crypto.randomUUID();
    const choices = [
      { id: "A", label: a },
      { id: "B", label: b },
      { id: "C", label: c },
      { id: "D", label: d },
    ];
    const answer_ids = (answer_keys || "").split("|").map(s => s.trim()).filter(Boolean);
    const tagList = (tags || "").split("|").map(s => s.trim()).filter(Boolean);
    await client.apps.datastore.put({
      datastore: Question.name,
      item: { id, quiz_type, question: rawQuestion, choices, answer_ids, explanation, tags: tagList, difficulty },
    });
  }
  return { outputs: {} };
});


