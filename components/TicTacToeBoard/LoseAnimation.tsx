"use client";

import { MotionDiv, MotionH2, MotionP } from "@/lib/motion";
import { AnimatePresence, easeOut } from "framer-motion";
import type { Variants } from "framer-motion";
import { Circle, X } from "lucide-react";

const loseContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.5,
            staggerChildren: 0.05
        }
    }
};

const loseSymbolVariants = {
    hidden: {
        scale: 0,
        y: -100,
        opacity: 0,
        rotate: -180
    },
    visible: (i: number) => ({
        scale: [0, 1.2, 1],
        y: [0, 30, 0],
        opacity: 1,
        rotate: 0,
        transition: {
            duration: 0.8,
            delay: i * 0.1,
            ease: easeOut
        }
    })
};

const loseTextVariants: Variants = {
    hidden: {
        scale: 0,
        opacity: 0,
        y: 50
    },
    visible: {
        scale: 1,
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.3
        }
    }
};

interface LoseAnimationProps {
    show: boolean;
    board: Array<"X" | "O" | null>;
    winner: string | null;
    playerSymbol: string;
    showResult: boolean;
}

const LoseAnimation = ({
    show,
    board,
    winner,
    playerSymbol,
    showResult
}: LoseAnimationProps) => {
    if (!show) return null;

    return (
        <AnimatePresence>
            {winner && showResult && winner !== playerSymbol && winner !== "draw" && (
                <MotionDiv
                    key="lose-animation"
                    variants={loseContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="absolute inset-0 flex flex-col items-center justify-center z-50"
                >
                    {/* Modern Glass Overlay */}
                    <MotionDiv
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-background/90 to-gray-800/95 backdrop-blur-xl"
                    />

                    {/* Subtle Grid Background */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
                    </div>

                    {/* Modern Shattered Board Effect */}
                    <div className="absolute inset-0">
                        {board.map((_, index) => (
                            <MotionDiv
                                key={`fragment-${index}`}
                                className="absolute bg-gradient-to-br from-gray-700/80 to-gray-900/80 rounded-lg border border-white/10 shadow-2xl"
                                initial={{
                                    opacity: 1,
                                    scale: 1,
                                    rotate: 0,
                                    x: 0,
                                    y: 0
                                }}
                                animate={{
                                    opacity: [1, 0.8, 0],
                                    scale: [1, 1.1, 0],
                                    rotate: Math.random() * 120 - 60,
                                    x: (index % 3 - 1) * (100 + Math.random() * 50),
                                    y: (Math.floor(index / 3) - 1) * (100 + Math.random() * 50)
                                }}
                                transition={{
                                    duration: 1.2,
                                    delay: index * 0.08,
                                    ease: [0.4, 0, 0.2, 1]
                                }}
                                style={{
                                    width: 'calc(33.33% - 8px)',
                                    height: 'calc(33.33% - 8px)',
                                    left: `${(index % 3) * 33.33}%`,
                                    top: `${Math.floor(index / 3) * 33.33}%`,
                                }}
                            />
                        ))}
                    </div>

                    {/* Main Content Container */}
                    <div className="relative z-10">
                        {/* Modern Text Container with Glass Effect */}
                        <MotionDiv
                            variants={loseTextVariants}
                            className="relative text-center p-8 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/60 border border-white/10 backdrop-blur-2xl shadow-2xl mb-8"
                        >
                            {/* Ambient Glow */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/10 to-orange-500/10 blur-xl" />

                            <MotionH2
                                className="text-6xl font-black bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 bg-clip-text text-transparent mb-4 tracking-tight"
                                animate={{
                                    scale: [1, 1.02, 1],
                                    filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                DEFEAT
                            </MotionH2>
                            <MotionP
                                className="text-xl text-gray-300 font-light tracking-wide"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                Better luck next time!
                            </MotionP>
                        </MotionDiv>

                        {/* Modern Falling Symbols */}
                        <div className="relative">
                            {[...Array(12)].map((_, i) => (
                                <MotionDiv
                                    key={`falling-${i}`}
                                    custom={i}
                                    variants={loseSymbolVariants}
                                    className="absolute"
                                    style={{
                                        left: `${10 + Math.random() * 80}%`,
                                    }}
                                    animate={{
                                        y: [0, 400],
                                        opacity: [1, 0],
                                        rotate: [0, Math.random() * 360],
                                        scale: [1, 0.5]
                                    }}
                                    transition={{
                                        duration: 2 + Math.random(),
                                        delay: i * 0.2,
                                        repeat: Infinity,
                                        ease: "easeIn"
                                    }}
                                >
                                    {i % 2 === 0 ? (
                                        <X className="w-6 h-6 text-red-400/70 drop-shadow-lg" />
                                    ) : (
                                        <Circle className="w-6 h-6 text-orange-400/70 drop-shadow-lg" />
                                    )}
                                </MotionDiv>
                            ))}
                        </div>
                    </div>

                    {/* Floating Particles */}
                    <div className="absolute inset-0">
                        {[...Array(8)].map((_, i) => (
                            <MotionDiv
                                key={`particle-${i}`}
                                className="absolute w-1 h-1 bg-gradient-to-r from-red-400/50 to-orange-400/50 rounded-full"
                                initial={{
                                    scale: 0,
                                    x: Math.random() * 100,
                                    y: Math.random() * 100
                                }}
                                animate={{
                                    scale: [0, 1, 0],
                                    x: [0, (Math.random() - 0.5) * 100],
                                    y: [0, (Math.random() - 0.5) * 100]
                                }}
                                transition={{
                                    duration: 3,
                                    delay: i * 0.4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </div>
                </MotionDiv>
            )}
        </AnimatePresence>
    );
};

export default LoseAnimation;