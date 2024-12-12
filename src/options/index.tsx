import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Form, Input, Button, message, Card, Select } from "antd";

const { Option } = Select;

const OptionsPage = () => {
  const [form] = Form.useForm();

  const [config, setConfig] = useState({
    apiUrl: "https://api.anthropic.com/v1/messages",
    modelName: "claude-3-sonnet",
    apiKey: "",
  });

  useEffect(() => {
    chrome.storage.sync.get(["systemConfig"], (result) => {
      if (result.systemConfig) {
        setConfig(result.systemConfig);
        form.setFieldsValue(result.systemConfig);
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
            systemConfig: values,
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

  const modelOptions = [
    { value: "claude-3-haiku", label: "Claude 3 Haiku" },
    { value: "claude-3-sonnet", label: "Claude 3 Sonnet (default)" },
    { value: "claude-3-opus", label: "Claude 3 Opus" },
  ];

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card title="Model Config" className="shadow-md">
        <Form form={form} layout="vertical" initialValues={config}>
          <Form.Item
            name="apiUrl"
            label="API URL"
            rules={[
              {
                required: true,
                message: "Please enter the API address",
              },
            ]}
          >
            <Input placeholder="Please enter the API address" allowClear />
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
              {modelOptions.map((model) => (
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
