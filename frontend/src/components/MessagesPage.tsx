import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  MessageCircle,
  Search,
  Send,
  AlertCircle,
  Image as ImageIcon,
  Paperclip,
} from "lucide-react";
import { toast } from "sonner";

interface ApiConversation {
  id: number;
  itemId: number | null;
  itemTitle?: string;
  itemImage?: string | null;
  counterpart: {
    id: number;
    name: string;
    faculty?: string;
    avatar?: string | null;
  };
  lastMessage?: {
    id: number;
    sender_id: number;
    text: string;
    created_at: string;
  } | null;
  unreadCount: number;
  lastMessageAt?: string;
}

interface ApiMessage {
  id: number;
  conversationId: number;
  senderId: number;
  text: string;
  createdAt: string;
  isRead: boolean;
}

interface MessagesPageProps {
  apiBaseUrl: string;
  authToken: string;
  currentUserId: number;
  onConversationsSnapshot?: (conversations: ApiConversation[]) => void;
}

function getWsBase(apiBaseUrl: string) {
  return apiBaseUrl.replace(/\/api\/?$/, "");
}

export function MessagesPage({
  apiBaseUrl,
  authToken,
  currentUserId,
  onConversationsSnapshot,
}: MessagesPageProps) {
  const [conversations, setConversations] = useState<ApiConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [messagesByConversation, setMessagesByConversation] = useState<Record<number, ApiMessage[]>>({});
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const fetchConversations = useCallback(async () => {
    if (!authToken) return;
    try {
      const response = await fetch(`${apiBaseUrl}/messages/conversations`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body?.message ?? "ไม่สามารถโหลดรายการแชท");
      }
      const nextConversations = body.conversations ?? [];
      setConversations(nextConversations);
      onConversationsSnapshot?.(nextConversations);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      toast.error("โหลดแชทไม่สำเร็จ", { description: message });
    }
  }, [apiBaseUrl, authToken, onConversationsSnapshot]);

  const fetchMessages = async (conversationId: number) => {
    if (!authToken) return;
    setIsLoadingMessages(true);
    try {
      const response = await fetch(
        `${apiBaseUrl}/messages/conversations/${conversationId}/messages`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body?.message ?? "ไม่สามารถโหลดข้อความ");
      }
      setMessagesByConversation((prev) => ({
        ...prev,
        [conversationId]: body.messages ?? [],
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      toast.error("โหลดข้อความไม่สำเร็จ", { description: message });
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const selectedMessages = useMemo(() => {
    if (selectedConversationId == null) return [];
    return messagesByConversation[selectedConversationId] ?? [];
  }, [selectedConversationId, messagesByConversation]);

  useEffect(() => {
    if (!authToken) return;
    fetchConversations();
  }, [authToken, fetchConversations]);

  useEffect(() => {
    if (conversations.length === 0) {
      setSelectedConversationId(null);
      return;
    }
    if (
      selectedConversationId === null ||
      !conversations.some((conv) => conv.id === selectedConversationId)
    ) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  useEffect(() => {
    if (selectedConversationId == null) return;
    if (!messagesByConversation[selectedConversationId]) {
      fetchMessages(selectedConversationId);
    }
  }, [selectedConversationId]);

  useEffect(() => {
    if (!authToken) return;
    const wsBase = getWsBase(apiBaseUrl);
    const socket = io(wsBase, {
      auth: { token: authToken },
    });
    socketRef.current = socket;

    socket.on("message:new", (message: ApiMessage) => {
      setMessagesByConversation((prev) => ({
        ...prev,
        [message.conversationId]: [...(prev[message.conversationId] ?? []), message],
      }));
      setConversations((prev) => {
        const exists = prev.some((conv) => conv.id === message.conversationId);
        if (!exists) {
          fetchConversations();
          return prev;
        }
        const updated = prev.map((conv) =>
          conv.id === message.conversationId
            ? {
                ...conv,
                lastMessage: {
                  id: message.id,
                  sender_id: message.senderId,
                  text: message.text,
                  created_at: message.createdAt,
                },
                unreadCount:
                  message.conversationId === selectedConversationId
                    ? 0
                    : conv.unreadCount + 1,
              }
            : conv
        );
        onConversationsSnapshot?.(updated);
        return updated;
      });
    });

    socket.on("connect_error", (err) => {
      console.warn("socket error", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [authToken, apiBaseUrl, selectedConversationId]);

  const handleSelectConversation = (conversationId: number) => {
    setSelectedConversationId(conversationId);
    setConversations((prev) => {
      const updated = prev.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      );
      onConversationsSnapshot?.(updated);
      return updated;
    });
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || selectedConversationId == null || !authToken) return;
    const text = messageInput.trim();
    setMessageInput("");

    const optimisticMessage: ApiMessage = {
      id: Date.now(),
      conversationId: selectedConversationId,
      senderId: currentUserId,
      text,
      createdAt: new Date().toISOString(),
      isRead: true,
    };

    setMessagesByConversation((prev) => ({
      ...prev,
      [selectedConversationId]: [...(prev[selectedConversationId] ?? []), optimisticMessage],
    }));

    try {
      const response = await fetch(
        `${apiBaseUrl}/messages/conversations/${selectedConversationId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ text }),
        }
      );

      const body = await response.json();
      if (!response.ok) {
        throw new Error(body?.message ?? "ส่งข้อความไม่สำเร็จ");
      }

      setMessagesByConversation((prev) => ({
        ...prev,
        [selectedConversationId]: [
          ...(prev[selectedConversationId]?.filter((msg) => msg.id !== optimisticMessage.id) ||
            []),
          body.message,
        ],
      }));
      fetchConversations();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      toast.error("ส่งข้อความไม่สำเร็จ", { description: message });
    }
  };

  const filteredConversations = useMemo(() => {
    return conversations.filter(
      (conv) =>
        conv.counterpart.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (conv.itemTitle ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <MessageCircle className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary">Messages</span>
          </div>
          <h1 className="mb-2 text-primary">ข้อความ</h1>
          <p className="text-muted-foreground">แชทกับผู้ใช้งานและนัดรับของได้ที่นี่</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 rounded-2xl border-2 border-primary/20">
            <CardContent className="p-4">
              <div className="mb-4 p-3 bg-accent/10 border border-accent/20 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    ของหนึ่งชิ้นแลกได้แค่คนเดียว แชทที่มีเครื่องหมาย ✓ คือผู้รับที่ยืนยันแล้ว
                  </p>
                </div>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาข้อความ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>

              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-2">
                  {filteredConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => handleSelectConversation(conversation.id)}
                      className={`w-full p-3 rounded-xl text-left transition-all relative ${
                        selectedConversationId === conversation.id
                          ? "bg-primary/10 border-2 border-primary/30"
                          : "bg-background hover:bg-muted border-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12 border-2 border-primary/30">
                          <AvatarImage src={conversation.counterpart.avatar ?? ""} />
                          <AvatarFallback>{conversation.counterpart.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-sm truncate">
                              {conversation.counterpart.name}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-primary rounded-full h-5 w-5 flex items-center justify-center p-0 text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {conversation.itemTitle ?? "หาเพื่อนแลกของ"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {conversation.lastMessage?.text ?? "ยังไม่มีข้อความ"}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 rounded-2xl border-2 border-primary/20">
            <CardContent className="p-0 lg:p-0 flex flex-col h-full">
              {selectedConversation ? (
                <>
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div>
                      <h3 className="text-lg font-semibold">{selectedConversation.counterpart.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedConversation.itemTitle ?? "หาเพื่อนแลกของ"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-[500px] p-4">
                      <div className="space-y-4">
                        {isLoadingMessages ? (
                          <p className="text-center text-sm text-muted-foreground">
                            กำลังโหลดข้อความ...
                          </p>
                        ) : selectedMessages.length === 0 ? (
                          <p className="text-center text-sm text-muted-foreground">
                            ยังไม่มีข้อความในแชทนี้
                          </p>
                        ) : (
                          selectedMessages.map((message) => {
                            const isOwn = message.senderId === currentUserId;
                            return (
                              <div
                                key={message.id}
                                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                              >
                                <div
                                  className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                                    isOwn
                                      ? "bg-primary text-primary-foreground rounded-br-sm"
                                      : "bg-muted rounded-bl-sm"
                                  }`}
                                >
                                  <p className="text-sm whitespace-pre-wrap break-words">
                                    {message.text}
                                  </p>
                                  <p className="text-[11px] uppercase mt-1 opacity-75 text-right">
                                    {new Date(message.createdAt).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </ScrollArea>
                  </div>

                  <Separator className="my-0" />

                  <div className="p-4 flex items-center gap-2">
                    <Input
                      placeholder="พิมพ์ข้อความ..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="rounded-xl"
                    />
                    <Button onClick={handleSendMessage} className="rounded-xl" disabled={!messageInput.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="h-[620px] flex flex-col items-center justify-center gap-3 text-center px-6">
                  <MessageCircle className="h-12 w-12 text-primary/60" />
                  <h3 className="text-lg font-semibold">เลือกแชทเพื่อเริ่มสนทนา</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    เมื่อมีคนสนใจแลกของกับคุณ หรือคุณส่งคำขอแลกให้ผู้อื่น แชทจะปรากฏที่นี่
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
