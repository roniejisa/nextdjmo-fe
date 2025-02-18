export const drawHeart = (ctx, x, y, size) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(
        x - size / 2,
        y - size / 2,
        x - size,
        y + size / 2,
        x,
        y + size
    );
    ctx.bezierCurveTo(
        x + size,
        y + size / 2,
        x + size / 2,
        y - size / 2,
        x,
        y
    );
    ctx.fillStyle = "rgba(255, 0, 0, 1)";
    ctx.fill();
};