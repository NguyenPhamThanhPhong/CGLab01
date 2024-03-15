var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var width = 800;
var height = 600;

canvas.setAttribute('width', width);
canvas.setAttribute('height', height);

function Painter(context, width, height) {
    this.context = context;
    this.imgData = context.createImageData(width, height);
    this.now = [-1, -1];
    this.width = width;
    this.height = height;
    var swap = function (a, b) {
        return b;
    };

    this.getPixelIndex = function (x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return -1;
        }
        return (x + y * this.width) << 2;
    };

    this.setPixel = function (x, y, rgba) {
        var index = this.getPixelIndex(x, y);
        if (index < 0) {
            return;
        }
        var data = this.imgData.data;
        for (var i = 0; i < 4; i++) {
            data[index + i] = rgba[i];
        }
        // code mẫu ko có dòng này, phải có nó mới vẽ ra. Set không trong for loop trên thì không có
        this.context.putImageData(this.imgData, 0, 0);
    };

    this.drawPoint = function (p, rgba) {
        var x = p[0];
        var y = p[1];
        this.setPixel(x, y, rgba);

        //có hay không for loop ở dưới thì nó vẫn vẽ point đó mà nhỉ?

        // for (var i = -1; i <= 1; i++) {
        //     for (var j = -1; j <= 1; j++) {
        //         this.setPixel(x + i, y + j, rgba);
        //     }
        // }
    };

    this.drawLine = function (p1, p2, rgba) {
        this.context.clearRect(0, 0, this.width, this.height);
        var x0 = p1[0], y0 = p1[1];
        var x1 = p2[0], y1 = p2[1];
        var dx = x1 - x0, dy = y1 - y0;
        if (dx == 0 && dy == 0) {
            this.drawPoint(p1, rgba);
            return;
        }
        //tăng trưởng chậm
        if (Math.abs(dy) <= Math.abs(dx)) {
            // giảm chậm phải swap
            if (x1 < x0) {
                x0, x1 = swap(x0, x1);
                y0,y1 = swap(y0, y1);
            }
            // tăng chậm
            var k = dy / dx;
            var y = y0;
            for (var x = x0; x <= x1; x++) {
                this.setPixel(x, Math.floor(y + 0.5), rgba);
                y = y + k;
            }
        } 
        // tăng trưởng nhanh
        else {
            if (y1 < y0) {
                var x0, x1 = swap(x0, x1);
                var y0, y1 = swap(y0, y1);
            }
            var k = dx / dy;
            var x = x0;
            for (var y = y0; y <= y1; y++) {
                this.setPixel(Math.floor(x + 0.5), y, rgba);
                x = x + k;
            }
        }
    };

    this.getPosOnCanvas = function (x, y) {
        var bbox = canvas.getBoundingClientRect();
        return [Math.floor((x - bbox.left) * (canvas.width / bbox.width) + 0.5),
        Math.floor((y - bbox.top) * (canvas.height / bbox.height) + 0.5)];
    };
}

let painter = new Painter(context, width, height);

var isDrawing = false;
var startPos = null;
var endPos = null;
var lineRgba = [255, 0, 0, 255];

canvas.addEventListener('mousedown', function (e) {
    e.preventDefault();
    isDrawing = true;
    startPos = painter.getPosOnCanvas(e.clientX, e.clientY);
});

canvas.addEventListener('mousemove', function (e) {
    e.preventDefault();
    if (isDrawing) {
        endPos = painter.getPosOnCanvas(e.clientX, e.clientY);
        painter.drawLine(startPos, endPos, lineRgba);
    }
});

canvas.addEventListener('mouseup', function (e) {
    e.preventDefault();
    isDrawing = false;
});
