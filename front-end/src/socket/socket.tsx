import { io,Socket } from "socket.io-client";


export const socket:Socket = io("https://www.careslot.site", {
  withCredentials: true,
  transports: ["websocket"],
});
