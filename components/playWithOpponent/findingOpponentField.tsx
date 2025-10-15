import { MotionDiv } from "@/lib/motion"

const FindingOpponentField = ({
    timer,
    handleCancel,
}: {
    timer: number
    handleCancel: () => void
}) => {
    return (
        <MotionDiv
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-neutral-800 rounded-3xl p-10 w-full max-w-md shadow-xl flex flex-col items-center gap-6"
        >
            <h1 className="text-2xl font-bold text-center">Finding a Random Player</h1>
            <p className="text-gray-300 text-center">
                It usually takes <span className="font-semibold">{timer}</span> seconds
            </p>

            {/* Loading Dots */}
            <div className="flex gap-2 mt-4">
                {[0, 1, 2].map((i) => (
                    <MotionDiv
                        key={i}
                        className="w-4 h-4 bg-orange-500 rounded-full"
                        animate={{
                            scale: [1, 1.6, 1],
                            opacity: [1, 0.5, 1],
                        }}
                        transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.2,
                        }}
                    />
                ))}
            </div>

            <button
                onClick={handleCancel}
                className="mt-6 px-6 py-2 border border-gray-600 rounded-2xl hover:bg-gray-700 transition"
            >
                Cancel
            </button>
        </MotionDiv>
    )
}

export default FindingOpponentField
