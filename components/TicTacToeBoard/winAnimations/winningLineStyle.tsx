const GetWinningLineStyle = ({ winningLine }: { winningLine: number[] }) => {
    if (!winningLine) return {};
    const [a, b, c] = winningLine;
    if (a % 3 === 0 && b % 3 === 1 && c % 3 === 2) {
        const row = Math.floor(a / 3);
        return { top: `${row * 33.33 + 16.66}%`, left: "0", width: "100%", height: "4px", transformOrigin: "left center" };
    } else if (a % 3 === 0 && b % 3 === 3 && c % 3 === 6) {
        const col = a % 3;
        return { top: "0", left: `${col * 33.33 + 16.66}%`, width: "4px", height: "100%", transformOrigin: "top center" };
    } else if (winningLine.toString() === [0, 4, 8].toString()) {
        return { top: "0", left: "0", width: "100%", height: "4px", transformOrigin: "top left", rotate: "45deg", position: "absolute" };
    } else if (winningLine.toString() === [2, 4, 6].toString()) {
        return { top: "0", left: "0", width: "100%", height: "4px", transformOrigin: "top right", rotate: "-45deg", position: "absolute" };
    }
    return {};
};

export default GetWinningLineStyle;