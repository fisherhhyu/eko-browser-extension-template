import { Eko } from "test-eko-veasion";
import { baidu } from "./script";

async function testWebSearch() {
  let eko = new Eko();
  let result = await eko.execute({ query: "谢扬" });
  console.log("result: ", result);
  return result;
}

async function testMessage() {
  let window = await chrome.windows.create({
    type: "normal",
    state: "maximized",
    url: null,
  } as any as chrome.windows.CreateData);
  let tab = await chrome.tabs.create({
    url: "https://www.baidu.com",
    windowId: window.id,
  });
  await new Promise((resolve: any) => setTimeout(() => resolve(), 2000));
  let tabId = tab.id;
  let result = await chrome.tabs.sendMessage(tabId as number, {
    type: "eko:message",
    event: "test",
    params: 123456,
  });
  console.log("test result: ", result);
  return result;
}

// function baidu(name: string) {
//   let element: any = document.querySelector("#kw");
//   element.value = "你好";
//   alert("哈哈: " + name);
// }

async function testScript() {
  let window = await chrome.windows.create({
    type: "normal",
    state: "maximized",
    url: null,
  } as any as chrome.windows.CreateData);
  let tab = await chrome.tabs.create({
    url: "https://www.baidu.com",
    windowId: window.id,
  });
  await new Promise((resolve: any) => setTimeout(() => resolve(), 2000));
  let tabId = tab.id;
  let result = await chrome.scripting.executeScript({
    target: { tabId: tabId as number },
    func: baidu,
    args: ["veasion"],
  });
  return result;
}

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.type == "run") {
    await testScript();
  }
});
