"use client";

import React, { useEffect, useRef, useState } from "react";
import { BsArrowUp } from "react-icons/bs";
import { useAIAssistant } from "@/hooks/useAIAssistant";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const SESSION_ID_KEY = "ai_advisor_session_id";

const getSessionId = () => {
  if (typeof window === "undefined") return null;

  let id = sessionStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
};

const TypingDots = () => (
  <div className="flex gap-1 text-2xl px-2">
    <span className="animate-bounce">•</span>
    <span className="animate-bounce delay-150">•</span>
    <span className="animate-bounce delay-300">•</span>
  </div>
);

/*
  Formatter
  - ## ### #### headings
  - Bullets
  - Numbered sections
  - --- dividers
*/
const formatAssistantText = (text: string) => {
  const sections = text.split(/---+/g);

  return sections.map((section, i) => {
    const lines = section.trim().split("\n");

    return (
      <div key={i} className="mb-6">
        {lines.map((line, j) => {
          const trimmed = line.trim();

          /* #### → biggest heading */
          if (/^####\s+/.test(trimmed)) {
            return (
              <h1
                key={j}
                className="text-4xl md:text-5xl font-semibold mt-6 mb-4"
              >
                {trimmed.replace(/^####\s+|#+\s*$/g, "")}
              </h1>
            );
          }

          /* ### → large heading */
          if (/^###\s+/.test(trimmed)) {
            return (
              <h2
                key={j}
                className="text-2xl md:text-3xl font-semibold mt-5 mb-3"
              >
                {trimmed.replace(/^###\s+|#+\s*$/g, "")}
              </h2>
            );
          }

          /* ## → medium heading */
          if (/^##\s+/.test(trimmed)) {
            return (
              <h3
                key={j}
                className="text-xl md:text-2xl font-semibold mt-4 mb-2"
              >
                {trimmed.replace(/^##\s+|#+\s*$/g, "")}
              </h3>
            );
          }

          /* Bullet points */
          if (trimmed.startsWith("•")) {
            return (
              <li key={j} className="ml-6 list-disc">
                {trimmed.replace(/^•\s*/, "")}
              </li>
            );
          }

          /* Numbered section titles */
          if (/^\d+\./.test(trimmed)) {
            return (
              <p key={j} className="font-semibold mt-3 mb-1">
                {line}
              </p>
            );
          }

          /* Normal paragraph */
          return (
            <p key={j} className="leading-relaxed">
              {line}
            </p>
          );
        })}

        {i < sections.length - 1 && <div className="h-px bg-gray-600 my-4" />}
      </div>
    );
  });
};

/* ---------------- Main Component ---------------- */

export default function AIAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { mutateAsync, isPending } = useAIAssistant();

  const sessionId = getSessionId();
  const STORAGE_KEY = sessionId ? `ai_advisor_messages_${sessionId}` : null;

  /* Load messages on refresh */
  useEffect(() => {
    if (!STORAGE_KEY) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setMessages(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  /* Persist messages */
  useEffect(() => {
    if (!STORAGE_KEY) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  /* Auto-grow textarea */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [input]);

  /* Send message */
  const handleSend = async () => {
    if (!input.trim() || isLocked) return;

    const userText = input;
    setInput("");
    setIsLocked(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: userText,
    };

    setMessages((prev) => [...prev, userMsg]);

    const tempId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: tempId, role: "assistant", content: "" },
    ]);

    try {
      const res = await mutateAsync({ user_prompt: userText });
      const reply =
        res.advice || res.raw_model_output || "No response generated.";
      typeOutResponse(tempId, reply);
    } catch {
      typeOutResponse(tempId, "Sorry — something went wrong.");
    }
  };

  /* Enter sends, Shift+Enter newline */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* Typing animation */
  const typeOutResponse = (id: string, text: string) => {
    let i = 0;

    const interval = setInterval(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, content: text.slice(0, i) } : m))
      );

      i++;

      if (i > text.length) {
        clearInterval(interval);
        setIsLocked(false);
      }
    }, 12);
  };

  return (
    <div className="min-h-screen text-gray-100 font-sans flex flex-col items-center">
      <div className="w-full max-w-4xl flex-1 flex flex-col px-4 pt-10 pb-40">
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex flex-1 items-center justify-center text-center">
            <div className="text-gray-200">
              <h1 className="text-5xl font-semibold mb-2">
                How can I help you?
              </h1>
              <p className="text-base text-gray-300">
                Ask anything! I’m here to assist.
              </p>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full mb-8 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "user" ? (
              <div className="bg-accent text-white px-5 py-3 rounded-2xl max-w-[85%] md:max-w-[70%] text-lg leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </div>
            ) : (
              <div className="w-full max-w-[90%] text-lg leading-relaxed">
                {msg.content ? (
                  formatAssistantText(msg.content)
                ) : (
                  <TypingDots />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="fixed bottom-0 w-full flex flex-col items-center z-10">
        <div className="w-full max-w-4xl bg-mainBG pb-4">
          <div className="flex items-end bg-secondaryBG rounded-4xl px-4 py-2">
            <textarea
              ref={textareaRef}
              value={input}
              placeholder="Message"
              rows={1}
              disabled={isLocked}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full resize-none overflow-hidden bg-transparent text-gray-200 placeholder-gray-400 py-3 pl-3 pr-10 focus:outline-none disabled:cursor-not-allowed"
            />

            <button
              onClick={handleSend}
              disabled={isPending || isLocked}
              className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-40"
            >
              <BsArrowUp size={20} />
            </button>
          </div>

          <p className="w-full text-center pt-2 text-gray-300 text-sm">
            This assistant may make mistakes and is not a substitute for
            professional advice.
          </p>
        </div>
      </div>
    </div>
  );
}
