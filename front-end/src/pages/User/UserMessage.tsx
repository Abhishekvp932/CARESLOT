"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

import EmojiPicker from "emoji-picker-react";

import {
  useGetUserChatQuery,
  useSendMessageMutation,
  useGetPatientMessageQuery,
} from "@/features/chat/chatApi";
import { socket } from "@/socket/socket";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { useRef } from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Calendar,
  Stethoscope,
  ImageIcon,
} from "lucide-react";

interface Message {
  id: string;
  chatId: string;
  content: string;
  sender: string;
  timestamp: string;
  type: "text" | "image";
  image?: string;
  createdAt: Date;
  read: boolean;
}

interface IConversation {
  _id: string;
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
  isActive: boolean;
  doctorId?: {
    _id: string;
    profile_img: string;
    name: string;
    specialization: string;
  };
  unreadCount: number;
}

export function UserMessagingPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationss, setConversation] = useState<IConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const patient = useSelector((state: RootState) => state.auth.user);
  const patientId = patient?._id as string;

  const { data: conversations = [], refetch: chatRefetch } =
    useGetUserChatQuery({
      patientId,
    });

  useEffect(() => {
    if (!Array.isArray(conversations)) return;

    setConversation(
      conversations.map((c: IConversation) => ({
        _id: c._id,
        lastMessage: c.lastMessage,
        isActive: c.isActive,
        doctorId: c.doctorId,
        unreadCount:c.unreadCount
      }))
    );
  }, [conversations]);

  const { data: messagess = [], refetch } = useGetPatientMessageQuery(
    selectedConversation,
    {
      skip: !selectedConversation,
    }
  );

  // const conversations = Array.isArray(data) ? data : [];

  const [sendMessage] = useSendMessageMutation();

  useEffect(() => {
    conversations.forEach((chat) => socket.emit("joinRoom", chat._id));
  }, [conversations]);

  useEffect(() => {
    if (selectedConversation) {
      refetch();
      setMessages([]);
    }
  }, [selectedConversation, refetch]);

  useEffect(() => {
    if (!selectedConversation || !Array.isArray(messagess)) return;

    setMessages((prev) => {
      const newMessages = messagess.map((m: any) => ({
        id: m._id,
        chatId: m.chatId,
        content: m.content,
        sender: m.sender,
        timestamp: m.createdAt
          ? new Date(m.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        type: m.type ?? "text",
        image: m.image,
      }));

      const isSame =
        prev.length === newMessages.length &&
        prev.every((p, i) => p.id === newMessages[i].id);

      return isSame ? prev : newMessages;
    });
  }, [messagess, selectedConversation]);

  useEffect(() => {
    const handleReceiveMessage = (msg: Message) => {
      if (msg.chatId === selectedConversation) {
        setMessages((prev) => [...prev, msg]);
      }

      setConversation((prev) => {
        const updated = prev.map((c) =>
          c._id === msg.chatId
            ? {
                ...c,
                lastMessage: {
                  content: msg.content,
                  timestamp: new Date(),
                },
              }
            : c
        );

        const sorted = updated.sort((a, b) => {
          const timeA = a?.lastMessage?.timestamp
            ? new Date(a.lastMessage.timestamp).getTime()
            : 0;
          const timeB = b?.lastMessage?.timestamp
            ? new Date(b.lastMessage.timestamp).getTime()
            : 0;
          return timeB - timeA;
        });

        return [...sorted];
      });
    };
    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!selectedConversation || (!message.trim() && !selectedImage)) return;

    const formData = new FormData();
    formData.append("chatId", selectedConversation);
    formData.append("sender", patientId);

    if (selectedImage) {
      formData.append("type", "image");
      formData.append("image", selectedImage);
    } else {
      formData.append("type", "text");
      formData.append("content", message);
    }

    setMessage("");
    setSelectedImage(null);

    try {
      chatRefetch();
      const res = await sendMessage(formData).unwrap();
      console.log("Message sent:", res);
      socket.emit("sendMessage", res);

      setConversation((prev) =>
        prev.map((c) =>
          c._id === res.chatId
            ? {
                ...c,
                lastMessage: {
                  content: res.content || "Image",
                  timestamp: new Date(),
                },
              }
            : c
        )
      );
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) setSelectedImage(file);
  };

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = () => {
    socket.emit("typing", { chatId: selectedConversation, sender: patientId });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        chatId: selectedConversation,
        sender: patientId,
      });
    }, 2000);
  };

  useEffect(() => {
    const handleTypingEvent = (data: { chatId: string; sender: string }) => {
      if (data.chatId === selectedConversation && data.sender !== patientId) {
        setIsTyping(true);
      }
    };

    const handleStopTypingEvent = (data: {
      chatId: string;
      sender: string;
    }) => {
      if (data.chatId === selectedConversation && data.sender !== patientId) {
        setIsTyping(false);
      }
    };

    socket.on("typing", handleTypingEvent);
    socket.on("stopTyping", handleStopTypingEvent);

    return () => {
      socket.off("typing", handleTypingEvent);
      socket.off("stopTyping", handleStopTypingEvent);
    };
  }, [selectedConversation, patientId]);

  useEffect(() => {
    if (!patientId) return;

    socket.emit("addUser", { userId: patientId, role: "patient" });

    const handleOnlineUsers = (
      users: Record<string, { socketId: string; role: string }>
    ) => {
      setOnlineUsers(users);
    };

    socket.on("onlineUsers", handleOnlineUsers);

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, [patientId]);

  const handleMessageDelete = async (messageId: string, chatId: string) => {
    socket.emit("deleteMessage", { messageId, chatId });
    chatRefetch();
    refetch();
  };

  useEffect(() => {
    socket.on("messageDeleted", (deletedMessageId: string) => {
      setMessages((prev) => prev.filter((msg) => msg?.id !== deletedMessageId));
    });

    return () => {
      socket.off("messageDeleted");
    };
  }, []);

  // const addEmoji = (emoji:any)=>{
  //   setMessage((prev)=> prev+emoji.native)
  //   setShowEmoji(false);
  // }



  const handleConversationClick = (conversation: IConversation) => {
    setSelectedConversation(conversation?._id);

    socket.emit("markAsRead", {
      chatId: conversation._id,
      userId: patientId,
    });
  };

useEffect(() => {
  if (!socket) return;

  socket.on("messagesRead", ({ chatId }) => {
    setConversation(prev =>
      prev.map(c => (c._id === chatId ? { ...c, unreadCount: 0 } : c))
    );
  });

  return () =>{
    socket.off("messagesRead");
  }
}, [socket]);


  useEffect(() => {
    if (!socket) return;

    socket.on(
      "updateConversation",
      ({ chatId, lastMessage, unreadIncrement }) => {
        setConversation((prev) =>
          prev.map((c) =>
            c._id === chatId
              ? {
                  ...c,
                  lastMessage,
                  unreadCount:
                    lastMessage.sender !== patientId
                      ? (c.unreadCount || 0) + unreadIncrement
                      : c.unreadCount,
                }
              : c
          )
        );
      }
    );

    return () => {
      socket.off("updateConversation");
    };
  }, [socket, patientId]);

  const removeSelectedImage = () => setSelectedImage(null);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border flex-shrink-0">
          <h1 className="text-xl font-semibold">Messages</h1>
          <p className="text-sm text-muted-foreground">
            Your healthcare conversations
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {[...conversationss]
              .sort((a, b) => {
                const timeA = a?.lastMessage?.timestamp
                  ? new Date(a.lastMessage.timestamp).getTime()
                  : 0;
                const timeB = b?.lastMessage?.timestamp
                  ? new Date(b.lastMessage.timestamp).getTime()
                  : 0;
                return timeB - timeA;
              })
              .map((conversation) => {
                const isOnline =
                  onlineUsers[conversation.doctorId?._id]?.role === "doctor";

                return (
                  <Card
                    key={conversation._id}
                    className={`p-3 mb-2 cursor-pointer transition-colors hover:bg-accent/20 ${
                      selectedConversation === conversation._id
                        ? "bg-accent/30 border-primary/20"
                        : ""
                    }`}
                    onClick={() => {
                      handleConversationClick(conversation);
                      setSelectedDoctor(conversation?.doctorId);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 relative">
                        <AvatarImage
                          src={
                            conversation?.doctorId?.profile_img ||
                            "/placeholder.svg"
                          }
                        />
                        <AvatarFallback>
                          <Stethoscope className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium truncate">
                            {conversation?.doctorId?.name}
                          </h3>
                          {isOnline && (
                            <span className="bg-green-500 text-white border border-white text-xs px-1 rounded">
                              online
                            </span>
                          )}
                          {conversation.unreadCount > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {conversation.unreadCount}
                            </span>
                          )}

                          {/* {conversation?.unread > 0 && (
                                <div className="ml-2 h-5 w-5 flex items-center justify-center text-xs rounded-full bg-red-600 text-white">
                                  {conversation.unread}
                                </div>
                              )} */}
                        </div>
                        <p className="text-xs text-foreground/70">
                          {conversation?.doctorId?.specialization}
                        </p>
                        <p>{conversation?.lastMessage?.content}</p>
                        <p className="text-sm truncate">
                          <span className="text-xs text-muted-foreground ml-1">
                            {conversation?.lastMessage?.timestamp
                              ? new Date(
                                  conversation.lastMessage.timestamp
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </span>
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedDoctor ? (
          <div className="p-4 border-b border-border bg-card flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedDoctor?.profile_img} />
                  <AvatarFallback>
                    <Stethoscope className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{selectedDoctor?.name}</h2>
                  {isTyping ? (
                    <p className="text-sm text-muted-foreground">Typing...</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {selectedDoctor?.specialization}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-2">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === patientId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`relative max-w-[70%] rounded-lg p-3 ${
                    msg.sender === patientId
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border"
                  }`}
                >
                  {msg.sender === patientId && (
                    <div className="absolute top-1 right-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-xs opacity-70 hover:opacity-100">
                            ▼
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          side="top"
                          className="w-32"
                        >
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() =>
                              handleMessageDelete(msg?.id, msg?.chatId)
                            }
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}

                  {msg.type === "text" ? (
                    <p className="text-sm">{msg.content}</p>
                  ) : (
                    msg.image && (
                      <img
                        src={msg.image}
                        alt="sent image"
                        className="rounded-md max-w-[200px]"
                      />
                    )
                  )}
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs opacity-70">{msg?.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input fixed */}
        <div className="p-4 border-t border-border bg-card flex-shrink-0">
          {selectedImage && (
            <div className="mb-3 p-2 bg-accent/20 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <span className="text-sm">{selectedImage.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={removeSelectedImage}>
                  ×
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="image-upload"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("image-upload")?.click()}
              className="px-3"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>

            <Button variant="outline" onClick={() => setShowEmoji(!showEmoji)}>
              😀
            </Button>

            {showEmoji && (
              <div className="absolute bottom-14 right-10 z-50">
                <EmojiPicker
                  onEmojiClick={(emojiObject) => {
                    setMessage((prev) => prev + emojiObject.emoji);
                    setShowEmoji(false);
                  }}
                />
              </div>
            )}

            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() && !selectedImage}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
