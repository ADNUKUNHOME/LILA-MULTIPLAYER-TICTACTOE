"use client";

import { MotionSpan } from "@/lib/motion";
import { useAnimation } from "framer-motion";
import { useState } from "react";


export default function AnimatedButton({
    buttonText,
    handleButtonClick,
    name,
}: {
    buttonText: string;
    handleButtonClick: () => void;
    name?: string;
}) {
    const controls = useAnimation();
    const [animating, setAnimating] = useState(false);
    const [textColor, setTextColor] = useState("text-white");

    return (
        <button
            onClick={async () => {
                if (buttonText === "Continue") {
                    if (!name || !name.trim() || name.trim().length < 3 || name.trim().length > 10) {
                        // Invalid input, do not run animation
                        handleButtonClick();
                        return;
                    }
                }

                if (animating) return;
                setAnimating(true);
                setTextColor("text-black");
                await controls.start({ x: 0, transition: { duration: 0.3 } });
                handleButtonClick();
            }}
            className="relative overflow-hidden border-none bg-orange-500 font-bold flex items-center justify-center group px-6 py-2 w-full"
        >
            {/* Hover effect (desktop) */}
            <span className="absolute inset-0 bg-gradient-to-l from-white to-white translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />

            {/* Tap animation (mobile) */}
            <MotionSpan
                initial={{ x: "100%" }}
                animate={controls}
                className="absolute inset-0 bg-white z-0"
            />

            {/* Text */}
            <span
                className={`relative z-10 flex items-center gap-0 md:gap-3 transition-colors duration-500 group-hover:text-black ${textColor}`}
            >
                {buttonText}
            </span>
        </button>
    );
}