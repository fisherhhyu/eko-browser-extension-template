import { ClaudeProvider } from "ekoai";
import {
  ExecutionContext,
  Message,
  LLMParameters,
  ToolDefinition,
  Tool,
} from "ekoai/types";
import { tools, getLLMConfig } from "ekoai/extension";

export async function testWebSearchWithLLM() {
  let apiKey = (await getLLMConfig()).apiKey;
  if (!apiKey) {
    throw Error("Please configure apiKey");
  }
  let llmProvider = new ClaudeProvider(apiKey);
  let context = {
    variables: new Map<string, unknown>(),
    tools: [],
  } as any as ExecutionContext;

  let messages: Message[] = [
    {
      role: "user",
      content: "搜索谢扬信息，汇总成表格导出",
    },
  ];
  let params: LLMParameters = {
    maxTokens: 4096,
    toolChoice: {
      type: "auto",
    },
    tools: [
      new tools.WebSearch() as ToolDefinition,
      new tools.ExportFile() as ToolDefinition,
    ],
  };
  let toolMap: { [key: string]: Tool<any, any> } = {};
  for (let i = 0; i < params.tools.length; i++) {
    let tool = params.tools[i];
    toolMap[tool.name] = tool as Tool<any, any>;
  }
  do {
    printLog(messages[messages.length - 1]);
    console.log("Requesting...");
    let result = await llmProvider.generateText(messages, params);
    messages.push({
      role: "assistant",
      content: result.content,
    });
    printLog(messages[messages.length - 1]);
    let toolCalls = result.toolCalls;
    if (!toolCalls || toolCalls.length == 0) {
      break;
    }
    let user_content = [];
    for (let i = 0; i < toolCalls.length; i++) {
      let toolCall = toolCalls[i];
      let tool = toolMap[toolCall.name];
      let result = (await tool.execute(context, toolCall.input)) as any;
      if (result.image && result.image.type) {
        user_content.push({
          type: "tool_result",
          tool_use_id: toolCall.id,
          content: [
            {
              type: "image",
              source: result.image,
            },
          ],
        });
      } else {
        user_content.push({
          type: "tool_result",
          tool_use_id: toolCall.id,
          content: [
            {
              type: "text",
              text: JSON.stringify(result),
            },
          ],
        });
      }
    }
    messages.push({
      role: "user",
      content: user_content,
    });
  } while (true);
}

function printLog(message: Message) {
  let sb = message.role + ":\n";
  let content = message.content;
  if (typeof content == "string") {
    sb += content;
  } else {
    for (let i = 0; i < content.length; i++) {
      let _content = content[i] as any;
      if (_content.type == "text") {
        sb += _content.text + "\n";
      } else if (_content.type == "tool_use") {
        sb +=
          "tool_use: [" +
          _content.name +
          "] > " +
          JSON.stringify(_content.input) +
          "\n";
      } else if (_content.type == "tool_result") {
        let tool_content = [];
        if (typeof _content.content == "string") {
          tool_content.push({ type: "text", text: _content.content });
        } else {
          tool_content = _content.content;
        }
        sb += "tool_result: ";
        for (let j = 0; j < tool_content.length; j++) {
          let __content = tool_content[j];
          if (__content.type == "text") {
            sb += "\n" + __content.text;
          } else {
            let source = __content.source;
            sb +=
              __content.type +
              " > data:" +
              source.media_type +
              ";" +
              source.type +
              "," +
              source.data.substring(0, 10) +
              "...(" +
              source.data.length +
              ")";
          }
        }
      }
    }
  }
  console.log(sb.trim());
}
