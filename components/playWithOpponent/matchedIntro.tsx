import { MotionDiv, MotionSpan } from "@/lib/motion"

const MatchedIntro = ({
    name,
    opponent,
    playerSymbol,
}: {
    name: string
    opponent: { name: string; symbol: "X" | "O" }
    playerSymbol: "X" | "O"
}) => {
    return (
        <MotionDiv
            key="matched"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-neutral-800 rounded-3xl p-10 w-full max-w-md shadow-xl flex flex-col items-center gap-6"
        >
            <h1 className="text-2xl font-bold text-center text-green-400">
                Match Found!
            </h1>

            {/* Player Avatars */}
            <div className="flex gap-8 items-center justify-center mt-4">
                {/* You */}
                <MotionDiv
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="flex flex-col items-center"
                >
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white text-xl shadow-lg">
                        {name[0].toUpperCase()}
                    </div>
                    <p className="text-sm mt-2">
                        {name} ({playerSymbol})
                    </p>
                </MotionDiv>

                {/* VS Text */}
                <MotionSpan
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-lg font-bold text-gray-300"
                >
                    VS
                </MotionSpan>

                {/* Opponent */}
                <MotionDiv
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="flex flex-col items-center"
                >
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white text-xl shadow-lg">
                        {opponent.name[0].toUpperCase()}
                    </div>
                    <p className="text-sm mt-2">
                        {opponent.name} ({opponent.symbol})
                    </p>
                </MotionDiv>
            </div>

            {/* Countdown before game starts */}
            <MotionDiv
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="text-gray-400 mt-6 text-center"
            >
                <p>Starting game in 5 seconds...</p>
                <MotionDiv
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="h-1 bg-orange-500 rounded-full mt-2 origin-left"
                />
            </MotionDiv>
        </MotionDiv>
    )
}

export default MatchedIntro
