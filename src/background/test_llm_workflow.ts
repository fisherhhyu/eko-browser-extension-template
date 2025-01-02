import { Eko, WorkflowParser } from "@eko-ai/eko";
import { EkoConfig } from "@eko-ai/eko/types";
import { fellou } from "@eko-ai/eko/fellou";
import { tools, getLLMConfig } from "@eko-ai/eko/extension";

export async function testWebSearchWithWorkflow() {
  let config = await getLLMConfig();
  fellou.computer.screenshot()
  fellou.computer.mouse_move([200, 400]);
  fellou.computer.type("Elon Musk");
  if (!config && !config.apiKey) {
    throw Error("Please configure apiKey");
  }

  let eko = new Eko(config as EkoConfig);

  eko.registerTool(new tools.WebSearch());
  eko.registerTool(new tools.ExportFile());

  const workflow = await eko.generateWorkflow("Search Elon Musk information and summarize it into markdown format for export");
  console.log("dsl", WorkflowParser.serialize(workflow));
  await eko.executeWorkflow(workflow);
}
