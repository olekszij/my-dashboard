"use client";

import { useState } from "react";
import { Input, Button, List, Typography, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

export default function TodoList() {
  const [todos, setTodos] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const addTask = () => {
    if (input.trim()) {
      setTodos([...todos, input.trim()]);
      setInput("");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", width: "100%" }}>
      <Typography.Title level={2} style={{ textAlign: "center", marginBottom: 24, fontWeight: 700 }}>
        Todo List
      </Typography.Title>
      <Space.Compact style={{ width: "100%", marginBottom: 16 }}>
        <Input
          size="large"
          style={{ borderRadius: "24px 0 0 24px", fontSize: 16, borderRight: 0 }}
          placeholder="Add a new task..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onPressEnter={addTask}
        />
        <Button
          type="primary"
          size="large"
          style={{
            borderRadius: "0 24px 24px 0",
            fontSize: 20,
            padding: "0 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderLeft: 0,
            background: "linear-gradient(90deg,#3b82f6 0%,#a855f7 100%)",
            boxShadow: "0 2px 8px #a855f733",
            transition: "background 0.2s, box-shadow 0.2s",
          }}
          icon={<PlusOutlined />}
          onClick={addTask}
          aria-label="Add task"
        />
      </Space.Compact>
      <List
        dataSource={todos}
        renderItem={(item, idx) => (
          <List.Item
            actions={[
              <Button
                key="delete"
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => setTodos(todos.filter((_, i) => i !== idx))}
                aria-label="Delete task"
              />
            ]}
            style={{ borderRadius: 16, marginBottom: 8, background: "#fafbfc" }}
          >
            <Typography.Text style={{ fontSize: 16 }}>{item}</Typography.Text>
          </List.Item>
        )}
        locale={{ emptyText: "No tasks" }}
        style={{ marginTop: 8 }}
      />
    </div>
  );
} 