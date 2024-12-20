import { Eko } from "ekoai";
import { ExecutionContext } from "ekoai/types";
import { tools, utils } from "ekoai/extension";

let eko = new Eko("claude-3-5-sonnet-20241022");
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
  let pageSize = await utils.getPageSize(tabId);
  let computer = new tools.ComputerWeb(pageSize);
  let result = await computer.execute(context, { action, coordinate, text });
  console.log("result: ", result);
  return result;
}

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.type == "run") {
    await testWebSearch();
    // await testTabManagement("current_tab");
    // await testTabManagement("tab_all");
    // await exportFile();
    // await extractContent();
    // await openUrl('https://www.google.com', true);
    // await screenshot();
  }
});
