import { Eko, WorkflowParser } from "ekoai";
import { tools, getLLMConfig } from "ekoai/extension";

export async function testWebSearchWithWorkflow() {
  let config = await getLLMConfig();
  if (!config && !config.apiKey) {
    throw Error("Please configure apiKey");
  }

  let eko = new Eko({
    llm: config.llm as any,
    apiKey: config.apiKey,
    modelName: config.modelName,
    options: { baseURL: config.baseURL },
  });

  eko.registerTool(new tools.WebSearch());
  eko.registerTool(new tools.ExportFile());

  const workflow = await eko.generateWorkflow("搜索谢扬信息，汇总成表格导出");
  console.log("dsl", WorkflowParser.serialize(workflow));
  await eko.execute(workflow);
}
