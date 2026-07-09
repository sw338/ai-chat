import { useState, useRef, useEffect } from "react";

interface Message { id: string; role: "user" | "assistant"; text: string }

const replies = [
  "这是一个很好的问题！让我来帮你分析一下。",
  "根据我的理解，这个问题的核心在于数据结构的选择。",
  "你可以尝试从不同的角度思考这个问题。",
  "让我推荐几种解决方案供你参考。",
  "这个问题比较复杂，我建议分步骤来处理。",
  "很好！这正是需要关注的关键点。",
  "我来给你详细解释一下背后的原理。",
  "如果你还有其他问题，随时可以问我哦！",
];

function App() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", text: "👋 你好！我是 AI 助手，有什么可以帮你的？" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  function send() {
    const text = input.trim();
    if (!text) return;
    const msg: Message = { id: Date.now().toString(), role: "user", text };
    setMessages((prev) => [...prev, msg]);
    setInput("");
    setTyping(true);

    // Simulate AI reply
    setTimeout(() => {
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", text: reply }]);
      setTyping(false);
    }, 800 + Math.random() * 1200);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-500 text-white px-6 py-4 text-center shadow">
        <h1 className="text-lg font-semibold">🤖 AI 聊天助手</h1>
        <p className="text-xs text-indigo-200">在线 · 随时为你服务</p>
      </header>

      {/* Messages */}
      <div className="flex-1 max-w-2xl w-full mx-auto p-4 space-y-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 140px)" }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-indigo-500 text-white rounded-br-md"
                : "bg-white text-gray-700 rounded-bl-md shadow-sm border border-gray-100"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-400 text-sm px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
              <span className="inline-flex gap-1">
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="输入消息..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="px-6 py-2.5 bg-indigo-500 text-white rounded-xl font-medium text-sm hover:bg-indigo-600 disabled:opacity-50 transition-colors"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
