import { MotionDiv } from "@/lib/motion";
import TicTacToeGrid from "../TicTacToeBoard/board";
import io from "socket.io-client";

type SocketType = ReturnType<typeof io>;

const GameField = ({
    name,
    opponent,
    playerSymbol,
    room,
    socketRef,
}: {
    name: string;
    opponent: { name: string; symbol: "X" | "O" };
    playerSymbol: "X" | "O";
    room: string;
    socketRef: React.MutableRefObject<SocketType | null>;
}) => {
    return (
        <MotionDiv
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6"
        >
            <div className="flex gap-4 items-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white">
                        {name[0].toUpperCase()}
                    </div>
                    <p className="text-sm mt-1">
                        {name} ({playerSymbol})
                    </p>
                </div>

                <span className="text-gray-300">VS</span>

                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white">
                        {opponent.name[0].toUpperCase()}
                    </div>
                    <p className="text-sm mt-1">
                        {opponent.name} ({opponent.symbol})
                    </p>
                </div>
            </div>

            <TicTacToeGrid
                socket={socketRef.current!}
                playerSymbol={playerSymbol}
                room={room}
            />
        </MotionDiv>
    );
};

export default GameField;
