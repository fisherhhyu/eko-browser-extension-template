# Eko浏览器扩展分析

## 1. 程序调用链关系

```mermaid
graph TD
    A[用户界面 - sidebar/index.tsx] -->|点击Run按钮| B[发送消息 - type:run]
    B --> C[background/index.ts]
    C -->|调用| D[main函数 - background/main.ts]
    D -->|获取配置| E[getLLMConfig]
    D -->|创建| F[Eko实例]
    F -->|配置| G[LLMs配置]
    F -->|配置| H[BrowserAgent]
    F -->|配置| I[回调函数]
    F -->|执行| J[eko.run(prompt)]
    J -->|结果处理| K[printLog]
    K -->|发送消息| L[chrome.runtime.sendMessage]
    L --> A
    
    M[用户界面 - options/index.tsx] -->|保存配置| N[chrome.storage.sync.set]
    N -->|存储| O[llmConfig]
    E -->|读取| O
```

## 2. 调用大模型时完整的prompt说明

Eko浏览器扩展通过`@eko-ai/eko`库调用大模型，主要在`background/main.ts`中实现。以下是调用大模型的完整流程和prompt处理：

### 配置获取

```typescript
// 从Chrome存储中获取LLM配置
export async function getLLMConfig(name: string = "llmConfig"): Promise<any> {
  let result = await chrome.storage.sync.get([name]);
  return result[name];
}
```

### LLM配置设置

```typescript
const llms: LLMs = {
  default: {
    provider: config.llm as any,  // 提供商：anthropic(默认)、openai或openrouter
    model: config.modelName,      // 模型名称，如claude-3-7-sonnet-20250219
    apiKey: config.apiKey,        // API密钥
    config: {
      baseURL: config.options.baseURL,  // API基础URL
    },
  },
};
```

### 回调函数设置

```typescript
let callback: StreamCallback & HumanCallback = {
  onMessage: async (message: StreamCallbackMessage) => {
    if (message.type == "workflow") {
      printLog("Plan\n" + message.workflow.xml, "info", !message.streamDone);
    } else if (message.type == "text") {
      printLog(message.text, "info", !message.streamDone);
    } else if (message.type == "tool_streaming") {
      printLog(`${message.agentName} > ${message.toolName}\n${message.paramsText}`, "info", true);
    } else if (message.type == "tool_use") {
      printLog(
        `${message.agentName} > ${message.toolName}\n${JSON.stringify(
          message.params
        )}`
      );
    }
    console.log("message: ", JSON.stringify(message, null, 2));
  },
  onHumanConfirm: async (context, prompt) => {
    return confirm(prompt);
  },
};
```

### 代理设置与执行

```typescript
// 设置浏览器代理
let agents = [new BrowserAgent()];

// 创建Eko实例
let eko = new Eko({ llms, agents, callback });

// 执行用户输入的prompt
eko
  .run(prompt)
  .then((res) => {
    printLog(res.result, res.success ? "success" : "error");
  })
  .catch((error) => {
    printLog(error, "error");
  })
  .finally(() => {
    chrome.storage.local.set({ running: false });
    chrome.runtime.sendMessage({ type: "stop" });
  });
```

### Prompt处理流程

1. 用户在侧边栏输入prompt并点击"Run"按钮
2. prompt通过消息传递到background脚本
3. background脚本调用main函数，创建Eko实例
4. Eko实例使用配置的LLM和BrowserAgent执行prompt
5. 执行结果通过回调函数处理并显示在侧边栏

### 支持的模型

扩展支持多种LLM提供商和模型：

#### Anthropic (默认)
- claude-3-7-sonnet-20250219 (默认)
- claude-3-5-sonnet-20241022

#### OpenAI
- gpt-4o (默认)
- gpt-4.1
- gpt-4.1-mini
- gpt-4o-mini

#### OpenRouter
- anthropic/claude-3.7-sonnet (默认)
- anthropic/claude-3.5-sonnet
- openai/gpt-4.1
- openai/gpt-4.1-mini
- openai/gpt-4o
- google/gemini-2.5-flash-preview-05-20
- google/gemini-2.5-pro-preview

### BrowserAgent能力

BrowserAgent是Eko框架提供的浏览器代理，允许大模型通过浏览器扩展与网页交互，执行如下操作：
- 网页导航
- 元素点击
- 表单填写
- 文本提取
- 截图
- 等其他浏览器自动化操作

用户只需在prompt中描述任务，如"打开Twitter，搜索'Fellou AI'并关注"，BrowserAgent会将这些自然语言指令转换为浏览器操作。