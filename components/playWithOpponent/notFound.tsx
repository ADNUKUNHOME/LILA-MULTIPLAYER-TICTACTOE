import { MotionDiv } from "@/lib/motion"
import AnimatedButton from "../common/animatedButton"

const OpponentNotFound = ({
    handleRetry,
    handleCancel,
}: {
    handleRetry: () => void
    handleCancel: () => void
}) => {
    return (
        <MotionDiv
            key="notfound"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-neutral-800 rounded-3xl p-10 w-full max-w-md shadow-xl flex flex-col items-center gap-6"
        >
            <h1 className="text-2xl font-bold text-center text-red-400">No Player Found 😕</h1>
            <p className="text-gray-300 text-center">Please try again later.</p>
            <div className="flex items-center justify-between mt-4 w-full gap-4">
                <AnimatedButton
                    buttonText="Retry"
                    handleButtonClick={handleRetry}
                />
                <AnimatedButton
                    buttonText="Cancel"
                    handleButtonClick={handleCancel}
                />
            </div>
        </MotionDiv>
    )
}

export default OpponentNotFound
