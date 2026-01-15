import { io,Socket } from "socket.io-client";


export const socket:Socket = io("https://careslot-j0bz.onrender.com", {
  withCredentials: true,
  transports: ["websocket"],
});
