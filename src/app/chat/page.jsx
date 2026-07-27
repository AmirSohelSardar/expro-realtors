"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { MessageCircle } from "lucide-react";
import { roleLabel, formatChatTime } from "@/lib/utils";
import { Suspense } from "react";

function ChatListInner() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

useEffect(() => {
    api
      .get("/chat/user")
      .then(({ data }) => setChats(data || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      api
        .get("/chat/user")
        .then(({ data }) => setChats(data || []))
        .catch(() => {});
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Auto-start a chat if arriving from "Message seller" with sellerId/propertyId
  useEffect(() => {
    const sellerId = searchParams.get("sellerId");
    const propertyId = searchParams.get("propertyId");
    if (!sellerId || starting) return;

    setStarting(true);
    api
      api
  .post("/chat/start", { sellerId, propertyId, buyerId: user._id })
      .then(({ data }) => router.replace(`/chat/${data._id}`))
      .catch((err) => {
        console.error(err);
        setStarting(false);
      });
  }, [searchParams, router, starting]);

  if (loading || starting) return <Spinner />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl italic text-ink-950">Messages</h1>

      {chats.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={MessageCircle} title="No conversations yet" description="Messages with buyers and sellers will show up here." />
        </div>
      ) : (
        <div className="mt-8 flex flex-col divide-y divide-ink-800/10 rounded-sm border border-ink-800/10">
          {chats.map((chat) => {
            const other = user._id === chat.buyer?._id ? chat.seller : chat.buyer;
            const lastMsg = chat.messages?.[chat.messages.length - 1];
            return (
              <Link
                key={chat._id}
                href={`/chat/${chat._id}`}
                className="flex items-center gap-4 p-4 hover:bg-paper-100/60"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-ink-900">
                  {other?.profilePic && <Image src={other.profilePic} alt="" fill sizes="48px" className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-display text-base text-ink-950">
                      {other?.name}{" "}
                      <span className="font-mono text-[10px] font-normal uppercase tracking-widest text-ink-800/40">
                        {roleLabel(other, chat)}
                      </span>
                    </p>
                    {lastMsg && (
                      <span className="shrink-0 text-[10px] text-ink-800/40">
                        {formatChatTime(lastMsg.createdAt)}
                      </span>
                    )}
                  </div>
                  {chat.property && (
                    <p className="truncate text-[11px] text-ink-800/40">{chat.property.title}</p>
                  )}
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`truncate text-sm ${
                        chat.unreadCount > 0 ? "font-semibold text-ink-950" : "text-ink-800/60"
                      }`}
                    >
                      {lastMsg ? lastMsg.text : "No messages yet"}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-brass-500 px-1.5 text-[10px] font-semibold text-ink-950">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ChatListPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <ChatListInner />
    </Suspense>
  );
}