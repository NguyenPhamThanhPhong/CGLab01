var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var width = 800;
var height = 600;

var bgRgba = [240, 240, 200, 255]
var pointRgba = [0, 0, 255, 255]
var lineRgba = [0, 0, 0, 255] 
var vlineRgba = [255, 0, 0, 255]

canvas.setAttribute('width', width);
canvas.setAttribute('height', height);

function Painter(context, width, height) {
    this.context = context;
    this.width = width;
    this.height = height;
    this.now = [-1,-1]
    this.width = width;
    this.height = height;
    var swap = function (a, b) {
        return [b, a];
    }

    this.getPixelIndex = function (x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return -1;
        }
        // the idea is k*4
        // k: numbers of pixel counting left to right, top to bot
        // k*4 => get the index (r,g,b,a) => muhahahahahah
        return (x+y*this.width) << 2;
    }
    //set RGBA at (x,y) using the index
    this.setPixel = function (x, y, rgba) {
        var index = this.getPixelIndex(x, y);
        if (index < 0) {
            return;
        }
        for (var i = 0; i < 4; i++) {
            this.context.data[index + i] = rgba[i];
        }
    }

    this.drawPoint = function (p/*point */, rgba) {
        var x = p[0];
        var y = p[1];
        for(var i =-1; i<=2;i++){
            for(var j=-1;j<=2;j++){
                this.setPixel(x+i, y+j, rgba);
            }
        }
    }

    this.drawLine = function (p1, p2, rgba) {
        var x0 = p1[0], y0 = p1[1];
        var x1 = p2[0], y1 = p2[1];
        var dx = x1 - x0, dy = y1 - y0;
        if(dx==0 && dy==0){
            this.drawPoint(p1, rgba);
            return;
        }
        // slight slope: chậm
        if(Math.abs(dy) <= Math.abs(dx)){
            // if decrease : giảm
            if(x1<x0){
                x0,x1=swap(x0,x1);
                y0,y1=swap(y0,y1);
            }
            var k = dy / dx;
            var y = y0;
            for (var x = x0; x <= x1; x++) {
                this.setPixel(x,Math.floor(y+0.5),rgba);
                y =y+k;
            }
        }
        // steep slope: dốc (nhanh)
        else{
            // if decrease : giảm
            if(y1<y0){
                x0,x1=swap(x0,x1);
                y0,y1=swap(y0,y1);
            }
            var k = dx / dy;
            var x = x0;
            for(var y = y0; y<=y1;y++){
                this.setPixel(Math.floor(x+0.5),y,rgba);
                x = x+k;
            }
        }
    }

    this.getPosOnCanvas = function (x,y) {
        var bbox = canvas.getBoundingClientRect();
        return [Math.floor( (x - bbox.left) * (canvas.width  / bbox.width)+0.5),
                Math.floor( (y - bbox.top ) * (canvas.height / bbox.height)+0.5)];
    }
}

var painter = new Painter(context, width, height);

var isDrawing = false;
var startPos = null;
var endPos = null;

canvas.addEventListener('mousedown', function (e) {
    isDrawing = true;
    startPos = painter.getPosOnCanvas(e.clientX, e.clientY);
});
