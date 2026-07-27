"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/lib/api";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import Spinner from "@/components/Spinner";
import { ArrowLeft, Send, Trash2, Check, CheckCheck } from "lucide-react";
import { roleLabel, formatChatTime, formatChatDateLabel } from "@/lib/utils";

export default function ChatConversationPage() {
  const { chatId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  // const bottomRef = useRef(null);

  useEffect(() => {
    api
      .get(`/chat/${chatId}`)
      .then(({ data }) => {
        setChat(data);
        setMessages(data.messages || []);
      })
      .catch(() => showToast("Failed to load conversation", "error"))
      .finally(() => setLoading(false));
  }, [chatId]);

  useEffect(() => {
    let active = true;
    const interval = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      api
        .get(`/chat/${chatId}`)
        .then(({ data }) => {
          if (!active) return;
          setMessages(data.messages || []);
        })
        .catch(() => {});
    }, 4000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [chatId]);

  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    const content = text;
    setText("");
    try {
      const { data } = await api.post("/chat/send", { chatId, text: content });
      setMessages((prev) => [...prev, data.newMessage]);
    } catch (err) {
      showToast("Failed to send message", "error");
      setText(content);
    } finally {
      setSending(false);
    }
  }

  async function handleDeleteMessage(messageId) {
    try {
      await api.delete(`/chat/${chatId}/message/${messageId}`);
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    } catch (err) {
      showToast("Failed to delete message", "error");
    }
  }

  if (loading) return <Spinner />;
  if (!chat) return <p className="px-6 py-16 text-center text-ink-800/60">Conversation not found.</p>;

  const other = user._id === chat.buyer?._id ? chat.seller : chat.buyer;

  return (
    <div className="mx-auto flex h-[calc(100vh-64px)] max-w-3xl flex-col px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 border-b border-ink-800/10 py-4">
        <button onClick={() => router.push("/chat")} className="text-ink-800/60 hover:text-ink-950">
          <ArrowLeft size={18} />
        </button>
        <div className="relative h-9 w-9 overflow-hidden rounded-full bg-ink-900">
          {other?.profilePic && <Image src={other.profilePic} alt="" fill sizes="36px" className="object-cover" />}
        </div>
        <div>
          <p className="font-display text-base text-ink-950">
            {other?.name}{" "}
            <span className="font-mono text-[10px] font-normal uppercase tracking-widest text-ink-800/40">
              {roleLabel(other, chat)}
            </span>
          </p>
          {chat.property && <p className="text-xs text-ink-800/50">{chat.property.title}</p>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="flex flex-col gap-2">
          {messages.map((m, idx) => {
            const mine = (m.sender?._id || m.sender) === user._id;
            const prev = messages[idx - 1];
            const showDateSeparator =
              !prev || formatChatDateLabel(prev.createdAt) !== formatChatDateLabel(m.createdAt);
            return (
              <div key={m._id}>
                {showDateSeparator && (
                  <div className="my-3 flex items-center justify-center">
                    <span className="rounded-full bg-paper-100 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-800/50">
                      {formatChatDateLabel(m.createdAt)}
                    </span>
                  </div>
                )}
                <div className={`group flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`relative max-w-[75%] rounded-sm px-3 py-2 text-sm ${
                      mine ? "bg-ink-900 text-paper-50" : "bg-paper-100 text-ink-900"
                    }`}
                  >
                    {m.text}
                    <span
                      className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                        mine ? "text-paper-100/50" : "text-ink-800/40"
                      }`}
                    >
                      {formatChatTime(m.createdAt)}
                      {mine && (m.isRead ? <CheckCheck size={13} className="text-brass-400" /> : <Check size={13} />)}
                    </span>
                    {mine && (
                      <button
                        onClick={() => handleDeleteMessage(m._id)}
                        className="absolute -left-6 top-1/2 hidden -translate-y-1/2 text-ink-800/40 hover:text-rust-500 group-hover:block"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {/* <div ref={bottomRef} /> */}
        </div>
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-ink-800/10 py-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="rounded-sm bg-brass-500 p-2.5 text-ink-950 hover:bg-brass-400 disabled:opacity-40"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}