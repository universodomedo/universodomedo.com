import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL!;

const socket: Socket = io(SOCKET_URL, { withCredentials: true });

export const getSocket = () => socket;