var numRingsDrawn = 2;

$(document).ready(function() {
    main();
})


function main() {
    canvas = document.getElementById('background');
    canvas.width = $(document).width();
    canvas.height = $(document).height();
    ctx = canvas.getContext('2d');
    radius = canvas.width / 6;
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    setImage("/static/img/dystopia/tulip.jpeg");
    animateCircles(radius, 1, 0, function() {
        drawCircle(ctx, canvas, "#FFF", radius, centerX, centerY);
        animateFullCircle(radius, centerX, centerY, function() {
            addImage(ctx, 0, function() {
                cutUp();
            }); //TEST IMAGE: REPLACE LATER

        });
    });


}

//animateLines(reqID, context, coordinates, width = 1, color = "black", opacity = 1, i = 0, callback = null)
function animateCircles(radius, width = 1, id = 0, callback = null) {
    var delay = 1750;
    animateLines(id, ctx, generateCircleCoordinates(100, radius, centerX, centerY), width, "white");
    width++;
    radius++;
    id++
    circleRequestID = requestAnimationFrame(function() {
        setTimeout(function() {
            animateCircles(radius, width, id, callback);
        }, delay);
    });
    if (width > numRingsDrawn) {
        cancelAnimationFrame(circleRequestID);
        if (callback) {
            setTimeout(function() {
                callback();
            }, delay);
        }
    }
}

function animateFullCircle(rad, cX, cY, callback) {
    drawCircle(ctx, canvas, "#FFF", radius, centerX, centerY); //white

    drawCircle(ctx, canvas, "#000", rad, cX, cY);
    setTimeout(function() {
        //console.log("redraw circle");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCircle(ctx, canvas, "#FFF", radius, centerX, centerY);

    }, 700);

    cY += 1;
    filledCircleRequestID = requestAnimationFrame(function() {
        animateFullCircle(rad, cX, cY, callback);
    });

    if (cY > canvas.height / 2 + 2 * radius) {
        cancelAnimationFrame(filledCircleRequestID);
        if (callback) {
            callback();
        }
    }

}

function drawCircle(ctx, canvas, color, radius, x, y, clearRect = false) {
    //console.log("Draw filled circle");
    if (clearRect) {
        ctx.clearRect(-50, -50, canvas.width, canvas.height);
    }
    // draw the circle
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();

    // color in the circle
    ctx.fillStyle = color;
    ctx.fill();
}

function generateCircleCoordinates(steps, radius, centerX, centerY) {
    var coords = [];
    for (var i = 0; i <= steps; i++) {
        var x = (centerX + radius * Math.cos(2 * Math.PI * i / steps));
        var y = (centerY + radius * Math.sin(2 * Math.PI * i / steps));
        coords[i] = [x, y];
    }
    return coords;
}
//context.arc(x,y,r,sAngle,eAngle,counterclockwise);
//context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
function setImage(imagePath) {
    base_image = new Image();
    base_image.src = imagePath;
}

function addImage(ctx, alpha = 0, callback = null) {
    console.log("Added image?");
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle(ctx, canvas, "#FFF", radius, centerX, centerY);
    ctx.globalAlpha = alpha;
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(base_image, centerX - radius, centerY - radius, radius * 2, radius * 2);
    alpha += 0.01;
    imageRequestId = requestAnimationFrame(function() {
        addImage(ctx, alpha, callback);
    });

    if (alpha > 1) {
        cancelAnimationFrame(imageRequestId);
        if (callback) {
            callback();
        }
    }
}
//animateLines(reqID, context, coordinates, width = 1, color = "black", opacity = 1, i = 0, callback = null) 
function cutUp() {
    canvas.getContext('2d'); //reset ctx
    var startEnd = { "start": [0, 0], "end": [500, 500] }
    animateLines(10, ctx, generateDiagonalCoordinates(startEnd), 1, "white",0.5);
}


/**
 * [generateDiagonalCoordinates description]
 * @param  {Object} startEnd {"start":[x,y],"end":[x1,y1]}
 * @return {[type]}          [description]
 */
function generateDiagonalCoordinates(startEnd, step = 1) {

    var start = startEnd["start"];
    var end = startEnd["end"];
    var newX = start[0];
    var newY = start[1];
    var coords = [start];
    if (end[0] > start[0]) {
        addX = step;
    } else {
        addX = -step;
    }
    if (end[1] > start[1]) {
        addY = step;
    } else {
        addY = -step;
    }
    while (newX != end[0] && newY != end[1]) {
        newX = newX + addX;
        newY = newY + addY;
        coords.push([newX, newY]);

    }
    console.log(coords);
    return coords;

}
