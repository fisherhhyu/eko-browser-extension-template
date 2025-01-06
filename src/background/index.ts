import Eko from "@eko-ai/eko";
import { loadTools } from "@eko-ai/eko/extension";
import { main } from "./first_workflow";

// Register tools
Eko.tools = loadTools();

// Listen to messages from the browser extension
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.type == "run") {
    // Click the RUN button to execute the main function (workflow)
    await main();
  }
});
