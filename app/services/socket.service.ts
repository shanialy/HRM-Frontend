import { io, Socket } from "socket.io-client";

class SocketService {
    private socket: Socket | null = null;
    private static instance: SocketService;

    private constructor() { }

    static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    connect(token: string) {
        if (this.socket?.connected) return;

        this.socket = io("https://270gz0rm-8000.inc1.devtunnels.ms", {
            auth: { token },
            transports: ["websocket", "polling"],
        });

        this.socket.on("connect", () => {
            console.log("✅ Socket connected:", this.socket?.id);
        });

        this.socket.on("disconnect", () => {
            console.log("❌ Socket disconnected");
        });

        this.socket.on("error", (error: any) => {
            console.error("Socket error:", error);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getSocket(): Socket | null {
        return this.socket;
    }

    // Emit events
    emit(event: string, data: any) {
        this.socket?.emit(event, data);
    }

    // Listen to events
    on(event: string, callback: (...args: any[]) => void) {
        this.socket?.on(event, callback);
    }

    // Remove listener
    off(event: string, callback?: (...args: any[]) => void) {
        this.socket?.off(event, callback);
    }
}

export default SocketService.getInstance();
