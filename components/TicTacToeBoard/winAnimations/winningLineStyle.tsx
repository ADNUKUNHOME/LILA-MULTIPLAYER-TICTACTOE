const GetWinningLineStyle = ({ winningLine }: { winningLine: number[] }) => {
    if (!winningLine) return {};
    const [a, b, c] = winningLine;

    // Horizontal lines
    if (a % 3 === 0 && b % 3 === 1 && c % 3 === 2) {
        const row = Math.floor(a / 3);
        return {
            top: `${row * 33.33 + 16.66}%`,
            left: "0",
            width: "100%",
            height: "4px",
            transformOrigin: "left center",
        };
    }
    // Vertical lines
    else if (a % 3 === b % 3 && b % 3 === c % 3) {
        const col = a % 3;
        return {
            top: "0",
            left: `${col * 33.33 + 16.66}%`,
            width: "4px",
            height: "100%",
            transformOrigin: "top center",
        };
    }
    // Diagonal from top-left to bottom-right (0,4,8)
    else if (winningLine.toString() === [0, 4, 8].toString()) {
        return {
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "140%",
            height: "4px",
            backgroundColor: "yellow",
            transform: "translate(-50%, -50%) rotate(45deg)",
            transformOrigin: "center",
        };
    }
    // Diagonal from top-right to bottom-left (2,4,6)
    else if (winningLine.toString() === [2, 4, 6].toString()) {
        return {
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "140%",
            height: "4px",
            backgroundColor: "yellow",
            transform: "translate(-50%, -50%) rotate(-45deg)",
            transformOrigin: "center",
        };
    }

    return {};
};


export default GetWinningLineStyle;