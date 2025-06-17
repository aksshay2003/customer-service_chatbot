import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "ws://localhost:8000/chat/ws";

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(SOCKET_URL);

    ws.current.onmessage = (event) => {
      setMessages((prev) => [...prev, { text: event.data, from: "bot" }]);
    };

    ws.current.onclose = () => {
      console.log("Connection closed");
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    ws.current.send(input);
    setMessages((prev) => [...prev, { text: input, from: "user" }]);
    setInput("");
  };

  return (
    <div>
      <div
        style={{
          border: "1px solid #ccc",
          height: 400,
          overflowY: "auto",
          padding: 10,
          marginBottom: 10,
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.from === "user" ? "right" : "left",
              margin: "5px 0",
            }}
          >
            <span
              style={{
                background: msg.from === "user" ? "#007bff" : "#e5e5ea",
                color: msg.from === "user" ? "white" : "black",
                padding: "8px 12px",
                borderRadius: 15,
                display: "inline-block",
                maxWidth: "80%",
                wordWrap: "break-word",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
        style={{ width: "80%", padding: 8 }}
      />
      <button
        onClick={sendMessage}
        style={{ width: "18%", padding: 8, marginLeft: "2%" }}
      >
        Send
      </button>
    </div>
  );
}

export default ChatWindow;
