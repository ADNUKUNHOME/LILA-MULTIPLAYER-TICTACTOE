import { MotionDiv, MotionH2 } from "@/lib/motion";

interface DrawAnimationProps {
    show: boolean;
}

const DrawAnimation = ({ show }: DrawAnimationProps) => {
    if (!show) return null;

    return (
        <MotionDiv
            key="draw"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-50"
        >
            <MotionH2
                initial={{ scale: 0 }}
                animate={{ scale: 1.5, rotate: 360 }}
                className="text-yellow-400 font-bold text-4xl"
            >
                Draw!
            </MotionH2>
        </MotionDiv>
    );
};

export default DrawAnimation;