import { MotionDiv } from "@/lib/motion"
import AnimatedButton from "../common/animatedButton";

const NameInputField = ({
    name,
    setName,
    warning,
    handleContinue,
}: {
    name: string;
    setName: (name: string) => void;
    warning: string;
    handleContinue: () => void;
}) => {
    return (
        <MotionDiv
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-neutral-800 rounded-3xl p-10 w-full max-w-md shadow-xl flex flex-col gap-4 items-center"
        >
            <h1 className="text-2xl font-bold text-center">Enter Your Name</h1>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nickname..."
                className="w-full px-4 py-3 rounded-xl text-white border border-orange-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {warning && <p className="text-red-500 text-sm font-medium">{warning}</p>}
            <AnimatedButton
                buttonText="Continue"
                handleButtonClick={handleContinue}
                name={name}
            />
        </MotionDiv>
    )
}

export default NameInputField
