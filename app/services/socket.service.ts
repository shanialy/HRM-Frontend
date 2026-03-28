import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private isConnected = false;
  private emitQueue: Array<{ event: string; data: any }> = [];
  private readyCallbacks: Array<() => void> = [];

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(token: string) {
    if (this.socket) return;

    this.socket = io("https://d15mne01ku2os0.cloudfront.net", {
      // "https://wst2pk24-7000.inc1.devtunnels.ms"
      auth: { token },
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      this.isConnected = true;

      // 🔥 Flush queued emits
      this.emitQueue.forEach(({ event, data }) => {
        this.socket?.emit(event, data);
      });
      this.emitQueue = [];

      // 🔥 Fire ready callbacks
      this.readyCallbacks.forEach((cb) => cb());
      this.readyCallbacks = [];
    });

    this.socket.on("disconnect", () => {
      this.isConnected = false;
    });

    this.socket.on("connect_error", (err) => {});
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.readyCallbacks = [];
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // 🔥 NEW: Wait until socket fully ready
  onReady(callback: () => void) {
    if (this.isConnected) {
      callback();
    } else {
      this.readyCallbacks.push(callback);
    }
  }

  emit(event: string, data: any) {
    if (!this.socket) return;

    if (this.isConnected) {
      this.socket.emit(event, data);
    } else {
      this.emitQueue.push({ event, data });
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback);
  }
}

export default SocketService.getInstance();
