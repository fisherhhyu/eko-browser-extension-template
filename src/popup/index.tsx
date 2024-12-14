import { createRoot } from "react-dom/client";
import React, { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Table,
  Modal,
  Form,
  Input,
  message,
  Space,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";

interface UserScript {
  id: number;
  name: string;
  code: string;
  enabled: boolean;
}

interface ScriptFormValues {
  name: string;
  code: string;
}

const { Header, Content } = Layout;

const ScriptManager: React.FC = () => {
  const [scripts, setScripts] = useState<UserScript[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [currentScript, setCurrentScript] = useState<UserScript | null>(null);
  const [form] = Form.useForm<ScriptFormValues>();

  useEffect(() => {
    chrome.storage.sync.get(["userScripts"], (result) => {
      if (result.userScripts) {
        setScripts(result.userScripts);
      }
    });
  }, []);

  const saveScripts = (updatedScripts: UserScript[]) => {
    chrome.storage.sync.set({ userScripts: updatedScripts }, () => {
      setScripts(updatedScripts);
      message.success("Save Success!");
    });
  };

  const handleAddScript = (values: ScriptFormValues) => {
    const newScript: UserScript = {
      id: Date.now(),
      name: values.name,
      code: values.code,
      enabled: true,
    };
    const updatedScripts = [...scripts, newScript];
    saveScripts(updatedScripts);
    setIsAddModalVisible(false);
    form.resetFields();
  };

  const handleEditScript = (script: UserScript) => {
    setCurrentScript(script);
    form.setFieldsValue({
      name: script.name,
      code: script.code,
    });
    setIsAddModalVisible(true);
  };

  const handleUpdateScript = (values: ScriptFormValues) => {
    if (!currentScript) return;

    const updatedScripts = scripts.map((script) =>
      script.id === currentScript.id
        ? { ...script, name: values.name, code: values.code }
        : script
    );
    saveScripts(updatedScripts);
    setIsAddModalVisible(false);
    setCurrentScript(null);
    form.resetFields();
  };

  const handleDeleteScript = (scriptId: number) => {
    const updatedScripts = scripts.filter((script) => script.id !== scriptId);
    saveScripts(updatedScripts);
  };

  const columns: ColumnsType<UserScript> = [
    {
      title: "DSL Name",
      dataIndex: "name",
      key: "name",
      align: 'center'
    },
    {
      title: "Actions",
      key: "actions",
      align: 'center',
      width: 100,
      render: (text, record: UserScript) => (
        <Space size="middle">
          <a onClick={() => alert("eko")}>Run</a>
          <a onClick={() => handleEditScript(record)}>Edit</a>
          <a onClick={() => handleDeleteScript(record.id)}>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ height: "550px", width: "400px" }}>
      <Header
        style={{
          background: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Eko DSL Manager</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsAddModalVisible(true)}
        >
          Add
        </Button>
      </Header>

      <Layout>
        <Content style={{ padding: 20, background: "#fff" }}>
          <Table
            dataSource={scripts}
            columns={columns}
            rowKey="id"
            pagination={false}
          />
        </Content>
      </Layout>

      <Modal
        title={currentScript ? "Edit" : "Add"}
        open={isAddModalVisible}
        onCancel={() => {
          setIsAddModalVisible(false);
          setCurrentScript(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={currentScript ? handleUpdateScript : handleAddScript}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input placeholder="Please enter the name" />
          </Form.Item>

          <Form.Item
            name="code"
            label="Code"
            rules={[{ required: true, message: "Please enter the code" }]}
          >
            <Input.TextArea placeholder="DSL json / code" rows={8} />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <ScriptManager />
  </React.StrictMode>
);
