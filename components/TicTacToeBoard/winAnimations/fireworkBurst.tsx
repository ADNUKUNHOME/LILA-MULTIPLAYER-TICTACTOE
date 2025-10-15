import { MotionDiv } from "@/lib/motion";

const FireworkBurst = ({ index }: { index: number }) => {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

    return (
        <MotionDiv
            className="absolute"
            initial={{
                scale: 0,
                opacity: 0,
                x: Math.random() * 400 - 200,
                y: Math.random() * 300 - 150
            }}
            animate={{
                scale: [0, 2, 0],
                opacity: [0, 0.8, 0],
            }}
            transition={{
                duration: 1.5,
                delay: index * 0.3,
                ease: "easeOut"
            }}
            style={{
                width: '80px',
                height: '80px',
                background: `radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]} 0%, transparent 70%)`,
                borderRadius: '50%',
                filter: 'blur(8px)',
            }}
        />
    );
};

export default FireworkBurst;