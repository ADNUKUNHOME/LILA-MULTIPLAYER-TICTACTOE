'use client';

import { AnimatePresence } from 'framer-motion'
import React from 'react'
import ConfettiPiece from './confettiPiece';
import FireworkBurst from './fireworkBurst';
import { Transition, EasingDefinition } from "framer-motion";
import { MotionDiv, MotionH2, MotionP } from '@/lib/motion';
import { Crown, Star } from 'lucide-react';

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
                    {/* Modern Glass Overlay */}
                    <MotionDiv
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-blue-900/15 to-purple-900/25 backdrop-blur-2xl"
                    />

                    {/* Subtle Grid Background */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
                    </div>

                    {/* Multi-layer Background Glow */}
                    <MotionDiv
                        variants={pulseGlowVariants}
                        className="absolute inset-0 bg-gradient-to-br from-green-400/30 via-blue-500/20 to-purple-600/30 rounded-full blur-3xl"
                    />

                    <MotionDiv
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 0.4 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="absolute inset-0 bg-gradient-to-tr from-yellow-400/40 to-pink-500/40 rounded-full blur-2xl"
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

                    {/* Main Win Content with Glass Effect */}
                    <div className="relative z-20 text-center space-y-6">
                        {/* Victory Text Container */}
                        <MotionDiv
                            variants={winTextVariants}
                            className="relative p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-2xl shadow-2xl"
                        >
                            {/* Ambient Glow Effect */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/10 via-yellow-500/10 to-orange-500/10 blur-xl" />

                            <MotionH2
                                className="text-6xl font-black bg-gradient-to-r from-green-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent mb-4 tracking-tight"
                                animate={{
                                    scale: [1, 1.02, 1],
                                    filter: ["brightness(1)", "brightness(1.4)", "brightness(1)"],
                                    textShadow: [
                                        "0 0 30px rgba(34, 197, 94, 0.6)",
                                        "0 0 50px rgba(34, 197, 94, 0.9)",
                                        "0 0 30px rgba(34, 197, 94, 0.6)"
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
                                className="text-xl text-white/90 font-light tracking-wide"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                Outstanding Play!
                            </MotionP>
                        </MotionDiv>

                        {/* Crown Icon with Glass Container */}
                        <MotionDiv
                            initial={{ scale: 0, rotate: -180, y: 50 }}
                            animate={{
                                scale: 1,
                                rotate: 0,
                                y: 0,
                            }}
                            whileHover={{
                                scale: 1.1,
                                rotate: [0, -5, 5, 0],
                                transition: { duration: 0.5 }
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 15,
                                delay: 0.4
                            }}
                            className="p-6 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-amber-400/10 border border-yellow-400/30 backdrop-blur-lg shadow-2xl"
                        >
                            <Crown
                                className="w-16 h-16 text-yellow-400"
                                fill="currentColor"
                                strokeWidth={1.5}
                            />
                        </MotionDiv>

                        {/* Optional: Animated Stars around the crown */}
                        <div className="relative">
                            {[...Array(3)].map((_, i) => (
                                <MotionDiv
                                    key={`star-${i}`}
                                    className="absolute"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                        scale: [0, 1, 0],
                                        opacity: [0, 1, 0],
                                        rotate: 360
                                    }}
                                    transition={{
                                        duration: 2,
                                        delay: 0.8 + i * 0.3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    style={{
                                        left: i === 0 ? '-50px' : i === 1 ? '50px' : '0px',
                                        top: i === 0 ? '-20px' : i === 1 ? '-20px' : '40px',
                                    }}
                                >
                                    <Star
                                        className="w-6 h-6 text-yellow-300"
                                        fill="currentColor"
                                        strokeWidth={1.5}
                                    />
                                </MotionDiv>
                            ))}
                        </div>

                        {/* Celebration Emojis */}
                        <MotionDiv
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="flex justify-center space-x-4 text-2xl"
                        >
                        </MotionDiv>
                    </div>

                    {/* Enhanced Floating Particles */}
                    {[...Array(20)].map((_, i) => (
                        <MotionDiv
                            key={`particle-${i}`}
                            className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full blur-sm"
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

                    {/* Additional Sparkle Particles */}
                    {[...Array(15)].map((_, i) => (
                        <MotionDiv
                            key={`sparkle-${i}`}
                            className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
                            initial={{
                                scale: 0,
                                opacity: 0,
                                x: Math.random() * 300 - 150,
                                y: Math.random() * 300 - 150
                            }}
                            animate={{
                                scale: [0, 1.5, 0],
                                opacity: [0, 1, 0],
                                rotate: [0, 180, 360]
                            }}
                            transition={{
                                duration: 2 + Math.random(),
                                delay: i * 0.15,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </MotionDiv>
            )}
        </AnimatePresence>
    )
}

export default WinAnimation