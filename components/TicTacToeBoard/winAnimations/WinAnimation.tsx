import { AnimatePresence } from 'framer-motion'
import React from 'react'
import ConfettiPiece from './confettiPiece';
import FireworkBurst from './fireworkBurst';
import { Transition, EasingDefinition } from "framer-motion";
import { MotionDiv, MotionH2, MotionP } from '@/lib/motion';

const customEase: EasingDefinition = [0.45, 0, 0.55, 1];


const WinAnimation = ({
    winner,
    playerSymbol,
    showResult
}: {
    winner: string | null;
    playerSymbol: string;
    showResult: boolean;
}) => {


    const springTransition: Transition = {
        type: "spring",
        stiffness: 120,
        damping: 12,
        mass: 0.8,
    };


    const pulseGlowVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1.3,
            opacity: [0.2, 0.6, 0.2],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: customEase,
            },
        },
    };


    const winTextVariants = {
        hidden: {
            scale: 0,
            y: 60,
            opacity: 0
        },
        visible: {
            scale: 1,
            y: 0,
            opacity: 1,
            transition: springTransition
        }
    };

    const winContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.08
            }
        }
    };

    const shouldShow = winner && showResult && winner === playerSymbol;

    return (
        <AnimatePresence>
            {shouldShow && (
                <MotionDiv
                    key="win-animation"
                    variants={winContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="absolute inset-0 flex flex-col items-center justify-center z-50"
                >
                    {/* Multi-layer Background Glow */}
                    <MotionDiv
                        variants={pulseGlowVariants}
                        className="absolute inset-0 bg-gradient-to-br from-green-400/30 via-blue-500/20 to-purple-600/30 rounded-full blur-2xl"
                    />

                    <MotionDiv
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 0.4 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="absolute inset-0 bg-gradient-to-tr from-yellow-400/40 to-pink-500/40 rounded-full blur-xl"
                    />

                    {/* Enhanced Confetti Overlay */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(120)].map((_, i) => (
                            <ConfettiPiece key={i} index={i} />
                        ))}
                    </div>

                    {/* Firework Bursts */}
                    <div className="absolute inset-0">
                        {[...Array(5)].map((_, i) => (
                            <FireworkBurst key={i} index={i} />
                        ))}
                    </div>

                    {/* Main Win Content */}
                    <div className="relative z-20 text-center space-y-6">
                        {/* Victory Text */}
                        <MotionDiv
                            variants={winTextVariants}
                            className="relative"
                        >
                            <MotionH2
                                className="text-5xl font-black bg-gradient-to-r from-green-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2"
                                animate={{
                                    scale: [1, 1.05, 1],
                                    textShadow: [
                                        "0 0 20px rgba(34, 197, 94, 0.5)",
                                        "0 0 30px rgba(34, 197, 94, 0.8)",
                                        "0 0 20px rgba(34, 197, 94, 0.5)"
                                    ],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                VICTORY!
                            </MotionH2>

                            {/* Subtitle */}
                            <MotionP
                                className="text-lg text-white/90 font-semibold"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                Outstanding Play! 🏆
                            </MotionP>
                        </MotionDiv>

                        {/* Trophy Icon */}
                        <MotionDiv
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 15,
                                delay: 0.4
                            }}
                            className="text-6xl"
                        >
                            🏆
                        </MotionDiv>

                        {/* Celebration Emojis */}
                        <MotionDiv
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="flex justify-center space-x-4 text-2xl"
                        >
                        </MotionDiv>
                    </div>

                    {/* Floating Particles */}
                    {[...Array(25)].map((_, i) => (
                        <MotionDiv
                            key={`particle-${i}`}
                            className="absolute w-2 h-2 bg-yellow-400 rounded-full blur-sm"
                            initial={{
                                scale: 0,
                                opacity: 0,
                                x: Math.random() * 400 - 200,
                                y: Math.random() * 400 - 200
                            }}
                            animate={{
                                scale: [0, 1, 0],
                                opacity: [0, 0.8, 0],
                                y: [0, -100, -200],
                                x: [0, Math.random() * 100 - 50, Math.random() * 200 - 100]
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                delay: i * 0.1,
                                repeat: Infinity,
                                ease: "easeOut"
                            }}
                        />
                    ))}
                </MotionDiv>
            )}
        </AnimatePresence>
    )
}

export default WinAnimation

