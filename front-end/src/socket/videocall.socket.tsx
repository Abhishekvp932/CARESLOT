
import { io, Socket } from "socket.io-client";

export const socket: Socket = io("/video-call", {
  withCredentials: true,
  transports: ["websocket"],
});
