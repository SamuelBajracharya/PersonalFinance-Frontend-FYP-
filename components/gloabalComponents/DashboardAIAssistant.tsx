"use client";

import React, { useState } from "react";
import { BsArrowUp } from "react-icons/bs";
import { useAIAssistant } from "@/hooks/useAIAssistant";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

const DashboardAIAssistant = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLocked, setIsLocked] = useState(false);
    const { mutateAsync, isPending } = useAIAssistant();

    const handleSend = async () => {
        const text = input.trim();
        if (!text || isLocked) return;

        setInput("");
        setIsLocked(true);

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: text,
        };

        const assistantPlaceholderId = crypto.randomUUID();

        setMessages((prev) => [
            ...prev,
            userMessage,
            { id: assistantPlaceholderId, role: "assistant", content: "" },
        ]);

        try {
            const res = await mutateAsync({ user_prompt: text });
            const reply = res.advice || res.raw_model_output || "No response generated.";

            setMessages((prev) =>
                prev.map((m) =>
                    m.id === assistantPlaceholderId ? { ...m, content: reply } : m,
                ),
            );
        } catch {
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === assistantPlaceholderId
                        ? { ...m, content: "Sorry, something went wrong." }
                        : m,
                ),
            );
        } finally {
            setIsLocked(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="bg-secondaryBG rounded-2xl p-4 h-full flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {messages.length === 0 ? (
                    <p className="text-textsecondary text-sm">
                        Ask anything about your spending, savings, and budget planning.
                    </p>
                ) : (
                    messages.map((msg) =>
                        msg.role === "user" ? (
                            <div
                                key={msg.id}
                                className="ml-auto max-w-[92%] rounded-2xl bg-accent px-3 py-2 text-sm text-white leading-relaxed whitespace-pre-wrap"
                            >
                                {msg.content}
                            </div>
                        ) : (
                            <div
                                key={msg.id}
                                className="max-w-full text-sm text-textmain leading-relaxed whitespace-pre-wrap"
                            >
                                {msg.content || "Thinking..."}
                            </div>
                        ),
                    )
                )}
            </div>

            <div className="mt-3 flex items-end rounded-full bg-accentBG/60 px-3 py-1.5">
                <textarea
                    value={input}
                    rows={1}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLocked}
                    placeholder="Message"
                    className="w-full resize-none bg-transparent text-sm text-textmain placeholder:text-textsecondary focus:outline-none py-1.5 px-1 disabled:cursor-not-allowed"
                />

                <button
                    onClick={handleSend}
                    disabled={isPending || isLocked || !input.trim()}
                    className="p-2 text-textsecondary hover:text-textmain transition-colors disabled:opacity-40"
                    aria-label="Send message"
                >
                    <BsArrowUp size={16} />
                </button>
            </div>
        </div>
    );
};

export default DashboardAIAssistant;
