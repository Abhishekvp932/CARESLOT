// src/components/common/LiveNotifications.tsx
import { useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { socket } from "@/socket/socket";

type Props = {
  userId: string;
};

export default function LiveNotifications({ userId }: Props) {
  useEffect(() => {
    if (!userId) return;

   
    socket.emit("join", userId);
console.log("Doctor LiveNotifications userId:", userId);

//   const audio = new Audio('/sound/notification.mp3');
//   audio.play().catch((err)=> console.log('audio play was error',err));
    socket.on("notification", (notif) => {
        console.log('doctor notification',notif);
      toast.info(notif.title || "You have a new notification!", {
        position: "top-center",
        autoClose: 5000,
      });
    });


    return () => {
      socket.off("notification");
    };
  }, [userId]);

  return null; 
}
