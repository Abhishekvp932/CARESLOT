"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGetDoctorChatQuery,
  useSendMessageMutation,
  useGetDoctorMessagesQuery,
} from "@/features/chat/chatApi";
import { DoctorSidebar } from "@/layout/doctor/sideBar";
import { socket } from "@/socket/socket";
import { useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
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
  Calendar,
  Stethoscope,
  ImageIcon,
  MoreVertical,
} from "lucide-react";

// Message interface
interface Message {
  id: string;
  chatId: string;
  content: string;
  sender: string;
  timestamp: string;
  type: "text" | "image";
  image?: string;
  read: boolean;
}

// API Message interface (from backend)
interface ApiMessage {
  _id: string;
  chatId: string;
  content: string;
  sender: string;
  createdAt?: string;
  type?: "text" | "image";
  image?: string;
}

// Patient interface
interface Patient {
  _id: string;
  profile_img: string;
  name: string;
}

// Conversation interface
interface IConversation {
  _id: string;
  lastMessage?: {
    content: string;
    timestamp: Date;
    sender?: string;
  };
  isActive: boolean;
  patiendId?: Patient;
  unreadCount: number;
}

// Online users type
type OnlineUsers = Record<string, { socketId: string; role: string }>;

// Socket event types
interface SocketTypingEvent {
  chatId: string;
  sender: string;
}

interface SocketUpdateConversation {
  chatId: string;
  lastMessage: {
    content: string;
    timestamp: Date;
    sender: string;
  };
  unreadIncrement: number;
}

interface SocketMessagesRead {
  chatId: string;
}

