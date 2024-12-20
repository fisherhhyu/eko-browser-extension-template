import {
  ClaudeProvider,
  ToolRegistry,
  WorkflowGenerator,
  WorkflowParser,
} from "ekoai";
import { tools, getLLMConfig } from "ekoai/extension";

export async function testWebSearchWithWorkflow() {
  let apiKey = (await getLLMConfig()).apiKey;
  if (!apiKey) {
    throw Error("Please configure apiKey");
  }

  let llmProvider = new ClaudeProvider(apiKey);

  let toolRegistry = new ToolRegistry();
  toolRegistry.registerTool(new tools.WebSearch());
  toolRegistry.registerTool(new tools.ExportFile());

  const generator = new WorkflowGenerator(llmProvider, toolRegistry);
  const workflow = await generator.generateWorkflow(
    "搜索谢扬信息，汇总成表格导出"
  );
  const dsl = WorkflowParser.serialize(workflow);
  console.log("dsl", dsl);
  await workflow.execute();
}
