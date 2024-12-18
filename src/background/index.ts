import { Eko } from "ekoai";

async function testWebSearch() {
  let eko = new Eko("claude-3-sonnet");
  let result = await eko.testWebSearch("谢扬");
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
  }
});
