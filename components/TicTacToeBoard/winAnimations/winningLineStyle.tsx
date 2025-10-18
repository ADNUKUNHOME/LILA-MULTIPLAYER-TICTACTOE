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
            transformOrigin: "left center"
        };
    }
    // Vertical lines
    else if (a >= 0 && a <= 2 && b >= 3 && b <= 5 && c >= 6 && c <= 8 && a % 3 === b % 3 && b % 3 === c % 3) {
        const col = a % 3;
        return {
            top: "0",
            left: `${col * 33.33 + 16.66}%`,
            width: "4px",
            height: "100%",
            transformOrigin: "top center"
        };
    }
    // Diagonal from top-left to bottom-right (0,4,8)
    else if (winningLine.toString() === [0, 4, 8].toString()) {
        return {
            top: "-2%",
            left: "-2%",
            width: "145%",
            height: "4px",
            transform: "rotate(45deg)",
            transformOrigin: "top left",
            position: "absolute"
        };
    }
    // Diagonal from top-right to bottom-left (2,4,6)
    else if (winningLine.toString() === [2, 4, 6].toString()) {
        return {
            top: "-2%",
            right: "-2%",
            width: "145%",
            height: "4px",
            transform: "rotate(-45deg)",
            transformOrigin: "top right",
            position: "absolute"
        };
    }
    return {};
};

export default GetWinningLineStyle;