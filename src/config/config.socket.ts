import { io, Socket } from "socket.io-client";


const socketUrl = process.env.REACT_APP_SOCKET_URL || "ws://localhost:3000/";
export const socket: Socket = io(socketUrl);


