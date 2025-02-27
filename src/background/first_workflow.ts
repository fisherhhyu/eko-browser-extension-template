import { Eko, createChromeApiProxy } from "@eko-ai/eko";
import { LLMConfig, WorkflowCallback } from "@eko-ai/eko/types";
import { getLLMConfig } from "@eko-ai/eko/extension";

class MyChromeProxy {
  public static windows_create(createData: chrome.windows.CreateData): Promise<chrome.windows.Window> {
    console.log("this will create a window");
    return chrome.windows.create(createData);
  }
}

export async function main(prompt: string) {
  let chromeProxy = createChromeApiProxy(MyChromeProxy);
  // Load LLM model configuration
  // the current browser plugin project provides a page for configuring LLM parameters
  let config = await getLLMConfig(chromeProxy);
  if (!config || !config.apiKey) {
    printLog("Please configure apiKey", "error");
    return;
  }

  // Initialize eko
  // let eko = new Eko(config as LLMConfig, { chromeProxy });
  let eko = new Eko(config as LLMConfig, { callback: hookLogs(), chromeProxy: chromeProxy });

  // Generate a workflow from natural language description
  const workflow = await eko.generate(prompt);

  // Execute the workflow
  // await eko.execute(workflow, hookLogs());
  await eko.execute(workflow);
}

function hookLogs(): WorkflowCallback {
  return {
    hooks: {
      beforeWorkflow: async (workflow) => {
        printLog("Start workflow: " + workflow.name);
      },
      beforeSubtask: async (subtask, context) => {
        printLog("> subtask: " + subtask.name);
      },
      beforeToolUse: async (tool, context, input) => {
        printLog("> tool: " + tool.name);
        return input;
      },
      afterToolUse: async (tool, context, result) => {
        printLog("  tool: " + tool.name + " completed", "success");
        return result;
      },
      afterSubtask: async (subtask, context, result) => {
        printLog("  subtask: " + subtask.name + " completed", "success");
      },
      afterWorkflow: async (workflow, variables) => {
        printLog("Completed", "success");
      },
    },
  };
}

function printLog(log: string, level?: "info" | "success" | "error") {
  chrome.runtime.sendMessage({ type: "log", log, level: level || "info" });
}
