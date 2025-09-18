"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef } from "react";
import {
  useGetDoctorChatQuery,
  useSendMessageMutation,
} from "@/features/chat/chatApi";
import { DoctorSidebar } from "@/layout/doctor/sideBar";
import { socket } from "@/socket/socket";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

import EmojiPicker from "emoji-picker-react";


import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useDeleteMessageMutation } from "@/features/chat/chatApi";
import { useGetDoctorMessagesQuery } from "@/features/chat/chatApi";
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
}

export function DoctorMessagingPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [showEmoji,setShowEmoji] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
 
  const doctor = useSelector((state: RootState) => state.doctor.doctor);
  const doctorId = doctor?._id as string;
 const [deleteMessage] = useDeleteMessageMutation();
  const { data = [], refetch: chatRefetch } = useGetDoctorChatQuery({
    doctorId,
  });

  const { data: messagess = [], refetch } = useGetDoctorMessagesQuery(
    selectedConversation,
    {
      skip: !selectedConversation,
    }
  );


  const conversations = Array.isArray(data) ? data : [];

  const [sendMessage] = useSendMessageMutation();

  useEffect(() => {
    chatRefetch();
    if (selectedConversation) {
      refetch();
    }
  }, [selectedConversation, refetch]);

  useEffect(() => {
    conversations.forEach((chat) => socket.emit("joinRoom", chat._id));
  }, [conversations]);

  useEffect(() => {
    const handleReceiveMessage = (msg: Message) => {
      if (msg.chatId === selectedConversation) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage)
    };
  }, [selectedConversation]);

  const handleSendMessage = async () => {
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

    // for (let [key, value] of formData.entries()) {
    //   console.log("key values", key, value);
    // }

    setMessage("");
    setSelectedImage(null);

    try {
      chatRefetch();
      const res = await sendMessage(formData).unwrap();
      console.log("Message sent:", res);
      socket.emit("sendMessage", res);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }

    setMessages([]);
    refetch();
  }, [selectedConversation, refetch]);

  useEffect(() => {
    if (selectedConversation) {
      setMessages((prev) => {
        const newMessages = messagess.map((m) => ({
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
    }
  }, [messagess, selectedConversation]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) setSelectedImage(file);
  };

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = () => {
    socket.emit("typing", { chatId: selectedConversation, sender: doctorId });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        chatId: selectedConversation,
        sender: doctorId,
      });
    }, 2000);
  };


  useEffect(() => {
  const handleTypingEvent = (data: { chatId: string; sender: string }) => {
    if (data.chatId === selectedConversation && data.sender !== doctorId) {
      setIsTyping(true);
    }
  };

  const handleStopTypingEvent = (data: { chatId: string; sender: string }) => {
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




useEffect(() => {
  if (!doctorId) return;

  
  socket.emit("addUser", { userId: doctorId, role: "doctor" });

  const handleOnlineUsers = (users: Record<string, { socketId: string, role: string }>) => {
    setOnlineUsers(users);
  };

 
  socket.on("onlineUsers", handleOnlineUsers);

  return () => {
    socket.off("onlineUsers", handleOnlineUsers);
  };
}, [doctorId]);


const handleMessageDelete = async(messageId:string,chatId:string)=>{
  socket.emit("deleteMessage", { messageId, chatId });

    //  try {
    //     const res = await deleteMessage(messageId).unwrap();
         chatRefetch();
        refetch();
    //     console.log(res);
    //  } catch (error) {
    //   console.log(error);
    //  }
}

useEffect(() => {
  socket.on("messageDeleted", (deletedMessageId: string) => {
    setMessages((prev) => prev.filter(msg => msg?.id !== deletedMessageId));
  });

  return () => {
    socket.off("messageDeleted");
  };
}, []);

  const removeSelectedImage = () => setSelectedImage(null);

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
            {[...conversations]
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
                  onlineUsers[conversation.patiendId?._id]?.role === "patient";

                return (
                  <Card
                    key={conversation._id}
                    className={`p-3 mb-2 cursor-pointer transition-colors hover:bg-accent/20 ${
                      selectedConversation === conversation._id
                        ? "bg-accent/30 border-primary/20"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedConversation(conversation._id);
                      setSelectedPatient(conversation.patiendId);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 relative">
                        <AvatarImage
                          src={
                            conversation?.patiendId?.profile_img ||
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
                            {conversation?.patiendId?.name}
                          </h3>

                                                
                             {isOnline && (
                          <span className="bg-green-500 text-white border border-white">online</span>
                        )}

                          {conversation?.unread > 0 && (
                            <div className="ml-2 h-5 w-5 flex items-center justify-center text-xs rounded-full bg-red-600 text-white">
                              {conversation.unread}
                            </div>
                          )}
                        </div>
                        <p className="text-sm truncate">
                         
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
                <AvatarImage src={selectedPatient?.profile_img} />
                <AvatarFallback>
                  <Stethoscope className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{selectedPatient?.name}</h2>
                {isTyping && (
                  <div>
                    <p>Typing...</p>
                  </div>
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
          ):(
            <div>

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
                            <button className="text-xs opacity-70 hover:opacity-100">
                              ▼
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            side="top"
                            className="w-32"
                          >
                            <DropdownMenuItem className="text-red-600" onClick={()=> handleMessageDelete(msg?.id,msg?.chatId)}>
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
                          alt="sent"
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
            >
              <ImageIcon className="h-4 w-4" />
            </Button>


             <Button variant="outline" onClick={() => setShowEmoji(!showEmoji)}>
        😀
      </Button>

      {/* Emoji Picker */}
      {showEmoji && (
        <div className="absolute bottom-14 right-10 z-50">
          <EmojiPicker
            onEmojiClick={(emojiObject) =>
            {
              setMessage((prev) => prev + emojiObject.emoji);
               setShowEmoji(false);
            }
            }
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
