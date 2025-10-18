"use client";

import { Toaster } from "react-hot-toast";

const CustomToaster = () => {
    return (
        <Toaster
            position="top-center"
            toastOptions={{
                style: {
                    background: "#1e293b", // slate-800
                    color: "white",
                    border: "1px solid #334155", // slate-700
                    fontSize: "0.95rem",
                    fontWeight: 500,
                },
                success: {
                    iconTheme: {
                        primary: "#10b981", // emerald-500
                        secondary: "white",
                    },
                },
                error: {
                    iconTheme: {
                        primary: "#ef4444", // red-500
                        secondary: "white",
                    },
                },
                loading: {
                    iconTheme: {
                        primary: "#8b5cf6", // violet-500
                        secondary: "white",
                    },
                },
            }}
        />
    );
};

export default CustomToaster;
