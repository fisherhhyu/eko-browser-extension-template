import { testTools } from "./test_tools";
import { testWebSearchWithLLM } from "./test_llm_search";
import { testWebSearchWithComputer } from "./test_llm_computer";
import { testWebSearchWithWorkflow } from "./test_llm_workflow";

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.type == "run") {
    // await testTools();
    await testWebSearchWithLLM();
    // await testWebSearchWithComputer();
    // await testWebSearchWithWorkflow();
  }
});
