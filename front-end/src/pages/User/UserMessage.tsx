

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EmojiPicker from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
import {
  useGetUserChatQuery,
  useSendMessageMutation,
  useGetPatientMessageQuery,
} from "@/features/chat/chatApi";
import { socket } from "@/socket/socket";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
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
  ArrowLeft,
  Menu,
} from "lucide-react";
import { ToastContainer } from "react-toastify";

// Type definitions
interface DoctorInfo {
  _id: string;
  profile_img: string;
  name: string;
  specialization: string;
}

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
    sender?: string;
  };
  isActive: boolean;
  doctorId?: DoctorInfo;
  unreadCount: number;
}

interface OnlineUsers {
  [key: string]: {
    socketId: string;
    role: string;
  };
}

interface TypingData {
  chatId: string;
  sender: string;
}

interface MessageDeleteData {
  messageId: string;
  chatId: string;
}

interface UpdateConversationData {
  chatId: string;
  lastMessage: {
    content: string;
    timestamp: Date;
    sender: string;
  };
  unreadIncrement: number;
}

// API Response types
interface MessageResponse {
  _id: string;
  chatId: string;
  content: string;
  sender: string;
  createdAt: string;
  type?: "text" | "image";
  image?: string;
  read: boolean;
}

interface SendMessageResponse {
  chatId: string;
  content?: string;
  image?: string;
}