export function DoctorMessagingPage() {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversationss, setConversation] = useState<IConversation[]>([]);
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>(undefined);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUsers>({});
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const doctorId = doctor?._id as string;

  const { data: conversations = [], refetch: chatRefetch } = useGetDoctorChatQuery(
    { doctorId },
    { skip: !doctorId }
  );

  const { data: messagess = [], refetch } = useGetDoctorMessagesQuery(
    selectedConversation,
    { skip: !selectedConversation }
  );

  const [sendMessage] = useSendMessageMutation();

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update conversations from API
  useEffect(() => {
    if (!Array.isArray(conversations)) return;

    setConversation((prev) => {
      const newData = conversations.map((c: IConversation) => ({
        _id: c._id,
        lastMessage: c.lastMessage,
        isActive: c.isActive,
        patiendId: c.patiendId,
        unreadCount: c.unreadCount,
      }));

      const isSame =
        prev.length === newData.length &&
        prev.every((p, i) => p._id === newData[i]._id);

      return isSame ? prev : newData;
    });
  }, [conversations]);

  // Refetch messages when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      refetch();
    }
  }, [selectedConversation, refetch]);

  // Refetch chats when doctor ID changes
  useEffect(() => {
    if (doctorId) {
      chatRefetch();
    }
  }, [doctorId, chatRefetch]);

  // Join all conversation rooms
  useEffect(() => {
    conversationss.forEach((chat) => socket.emit("joinRoom", chat._id));
  }, [conversationss]);

  // Handle receiving messages
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

  // Reset messages when conversation changes
  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }
    refetch();
  }, [selectedConversation, refetch]);

  // Update messages from API
  useEffect(() => {
    if (selectedConversation) {
      setMessages((prev) => {
        const newMessages = messagess.map((m: ApiMessage) => ({
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
          read: false,
        }));

        const isSame =
          prev.length === newMessages.length &&
          prev.every((p, i) => p.id === newMessages[i].id);

        return isSame ? prev : newMessages;
      });
    }
  }, [messagess, selectedConversation]);

  // Handle typing events
  useEffect(() => {
    const handleTypingEvent = (data: SocketTypingEvent) => {
      if (data.chatId === selectedConversation && data.sender !== doctorId) {
        setIsTyping(true);
      }
    };

    const handleStopTypingEvent = (data: SocketTypingEvent) => {
      if (data.chatId === selectedConversation && data.sender !== doctorId) {
        setIsTyping(false);
      }
    };

    socket.on("typing", handleTypingEvent);
    socket.on("stopTyping", handleStopTypingEvent);

    return () => {
      socket.off("typing", handleTypingEvent);
      socket.off("stopTyping", handleStopTypingEvent);
    };
  }, [selectedConversation, doctorId]);

  // Handle online users
  useEffect(() => {
    if (!doctorId) return;

    socket.emit("addUser", { userId: doctorId, role: "doctor" });

    const handleOnlineUsers = (users: OnlineUsers) => {
      setOnlineUsers(users);
    };

    socket.on("onlineUsers", handleOnlineUsers);

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, [doctorId]);

  // Handle message deletion
  useEffect(() => {
    const handleMessageDeleted = (deletedMessageId: string) => {
      setMessages((prev) => prev.filter((msg) => msg?.id !== deletedMessageId));
    };

    socket.on("messageDeleted", handleMessageDeleted);

    return () => {
      socket.off("messageDeleted");
    };
  }, []);

  // Handle messages read event
  useEffect(() => {
    const handleMessagesRead = ({ chatId }: SocketMessagesRead) => {
      setConversation((prev) =>
        prev.map((c) => (c._id === chatId ? { ...c, unreadCount: 0 } : c))
      );
    };

    socket.on("messagesRead", handleMessagesRead);

    return () => {
      socket.off("messagesRead");
    };
  }, []);

  // Handle conversation updates
  useEffect(() => {
    const handleUpdateConversation = ({
      chatId,
      lastMessage,
      unreadIncrement,
    }: SocketUpdateConversation) => {
      setConversation((prev) =>
        prev.map((c) =>
          c._id === chatId
            ? {
                ...c,
                lastMessage,
                unreadCount:
                  lastMessage.sender !== doctorId
                    ? (c.unreadCount || 0) + unreadIncrement
                    : c.unreadCount,
              }
            : c
        )
      );
    };

    socket.on("updateConversation", handleUpdateConversation);

    return () => {
      socket.off("updateConversation");
    };
  }, [doctorId]);

  // Handle send message
  const handleSendMessage = async (): Promise<void> => {
    if (!selectedConversation || (!message.trim() && !selectedImage)) return;

    const formData = new FormData();
    formData.append("chatId", selectedConversation);
    formData.append("sender", doctorId);

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

  // Handle image selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
    }
  };

  // Handle typing indicator
  const handleTyping = (): void => {
    socket.emit("typing", { chatId: selectedConversation, sender: doctorId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        chatId: selectedConversation,
        sender: doctorId,
      });
    }, 2000);
  };

  // Handle message deletion
  const handleMessageDelete = async (messageId: string, chatId: string): Promise<void> => {
    socket.emit("deleteMessage", { messageId, chatId });
    chatRefetch();
    refetch();
  };

  // Handle conversation click
  const handleConversationClick = (conversation: IConversation): void => {
    setSelectedConversation(conversation?._id);

    socket.emit("markAsRead", {
      chatId: conversation._id,
      userId: doctorId,
    });
  };

  // Remove selected image
  const removeSelectedImage = (): void => {
    setSelectedImage(null);
  };

  // Handle emoji selection
  const handleEmojiClick = (emojiObject: EmojiClickData): void => {
    setMessage((prev) => prev + emojiObject.emoji);
    setShowEmoji(false);
  };

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <DoctorSidebar />

      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border flex-shrink-0">
          <h1 className="text-xl font-semibold">Messages</h1>
          <p className="text-sm text-muted-foreground">
            Your healthcare conversations
          </p>
        </div>

        <ScrollArea className="flex-1">
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
                  onlineUsers[conversation.patiendId?._id || ""]?.role === "patient";

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
                      setSelectedPatient(conversation?.patiendId);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 relative">
                        <AvatarImage
                          src={
                            conversation?.patiendId?.profile_img ||
                            "/placeholder.svg"
                          }
                          alt={conversation?.patiendId?.name || "Patient"}
                        />
                        <AvatarFallback>
                          <Stethoscope className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium truncate">
                            {conversation?.patiendId?.name}
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
                        </div>
                        <p className="text-sm truncate text-muted-foreground">
                          {conversation?.lastMessage?.content}
                          <span className="text-xs text-muted-foreground ml-1">
                            {conversation?.lastMessage?.timestamp
                              ? new Date(
                                  conversation.lastMessage.timestamp
                                ).toLocaleTimeString()
                              : ""}
                          </span>
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedPatient ? (
          <div className="p-4 border-b border-border bg-card flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={selectedPatient?.profile_img}
                    alt={selectedPatient?.name}
                  />
                  <AvatarFallback>
                    <Stethoscope className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{selectedPatient?.name}</h2>
                  {isTyping && (
                    <p className="text-sm text-muted-foreground">Typing...</p>
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
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a conversation to start messaging</p>
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-4 py-2">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === doctorId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`relative max-w-[70%] rounded-lg p-3 ${
                      msg.sender === doctorId
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border"
                    }`}
                  >
                    {msg.sender === doctorId && (
                      <div className="absolute bottom-1 right-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="text-xs opacity-70 hover:opacity-100"
                              type="button"
                            >
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
                          alt="Sent content"
                          className="rounded-md max-w-[200px]"
                        />
                      )
                    )}

                    <div className="flex items-center gap-1 mt-2 text-[10px] opacity-70">
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

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
              type="button"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowEmoji(!showEmoji)}
              type="button"
            >
              😀
            </Button>

            {showEmoji && (
              <div className="absolute bottom-14 right-10 z-50">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}

            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() && !selectedImage}
              type="button"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}