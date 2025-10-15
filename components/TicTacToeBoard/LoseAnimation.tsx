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
                    {/* Dark Overlay */}
                    <MotionDiv
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Shattered Board Effect */}
                    <div className="absolute inset-0">
                        {board.map((_, index) => (
                            <MotionDiv
                                key={`fragment-${index}`}
                                className="absolute bg-gradient-to-br from-gray-800 to-gray-600 rounded-lg"
                                initial={{
                                    opacity: 0,
                                    scale: 1,
                                    rotate: 0,
                                    x: (index % 3 - 1) * 20,
                                    y: (Math.floor(index / 3) - 1) * 20
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 0,
                                    rotate: Math.random() * 360 - 180,
                                    x: (index % 3 - 1) * 200,
                                    y: (Math.floor(index / 3) - 1) * 200
                                }}
                                transition={{
                                    duration: 1.5,
                                    delay: index * 0.1,
                                    ease: "easeOut"
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

                    {/* Main Lose Text */}
                    <MotionDiv
                        variants={loseTextVariants}
                        className="relative z-10 text-center"
                    >
                        <MotionH2
                            className="text-5xl font-black bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-4"
                            animate={{
                                scale: [1, 1.05, 1],
                                x: [0, -3, 3, 0],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            DEFEAT
                        </MotionH2>
                        <MotionP
                            className="text-lg text-gray-200 font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            Better luck next time!
                        </MotionP>
                    </MotionDiv>

                    {/* Falling Symbols */}
                    {[...Array(15)].map((_, i) => (
                        <MotionDiv
                            key={`falling-${i}`}
                            custom={i}
                            variants={loseSymbolVariants}
                            className="absolute text-red-500/80"
                            style={{
                                left: `${Math.random() * 100}%`,
                            }}
                        >
                            {i % 2 === 0 ? (
                                <X className="w-8 h-8" />
                            ) : (
                                <Circle className="w-8 h-8" />
                            )}
                        </MotionDiv>
                    ))}
                </MotionDiv>
            )}
        </AnimatePresence>
    );
};

export default LoseAnimation;