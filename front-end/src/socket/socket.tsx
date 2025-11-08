import { io,Socket } from "socket.io-client";


export const socket:Socket = io("https://careslot.ddns.net", {
  withCredentials: true,
  transports: ["websocket"],
});
