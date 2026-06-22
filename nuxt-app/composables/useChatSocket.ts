import { io, type Socket } from "socket.io-client";
import type { ChatMessagePayload } from "~/types/chat";

let socket: Socket | null = null;

export function useChatSocket() {
  const connect = (): Socket | null => {
    if (import.meta.server) {
      return null;
    }

    if (!socket) {
      socket = io({
        path: "/socket.io/",
      });
    }

    return socket;
  };

  const joinRoom = (roomId: string): void => {
    connect()?.emit("chat:join", { roomId });
  };

  const leaveRoom = (roomId: string): void => {
    connect()?.emit("chat:leave", { roomId });
  };

  const sendMessage = (roomId: string, message: ChatMessagePayload): void => {
    connect()?.emit("chat:send", { roomId, message });
  };

  const onMessage = (handler: (message: ChatMessagePayload) => void): void => {
    const client = connect();
    if (!client) {
      return;
    }

    client.on("chat:message", handler);

    onScopeDispose(() => {
      client.off("chat:message", handler);
    });
  };

  const disconnect = (): void => {
    socket?.disconnect();
    socket = null;
  };

  return {
    connect,
    joinRoom,
    leaveRoom,
    sendMessage,
    onMessage,
    disconnect,
  };
}
