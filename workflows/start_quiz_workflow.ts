import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { GetNextQuestion } from "../functions/get_next_question.ts";
import { OpenQuestionModal } from "../functions/open_question_modal.ts";

// Workflow: user invokes shortcut to start a quiz -> open a modal with a question
const StartQuizWorkflow = DefineWorkflow({
  callback_id: "start_quiz_workflow",
  title: "Start AWS Quiz",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
      user_id: { type: Schema.slack.types.user_id },
      quiz_type: { type: Schema.types.string },
    },
    required: ["interactivity", "user_id", "quiz_type"],
  },
});

// Step 1 must be a Slack-native interactivity producer like OpenForm or a custom function that uses interactivity
// We directly open the modal with OpenQuestionModal, letting it fetch a question if not provided

// Open the question modal using a custom function that maps interactivity from workflow input
StartQuizWorkflow.addStep(OpenQuestionModal, {
  interactivity: StartQuizWorkflow.inputs.interactivity,
  user_id: StartQuizWorkflow.inputs.user_id,
  quiz_type: StartQuizWorkflow.inputs.quiz_type,
  index: 1,
  total: 1,
});

export default StartQuizWorkflow;


