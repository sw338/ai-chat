import { useState, useRef, useEffect } from "react";

interface Message { id: string; role: "user" | "assistant"; text: string }

// 关键词匹配回复系统
const knowledge: { keywords: string[]; reply: string }[] = [
  { keywords: ["你好", "嗨", "hello", "hi", "在吗"], reply: "你好！有什么可以帮你的？😊" },
  { keywords: ["天气", "下雨", "晴天"], reply: "抱歉，我暂时无法查询实时天气。建议你打开天气 App 或搜索引擎查看当地天气哦～" },
  { keywords: ["时间", "几点", "日期", "今天"], reply: `现在是 ${new Date().toLocaleString("zh-CN")}，请注意时间管理哦！` },
  { keywords: ["谢谢", "感谢", "多谢", "thanks", "thank"], reply: "不客气！很高兴能帮到你 😊" },
  { keywords: ["再见", "拜拜", "bye", "88"], reply: "再见！随时找我聊天，祝你愉快 👋" },
  { keywords: ["名字", "你是谁", "叫什么", "what", "who"], reply: "我是 AI 聊天助手，基于 React + TypeScript 构建的智能对话机器人 🤖" },
  { keywords: ["react", "vue", "前端", "框架", "javascript", "js", "ts", "typescript", "css", "html"], reply: "前端技术方面，React、Vue、TypeScript 都是很好的选择。React 生态丰富，Vue 上手简单，TypeScript 让代码更安全。你具体想了解什么？" },
  { keywords: ["python", "java", "go", "rust", "后端", "api", "数据库", "sql"], reply: "后端开发中，Python(Flask/Django)适合快速开发，Java(Spring)适合企业级应用，Go 性能优秀，Rust 最安全。选型要看具体场景！" },
  { keywords: ["算法", "leetcode", "面试", "刷题"], reply: "算法学习建议从基础数据结构开始（数组、链表、树、图），配合 LeetCode 每日一题，坚持几个月会有明显提升。加油！💪" },
  { keywords: ["部署", "上线", "服务器", "nginx", "docker", "ci", "cd", "devops"], reply: "部署方面，小型项目推荐 Vercel/Netlify（免费、自动部署），中型项目用 Docker + Nginx，大型项目考虑 K8s。需要具体教程吗？" },
  { keywords: ["bug", "报错", "错了", "错误", "error", "不工作", "失败", "不行"], reply: "遇到 Bug 不要慌！建议按以下步骤排查：1) 看报错信息 2) 检查最近的改动 3) Google/Stack Overflow 搜索 4) 用 console.log 定位。把具体的报错发给我，我帮你分析！" },
  { keywords: ["推荐", "建议", "推荐一下", "哪个好"], reply: "这个问题要多方面考虑哦～你的使用场景是什么？预算多少？有偏好的技术栈吗？给我更多信息我能给出更精准的建议！" },
  { keywords: ["项目", "作品", "github", "开源", "portfolio"], reply: "做项目是提升技术最快的方式！建议从自己感兴趣的方向出发，先做小而美的项目，逐步迭代。GitHub 上有很多优秀开源项目可以学习参考。" },
  { keywords: ["学习", "入门", "新手", "教程", "怎么学", "如何学"], reply: "学习编程建议：1) 确定目标方向 2) 找一套系统教程 3) 边学边练（写代码比看更重要） 4) 做项目巩固 5) 参与开源/写博客输出。最重要的是保持热情和耐心！" },
];

function getSmartReply(input: string): string {
  const text = input.toLowerCase();
  let bestMatch: { keywords: string[]; reply: string } | null = null;
  let bestScore = 0;

  for (const item of knowledge) {
    const score = item.keywords.filter((kw) => text.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && bestScore > 0) return bestMatch.reply;

  // 问句给出针对性回复
  if (text.includes("?") || text.includes("？") || text.includes("吗") || text.includes("什么") || text.includes("怎么") || text.includes("如何")) {
    return "这是个好问题！让我想想…🤔 根据我的了解，这个问题需要从多个角度考虑。你能提供更多具体信息吗？比如具体场景、你的目标是什么？";
  }

  // 短消息
  if (text.length < 5) {
    return "嗯嗯，我听到了～可以说得更详细一点吗？我想更好地理解你的意思 😊";
  }

  // 兜底
  const fallbackReplies = [
    "收到你的消息了！这个话题可以展开聊很多内容，你想了解哪个方面呢？",
    "有意思的观点！让我想想…你能再详细说说吗？",
    "好的，我记住了。还有什么想聊的吗？",
    "嗯，这个问题值得深入讨论。你有具体的场景或例子吗？",
  ];
  return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", text: "👋 你好！我是 AI 聊天助手。我可以聊前端技术、编程学习、项目经验等话题，试试问我吧！" },
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

    setTimeout(() => {
      const reply = getSmartReply(text);
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", text: reply }]);
      setTyping(false);
    }, 600 + Math.random() * 800);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-indigo-500 text-white px-6 py-4 text-center shadow">
        <h1 className="text-lg font-semibold">🤖 AI 聊天助手</h1>
        <p className="text-xs text-indigo-200">智能匹配 · 上下文回复</p>
      </header>

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

      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="输入消息… 试试问「前端框架推荐」「遇到Bug怎么办」"
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
          />
          <button onClick={send} disabled={!input.trim()}
            className="px-6 py-2.5 bg-indigo-500 text-white rounded-xl font-medium text-sm hover:bg-indigo-600 disabled:opacity-50 transition-colors">发送</button>
        </div>
      </div>
    </div>
  );
}

export default App;
