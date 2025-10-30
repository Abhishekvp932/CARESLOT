import { useEffect } from "react";
import { toast } from "react-toastify";
import { socket } from "@/socket/socket";

type Props = {
  chatId: string;
  onMessageReceived?: (msg) => void;
};

export default function LiveMessage({ chatId, onMessageReceived }: Props) {
  useEffect(() => {
    if (!chatId) return;

    socket.emit("joinRoom", chatId);

    const handleMessage = (msg) => {
      console.log("user message received:", msg);
      toast.info(`New message: ${msg.content}`);
      onMessageReceived?.(msg);
    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, [chatId]);

  return null;
}
