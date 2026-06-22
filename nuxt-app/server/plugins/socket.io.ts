import type { NitroApp } from "nitropack";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";
import type {
  ChatJoinPayload,
  ChatMessagePayload,
  ChatSendPayload,
} from "~/types/chat";

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine();
  const io = new Server({
    cors: {
      origin: true,
    },
  });

  io.bind(engine);

  io.on("connection", (socket) => {
    socket.on("chat:join", ({ roomId }: ChatJoinPayload) => {
      if (!roomId) {
        return;
      }

      socket.join(roomId);
    });

    socket.on("chat:leave", ({ roomId }: ChatJoinPayload) => {
      if (!roomId) {
        return;
      }

      socket.leave(roomId);
    });

    socket.on("chat:send", ({ roomId, message }: ChatSendPayload) => {
      if (!roomId || !message?.id || !message.message) {
        return;
      }

      const payload: ChatMessagePayload = {
        id: message.id,
        message: message.message,
        name: message.name ?? "",
        photoUrl: message.photoUrl ?? "",
        createdAt: message.createdAt,
      };

      socket.to(roomId).emit("chat:message", payload);
    });
  });

  nitroApp.router.use(
    "/socket.io/",
    defineEventHandler({
      handler(event) {
        engine.handleRequest(event.node.req, event.node.res);
        event._handled = true;
      },
      websocket: {
        open(peer) {
          // @ts-expect-error Nitro private API
          engine.prepare(peer._internal.nodeReq);
          // @ts-expect-error Nitro private API
          engine.onWebSocket(
            peer._internal.nodeReq,
            peer._internal.nodeReq.socket,
            peer.websocket,
          );
        },
      },
    }),
  );
});
