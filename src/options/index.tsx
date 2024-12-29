import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Form, Input, Button, message, Card, Select } from "antd";

const { Option } = Select;

const OptionsPage = () => {
  const [form] = Form.useForm();

  const [config, setConfig] = useState({
    llm: "claude",
    baseURL: "https://api.anthropic.com",
    modelName: "claude-3-5-sonnet-20241022",
    apiKey: "",
  });

  useEffect(() => {
    chrome.storage.sync.get(["llmConfig"], (result) => {
      if (result.llmConfig) {
        if (result.llmConfig.llm === "") {
          result.llmConfig.llm = "claude";
        }
        setConfig(result.llmConfig);
        form.setFieldsValue(result.llmConfig);
      }
    });
  }, []);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        setConfig(values);
        chrome.storage.sync.set(
          {
            llmConfig: values,
          },
          () => {
            message.success("Save Success!");
          }
        );
      })
      .catch((errorInfo) => {
        message.error("Please check the form field");
      });
  };

  const modelLLMs = [
    { value: "claude", label: "Claude (default)" },
    { value: "openai", label: "OpenAI" },
  ];

  const modelOptions = {
    claude: [
      { value: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet (default)" },
      { value: "claude-3-opus-20240229", label: "Claude 3 Opus" },
    ],
    openai: [
      { value: "gpt-4o", label: "gpt-4o (default)" },
      { value: "gpt-4o-mini", label: "gpt-4o-mini" },
      { value: "gpt-4", label: "gpt-4" },
    ],
  };

  const handleLLMChange = (value: string) => {
    const newConfig = {
      llm: value,
      baseURL:
        value === "openai"
          ? "https://api.openai.com/v1"
          : "https://api.anthropic.com",
      modelName: modelOptions[value][0].value,
      apiKey: "",
    };
    setConfig(newConfig);
    form.setFieldsValue(newConfig);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card title="Model Config" className="shadow-md">
        <Form form={form} layout="vertical" initialValues={config}>
          <Form.Item
            name="llm"
            label="LLM"
            rules={[
              {
                required: true,
                message: "Please select a LLM",
              },
            ]}
          >
            <Select placeholder="Choose a LLM" onChange={handleLLMChange}>
              {modelLLMs.map((llm) => (
                <Option key={llm.value} value={llm.value}>
                  {llm.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="baseURL"
            label="Base URL"
            rules={[
              {
                required: true,
                message: "Please enter the base URL",
              },
            ]}
          >
            <Input placeholder="Please enter the base URL" allowClear />
          </Form.Item>

          <Form.Item
            name="modelName"
            label="Model Name"
            rules={[
              {
                required: true,
                message: "Please select a model",
              },
            ]}
          >
            <Select placeholder="Choose a model">
              {modelOptions[config.llm]?.map((model) => (
                <Option key={model.value} value={model.value}>
                  {model.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="apiKey"
            label="API Key"
            rules={[
              {
                required: true,
                message: "Please enter the API Key",
              },
            ]}
          >
            <Input.Password placeholder="Please enter the API Key" allowClear />
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={handleSave} block>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <OptionsPage />
  </React.StrictMode>
);
