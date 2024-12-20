import { ExecutionContext } from "ekoai/types";
import { tools, utils } from "ekoai/extension";

let context = {
  variables: new Map<string, unknown>(),
  tools: [],
} as any as ExecutionContext;

async function testWebSearch() {
  let webSearch = new tools.WebSearch();
  let result = await webSearch.execute(context, { query: "谢扬" });
  console.log("result: ", result);
  return result;
}

async function testTabManagement(action: string) {
  let tabManagement = new tools.TabManagement();
  let result = await tabManagement.execute(context, { action });
  console.log("result: ", action, result);
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

async function screenshot() {
  let screenshot = new tools.Screenshot();
  let result = await screenshot.execute(context, {});
  console.log("result: ", result);
  return result;
}

async function computerWeb(
  action: string,
  coordinate?: [number, number],
  text?: string
) {
  let tabId = await utils.getCurrentTabId();
  context.variables.set("tabId", tabId);
  let computer = new tools.ComputerWeb();
  let result = await computer.execute(context, { action, coordinate, text });
  console.log("result: ", result);
  return result;
}

async function computer() {
  await utils.sleep(3000);
  await computerWeb("mouse_move", [544, 290]);
  await computerWeb("left_click");
  await computerWeb("clear_input");
  await computerWeb("type", null, "谢扬");
  await utils.sleep(1000);
  await computerWeb("mouse_move", [544, 335]);
  await computerWeb("left_click");
  await utils.sleep(1000);
  await computerWeb("scroll_to", [0, 1500]);
  let result = await computerWeb("screenshot") as any;
  let image = result.image;
  let image_base64 = 'data:' + image.media_type + ';base64,' + image.data;
  console.log('image', image_base64);
}

export async function testTools() {
    await testWebSearch();
    // await testTabManagement("current_tab");
    // await testTabManagement("tab_all");
    // await exportFile();
    // await extractContent();
    // await openUrl('https://www.google.com', true);
    // await screenshot();
    // await computer();
}
