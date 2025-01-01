import { ElementRect, ExecutionContext, Tool } from "@eko-ai/eko/types";
import { getLLMConfig, tools, browser, utils } from "@eko-ai/eko/extension";
import { ClaudeProvider } from "@eko-ai/eko";

var context: ExecutionContext;

async function testWebSearch() {
  let webSearch = new tools.WebSearch();
  let result = await webSearch.execute(context, { query: "Elon Musk" });
  console.log("result: ", result);
  return result;
}

async function testTabManagement(commond: string) {
  let tabManagement = new tools.TabManagement();
  let result = await tabManagement.execute(context, { commond });
  console.log("result: ", commond, result);
  return result;
}

async function exportFile() {
  let exportFile = new tools.ExportFile();
  let result = await exportFile.execute(context, {
    fileType: "csv",
    content: "Name, Price\niPhone, $1000\nnotebook, $1.02",
  });
  console.log("result: ", result);
  return result;
}

async function extractContent() {
  let extract = new tools.ExtractContent();
  let result = await extract.execute(context, {});
  console.log("result: ", result);
  return result;
}

async function openUrl(url: string, newWindow: boolean) {
  let openUrl = new tools.OpenUrl();
  let result = await openUrl.execute(context, { url, newWindow });
  console.log("result: ", result);
  return result;
}

async function findElementPosition(
  task_prompt: string
): Promise<ElementRect | null> {
  let find_element_position = new tools.FindElementPosition();
  let result = await find_element_position.execute(context, {
    task_prompt: task_prompt,
  });
  console.log("find_element_position", result);
  return result;
}

async function elementClick(task_prompt: string) {
  let element_click = new tools.ElementClick();
  let result = await element_click.execute(context, {
    task_prompt: task_prompt,
  });
  console.log("element_click", result);
  return result;
}

async function type(rect: ElementRect, text: string) {
  let tabId = await utils.getCurrentTabId();
  let result = await browser.type(tabId, text, [rect.left, rect.top]);
  console.log("type", result);
  return result;
}

async function screenshot() {
  let screenshot = new tools.Screenshot();
  let result = await screenshot.execute(context, {});
  console.log("result: ", result);
  return result;
}

async function computerWeb(
  action: string,
  index?: number,
  text?: string
) {
  let tabId = await utils.getCurrentTabId();
  context.variables.set("tabId", tabId);
  let computer = new tools.BrowserUse();
  let result = await computer.execute(context, { action, index, text });
  console.log("result: ", result);
  return result;
}

async function computer() {
  await openUrl("https://www.baidu.com", true);
  let result = await computerWeb("screenshot_extract_element");
  let elements = result.text.split("\n");
  let inputIdx;
  for (let i = 0; i < elements.length; i++) {
    let str = elements[i];
    if (str.indexOf('id="kw"') > -1) {
      inputIdx = str.split(":")[0].replace("[", "").replace("]", "");
    }
  }
  await computerWeb("input_text", +inputIdx, "Elon Musk");
  result = await computerWeb("screenshot_extract_element");
  elements = result.text.split("\n");
  let butIdx;
  for (let i = 0; i < elements.length; i++) {
    let str = elements[i];
    if (str.indexOf('id="su"') > -1) {
      butIdx = str.split(":")[0].replace("[", "").replace("]", "");
    }
  }
  await computerWeb("click", +butIdx);
}

async function test_task_prompt() {
  // open new tab
  await openUrl("https://www.baidu.com", true);
  let rect = await findElementPosition("Find the search input box");
  if (rect) {
    // input -> text
    await type(rect, "Elon Musk");
    await utils.sleep(500);
    // click the search button
    await elementClick("click the search button");
  }
}

export async function testTools() {
  let apiKey = (await getLLMConfig()).apiKey;
  context = {
    llmProvider: new ClaudeProvider(apiKey),
    variables: new Map<string, unknown>(),
    tools: new Map<string, Tool<any, any>>(),
  };
  // test
  // await testWebSearch();
  // await testTabManagement("tab_all");
  // await exportFile();
  // await extractContent();
  // await openUrl("https://www.google.com", true);
  // await screenshot();
  await computer();
}
