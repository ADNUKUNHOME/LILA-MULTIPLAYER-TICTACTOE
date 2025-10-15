"use client";

import { MotionDiv, MotionFooter, MotionH2, MotionHeader, MotionP } from "@/lib/motion";
import { User, Users, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-neutral-950 text-white">
      {/* ===== Header with Lila Logo ===== */}
      <MotionHeader
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full bg-black flex flex-col items-center justify-center py-6 shadow-lg"
      >
        <img
          src="/lila-logo.png"
          alt="Lila Games Logo"
          className="w-32 md:w-40 object-contain"
        />
        <MotionH2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-lg md:text-xl font-semibold tracking-wide text-gray-300"
        >
          Tic Tac Toe
        </MotionH2>
      </MotionHeader>

      {/* ===== Main Content ===== */}
      <main className="flex flex-col items-center justify-center flex-grow px-6 py-8 text-center">
        <MotionP
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 mb-10 max-w-md text-base md:text-lg"
        >
          Challenge your friends, test your strategy, or play against an online opponent.
        </MotionP>

        {/* Game Mode Buttons */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-4 w-full max-w-xs"
        >
          <button
            onClick={() => router.push("/play/computer")}
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-2xl shadow-lg transition-all duration-200"
          >
            <User size={20} /> Play with Computer
          </button>

          <button
            onClick={() => router.push("/play/friend")}
            className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-2xl shadow-lg transition-all duration-200"
          >
            <Users size={20} /> Play with Friend (Same Device)
          </button>

          <button
            onClick={() => router.push("/play/opponent")}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-2xl shadow-lg transition-all duration-200"
          >
            <Globe size={20} /> Play with Opponent (Online)
          </button>
        </MotionDiv>
      </main>

      {/* ===== Footer ===== */}
      <MotionFooter
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full text-center text-gray-500 text-sm py-4 border-t border-gray-800"
      >
        © {new Date().getFullYear()} Lila Tic Tac Toe • Built by Muhammad Adnan K
      </MotionFooter>
    </div>
  );
}