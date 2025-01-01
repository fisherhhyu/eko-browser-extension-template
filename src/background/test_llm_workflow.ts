import { Eko, WorkflowParser } from "@eko-ai/eko";
import { tools, getLLMConfig } from "@eko-ai/eko/extension";
import { EkoConfig } from "@eko-ai/eko/types";

export async function testWebSearchWithWorkflow() {
  let config = await getLLMConfig();
  if (!config && !config.apiKey) {
    throw Error("Please configure apiKey");
  }

  let eko = new Eko(config as EkoConfig);

  eko.registerTool(new tools.WebSearch());
  eko.registerTool(new tools.ExportFile());

  const workflow = await eko.generateWorkflow("Search Elon Musk information and summarize it into markdown format for export");
  console.log("dsl", WorkflowParser.serialize(workflow));
  await eko.execute(workflow);
}
