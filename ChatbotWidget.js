import React, { useState, useRef, useEffect } from "react";

const ChatbotWidget = () => {
  const [messages, setMessages] = useState([
    { text: "Hi! I’m your AI assistant. Ask me anything!", sender: "bot" },
  ]);
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("llama3");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!userMessage.trim()) return;

    const newMessages = [...messages, { text: userMessage, sender: "user" }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ prompt: userMessage, model: selectedModel }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { text: data.response, sender: "bot" }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "⚠️ Failed to fetch response. Try again later.",
          sender: "bot",
        },
      ]);
    } finally {
      setUserMessage("");
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="fixed bottom-4 right-4 w-[380px] max-h-[90vh] z-50 bg-black/70 backdrop-blur-lg border border-cyan-500 rounded-2xl shadow-[0_0_25px_rgba(0,255,255,0.3)] overflow-hidden">
      <div className="p-4 space-y-3">
        <h2 className="text-xl font-bold text-cyan-300 mb-2 animate-fadeInUp">
          ⚡ Cyber Chatbot
        </h2>

        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full p-2 bg-black border border-cyan-500 text-cyan-200 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="llama3">🦙 LLaMA 3</option>
          <option value="mistral">🌪️ Mistral</option>
          <option value="gemma">💎 Gemma</option>
        </select>

        <div className="h-64 overflow-y-auto p-2 rounded-xl bg-black/30 backdrop-blur border border-cyan-800 custom-scrollbar space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start space-x-2 max-w-[85%] ${
                msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
              }`}
            >
              <span className="text-xl">
                {msg.sender === "user" ? "🧑" : "🤖"}
              </span>
              <div
                className={`px-4 py-2 rounded-xl shadow text-sm whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-cyan-600 text-white animate-fadeInRight"
                    : "bg-gray-700 text-cyan-200 animate-fadeInLeft"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-cyan-400 text-sm animate-pulse ml-2">
              🤖 Typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something..."
            className="flex-1 p-2 rounded-l-md bg-gray-800 text-white border border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            onClick={handleSend}
            className="bg-cyan-500 hover:bg-cyan-600 transition-colors px-4 text-white font-semibold rounded-r-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotWidget;
