import { MotionDiv } from "@/lib/motion";
import { Variants } from "framer-motion";


const ConfettiPiece = ({ index }: { index: number }) => {
    const shapes = ['circle', 'rect', 'triangle', 'star'];
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#87CEEB', '#98FB98', '#FFA07A'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];


    const confettiVariants: Variants = {
        hidden: { opacity: 0, y: -20 },
        visible: (i: number) => ({
            opacity: [0, 1, 0],
            y: [0, -800],
            x: Math.random() * 600 - 300,
            rotate: Math.random() * 1080 - 540,
            scale: Math.random() * 0.6 + 0.4,
            transition: {
                duration: 2 + Math.random() * 1,
                delay: i * 0.015,
                ease: [0.16, 1, 0.3, 1]
            }
        })
    };


    return (
        <MotionDiv
            custom={index}
            variants={confettiVariants}
            initial="hidden"
            animate="visible"
            className={`absolute ${shape === 'circle' ? 'rounded-full' :
                shape === 'triangle' ? 'w-0 h-0 border-l-[6px] border-r-[6px] border-b-[12px] border-transparent' :
                    shape === 'star' ? 'star-shape' :
                        'rounded-sm'
                }`}
            style={{
                backgroundColor: shape !== 'triangle' && shape !== 'star' ? colors[Math.floor(Math.random() * colors.length)] : undefined,
                borderBottomColor: shape === 'triangle' ? colors[Math.floor(Math.random() * colors.length)] : undefined,
                width: shape === 'rect' ? '10px' : shape === 'circle' ? '8px' : shape === 'star' ? '12px' : undefined,
                height: shape === 'rect' ? '4px' : shape === 'circle' ? '8px' : shape === 'star' ? '12px' : undefined,
                filter: 'blur(0.5px)',
            }}
        >
            {shape === 'star' && (
                <div
                    className="w-full h-full"
                    style={{
                        background: `radial-gradient(circle at 30% 30%, ${colors[Math.floor(Math.random() * colors.length)]}, transparent)`,
                        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                    }}
                />
            )}
        </MotionDiv>
    );
};

export default ConfettiPiece;