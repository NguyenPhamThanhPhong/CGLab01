var myrgba = [0, 0, 255, 255];
var imgData = ctx.createImageData(width, height);
function setPixel(x, y, r, g, b, a) {
    var imageData = ctx.createImageData(1, 1);
    var data = imageData.data;
    data[0] = r; // Red channel
    data[1] = g; // Green channel
    data[2] = b; // Blue channel
    data[3] = a; // Alpha channel
    ctx.putImageData(imageData, x, y);
}

function drawLine(x0, y0, x1, y1, r, g, b, a) {
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx - dy;

    while (true) {
        setPixel(x0, y0, r, g, b, a);

        if (x0 === x1 && y0 === y1) break;

        var e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
}

// Draw the line
drawLine(1, 1, 250, 250, 255, 0, 0, 255);