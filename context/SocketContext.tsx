"use client";

import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL!;

type SocketType = ReturnType<typeof io>;

interface SocketContextType {
    socket: SocketType | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<SocketType | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const newSocket = io(SERVER_URL, { transports: ["websocket"] });

        newSocket.on("connect", () => {
            setIsConnected(true);
            console.log("Connected to server");
        });

        newSocket.on("disconnect", () => {
            setIsConnected(false);
            console.log("Disconnected from server");
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);