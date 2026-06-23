import type { NitroApp } from "nitropack";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine();
  const io = new Server();

  io.bind(engine);

  const activeDevices = new Map();

  io.on("connection", (socket) => {
    console.log("Client connected");

    // ここで下記のように機能追加する
    socket.on("sample", (data) => {
      // 他のクライアントにブロードキャスト
      socket.broadcast.emit("sampleUpdate", data);
    }); // アクティブなデバイスのリセット

    socket.on("msg", (data) => {
      io.emit("message", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
      for (const [deviceId, device] of activeDevices.entries()) {
        if (device.socket === socket) {
          activeDevices.delete(deviceId);
          io.emit("deviceDisconnected", deviceId);
        }
      }
    });
  });

  // アクティブなデバイスの管理
  setInterval(() => {
    const now = Date.now();
    for (const [deviceId, device] of activeDevices.entries()) {
      if (now - device.lastUpdate > 10000) {
        // 10 seconds timeout
        activeDevices.delete(deviceId);
        io.emit("deviceDisconnected", deviceId);
      }
    }
  }, 5000);

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
