import { Eko } from "@eko-ai/eko";
import { EkoConfig, WorkflowCallback } from "@eko-ai/eko/types";
import { getLLMConfig } from "@eko-ai/eko/extension";

export async function main() {
  // Load LLM model configuration
  // the current browser plugin project provides a page for configuring LLM parameters
  let config = await getLLMConfig();
  if (!config && !config.apiKey) {
    throw Error("Please configure apiKey");
  }

  // Initialize eko
  let eko = new Eko(config as EkoConfig);

  // Generate a workflow from natural language description
  const workflow = await eko.generate(`
    Search Sam Altman's information and summarize it into markdown format for export
  `);

  // Execute the workflow
  await eko.execute(workflow, hookLogs());
}

function hookLogs(): WorkflowCallback {
  return {
    hooks: {
      beforeWorkflow: async (workflow) => {
        log("Start workflow: " + workflow.name);
      },
      beforeSubtask: async (subtask, context) => {
        log("> subtask: " + subtask.name);
      },
      beforeToolUse: async (tool, context, input) => {
        log("> tool: " + tool.name);
        return input;
      },
      afterToolUse: async (tool, context, result) => {
        log("  tool: " + tool.name + " completed", "success");
        return result;
      },
      afterSubtask: async (subtask, context, result) => {
        log("  subtask: " + subtask.name + " completed", "success");
        return result;
      },
      afterWorkflow: async (workflow, variables) => {
        log("Completed", "success");
      },
    },
  };
}

function log(log: string, level = "info") {
  chrome.runtime.sendMessage({ type: "log", log, level });
}
