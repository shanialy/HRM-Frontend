"use client";

import { useEffect } from "react";
import { useAppSelector } from "../redux/hooks";
import socketService from "@/app/services/socket.service";

export default function SocketProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const token = useAppSelector((state) => state.auth.token);

    useEffect(() => {
        if (token) {
            socketService.connect(token);
        }

        return () => {
            socketService.disconnect();
        };
    }, [token]);

    return <>{children}</>;
}