export function UserMessagingPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationss, setConversation] = useState<IConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUsers>({});
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorInfo | undefined>(undefined);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  
  const patient = useSelector((state: RootState) => state.auth.user);
  const patientId = patient?._id as string;
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations = [], refetch: chatRefetch } = useGetUserChatQuery({
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
        unreadCount: c.unreadCount,
      }))
    );
  }, [conversations]);

  const { data: messagess = [], refetch } = useGetPatientMessageQuery(
    selectedConversation,
    {
      skip: !selectedConversation,
    }
  );

  const [sendMessage] = useSendMessageMutation();

  useEffect(() => {
    conversations.forEach((chat: IConversation) =>
      socket.emit("joinRoom", chat._id)
    );
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
      const newMessages = (messagess as MessageResponse[]).map((m) => ({
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
        createdAt: new Date(m.createdAt),
        read: m.read,
      }));

      const isSame =
        prev.length === newMessages.length &&
        prev.every((p, i) => p.id === newMessages[i].id);

      return isSame ? prev : newMessages;
    });
  }, [messagess, selectedConversation]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      const res = await sendMessage(formData).unwrap() as SendMessageResponse;
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
    const handleTypingEvent = (data: TypingData) => {
      if (data.chatId === selectedConversation && data.sender !== patientId) {
        setIsTyping(true);
      }
    };

    const handleStopTypingEvent = (data: TypingData) => {
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

    const handleOnlineUsers = (users: OnlineUsers) => {
      setOnlineUsers(users);
    };

    socket.on("onlineUsers", handleOnlineUsers);

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, [patientId]);

  const handleMessageDelete = async (messageId: string, chatId: string) => {
    const deleteData: MessageDeleteData = { messageId, chatId };
    socket.emit("deleteMessage", deleteData);
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

  const handleConversationClick = (conversation: IConversation) => {
    setSelectedConversation(conversation?._id);
    setShowSidebar(false); // Hide sidebar on mobile when conversation is selected

    socket.emit("markAsRead", {
      chatId: conversation._id,
      userId: patientId,
    });
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("messagesRead", ({ chatId }: { chatId: string }) => {
      setConversation((prev) =>
        prev.map((c) => (c._id === chatId ? { ...c, unreadCount: 0 } : c))
      );
    });

    return () => {
      socket.off("messagesRead");
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("updateConversation", (data: UpdateConversationData) => {
      const { chatId, lastMessage, unreadIncrement } = data;
      setConversation((prev) =>
        prev.map((c) =>
          c._id === chatId
            ? {
                ...c,
                lastMessage,
                unreadCount:
                  lastMessage.sender === patientId
                    ? c.unreadCount
                    : (c.unreadCount || 0) + unreadIncrement,
              }
            : c
        )
      );
    });

    return () => {
      socket.off("updateConversation");
    };
  }, [patientId]);

  const removeSelectedImage = () => setSelectedImage(null);

  const currentConversation = conversationss.find(
    (c) => c._id === selectedConversation
  );

  const handleBackToList = () => {
    setShowSidebar(true);
    setSelectedConversation(null);
    setSelectedDoctor(undefined);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar - Responsive */}
      <div
        className={`${
          showSidebar ? "flex" : "hidden"
        } lg:flex w-full lg:w-80 border-r border-border bg-card flex-col`}
      >
        <div className="p-3 sm:p-4 border-b border-border flex-shrink-0">
          <h1 className="text-lg sm:text-xl font-semibold">Messages</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
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
                  onlineUsers[conversation.doctorId?._id || ""]?.role ===
                  "doctor";

                return (
                  <Card
                    key={conversation._id}
                    className={`p-2 sm:p-3 mb-2 cursor-pointer transition-colors hover:bg-accent/20 ${
                      selectedConversation === conversation._id
                        ? "bg-accent/30 border-primary/20"
                        : ""
                    }`}
                    onClick={() => {
                      handleConversationClick(conversation);
                      setSelectedDoctor(conversation?.doctorId);
                    }}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12 relative flex-shrink-0">
                        <AvatarImage
                          src={
                            conversation?.doctorId?.profile_img ||
                            "/placeholder.svg"
                          }
                          alt={conversation?.doctorId?.name || "Doctor"}
                        />
                        <AvatarFallback>
                          <Stethoscope className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-medium text-sm sm:text-base truncate">
                            {conversation?.doctorId?.name}
                          </h3>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {isOnline && (
                              <span className="bg-green-500 text-white border border-white text-xs px-1 rounded">
                                online
                              </span>
                            )}
                            {conversation.unreadCount > 0 && (
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-foreground/70 truncate">
                          {conversation?.doctorId?.specialization}
                        </p>
                        <p className="text-xs sm:text-sm truncate text-muted-foreground">
                          {conversation?.lastMessage?.content}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {conversation?.lastMessage?.timestamp
                            ? new Date(
                                conversation.lastMessage.timestamp
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      </div>

      {/* Chat Area - Responsive */}
      <div
        className={`${
          showSidebar ? "hidden" : "flex"
        } lg:flex flex-1 flex-col min-w-0`}
      >
        {selectedDoctor ? (
          <>
            {/* Header */}
            <div className="p-3 sm:p-4 border-b border-border bg-card flex-shrink-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden p-2"
                    onClick={handleBackToList}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                    <AvatarImage
                      src={selectedDoctor?.profile_img}
                      alt={selectedDoctor?.name || "Doctor"}
                    />
                    <AvatarFallback>
                      <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-sm sm:text-base truncate">
                      {selectedDoctor?.name}
                    </h2>
                    {isTyping ? (
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Typing...
                      </p>
                    ) : (
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        {selectedDoctor?.specialization}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Video className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 hidden sm:flex"
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 hidden sm:flex"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area with Fixed Scroll */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-2">
              <div className="space-y-3 sm:space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === patientId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`relative max-w-[85%] sm:max-w-[70%] rounded-lg p-2 sm:p-3 ${
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
                        <p className="text-xs sm:text-sm break-words">
                          {msg.content}
                        </p>
                      ) : (
                        msg.image && (
                          <img
                            src={msg.image}
                            alt="sent image"
                            className="rounded-md max-w-[150px] sm:max-w-[200px]"
                          />
                        )
                      )}
                      <div className="flex items-center gap-1 mt-1 sm:mt-2">
                        <span className="text-xs opacity-70">
                          {msg?.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Fixed Input Area */}
            {currentConversation?.isActive ? (
              <div className="p-3 sm:p-4 border-t border-border bg-card flex-shrink-0">
                {selectedImage && (
                  <div className="mb-3 p-2 bg-accent/20 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <ImageIcon className="h-4 w-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm truncate">
                          {selectedImage.name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeSelectedImage}
                      >
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
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                    className="px-2 sm:px-3 h-9"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEmoji(!showEmoji)}
                    className="h-9"
                  >
                    😀
                  </Button>

                  {showEmoji && (
                    <div className="absolute bottom-16 right-4 sm:bottom-20 sm:right-10 z-50">
                      <EmojiPicker
                        onEmojiClick={(emojiObject: EmojiClickData) => {
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
                    className="flex-1 text-sm h-9"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() && !selectedImage}
                    size="sm"
                    className="h-9 px-3"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-3 sm:p-4 border-t border-border bg-card flex-shrink-0">
                <p className="text-center text-red-600 font-medium text-xs sm:text-sm">
                  You can&apos;t message with this doctor because you don&apos;t
                  have any active appointments
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-4">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden mb-4"
              onClick={() => setShowSidebar(true)}
            >
              <Menu className="h-4 w-4 mr-2" />
              Show Conversations
            </Button>
            <p className="text-sm sm:text-base text-center">
              Select a conversation to start messaging
            </p>
          </div>
        )}
      </div>
      <ToastContainer autoClose={2000} />
    </div>
  );
}