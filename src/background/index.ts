import { main } from "./first_workflow";

// Listen to messages from the browser extension
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.type == "run") {
    // Click the RUN button to execute the main function (workflow)
    await main();
  }
});