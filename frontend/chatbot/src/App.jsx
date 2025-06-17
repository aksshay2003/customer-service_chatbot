import React, { useState } from "react";

export default function App() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm your AI support assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [caseId, setCaseId] = useState(null);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = {
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((msgs) => [...msgs, userMsg]);

    // Call backend API
    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_message: input }),
      });
      const data = await res.json();

      // Add bot messages from response
      const botMessages = data.messages
        .filter((m) => m.sender === "bot")
        .map((m) => ({
          sender: m.sender,
          text: m.text,
          timestamp: new Date(m.timestamp).toLocaleTimeString(),
        }));

      setMessages((msgs) => [...msgs, ...botMessages]);
      setCaseId(data.case_id);
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "bot",
          text: "Sorry, something went wrong.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
    setInput("");
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>AI Support Assistant</h2>
      {caseId && <p>Case ID: {caseId}</p>}

      <div
        style={{
          border: "1px solid #ccc",
          height: 300,
          padding: 10,
          overflowY: "scroll",
          marginBottom: 10,
          background: "#f9f9f9",
        }}
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              textAlign: m.sender === "user" ? "right" : "left",
              margin: "10px 0",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: m.sender === "user" ? "#005eff" : "#eee",
                color: m.sender === "user" ? "white" : "black",
                padding: "8px 12px",
                borderRadius: 12,
                maxWidth: "80%",
              }}
            >
              {m.text}
            </div>
            <div style={{ fontSize: 10, color: "#666" }}>{m.timestamp}</div>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        placeholder="Type your message..."
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        style={{ width: "80%", padding: 8 }}
      />
      <button onClick={sendMessage} style={{ padding: 8, marginLeft: 5 }}>
        Send
      </button>
    </div>
  );
}
