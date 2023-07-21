let canvas = document.querySelector('canvas');
let pencilColorCont = document.querySelector('.pencil-color-cont');
let pencilWidth = document.querySelector('.pencil-width');
let eraserWidth = document.querySelector('.eraser-width');
let downloadTool = document.querySelector('.download-tool');
let undoTool = document.querySelector('.undo-tool');
let redoTool = document.querySelector('.redo-tool');


canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let penColor = 'black';
let eraserColor = 'white';
let penWidth = pencilWidth.value;
let erWidth = eraserWidth.value;
let undoRedoTracker = [];
let track = 0;

let mousedown = false;
let tool = canvas.getContext('2d');

tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

canvas.addEventListener('mousedown', (e) => {
    mousedown = true;

    beginPath({
        x: e.clientX,
        y: e.clientY
    })
});

canvas.addEventListener('mousemove', (e) => {
    if (!mousedown) return;
    drawStroke({
        x: e.clientX,
        y: e.clientY,
        color: eraserFlag ? eraserColor : penColor,
        width: eraserFlag ? erWidth : penWidth
    })
});

canvas.addEventListener('mouseup', (e) => {
    mousedown = false;
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1;
})


pencilColors.forEach((colorElement) => {
    colorElement.addEventListener('click', (e) => {
        let color = e.target.classList[1];
        penColor = color;
        if (colorFlag[color]) {
            tool.strokeStyle = penColor;
        } else {
            tool.strokeStyle = 'transparent';
        }

    })
})

pencilWidth.addEventListener('change', (e) => {
    penWidth = pencilWidth.value;
    tool.lineWidth = penWidth;
})

eraserWidth.addEventListener('change', (e) => {
    erWidth = eraserWidth.value;
    tool.lineWidth = erWidth;
})

eraserTool.addEventListener('click', (e) => {
    if (eraserFlag) {
        tool.strokeStyle = eraserColor;
        tool.lineWidth = erWidth;
    } else {
        console.log(penColor)
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})

downloadTool.addEventListener('click', (e) => {
    let url = canvas.toDataURL();
    let a = document.createElement('a');
    a.href = url;
    a.download = 'board.png';
    a.click();
});

undoTool.addEventListener('click', (e) => {
    if (track <= 0) undoTool.style.cursor = 'not-allowed'
    if (track > 0) track--;
    let trackObj = {
        trackValue: track,
        undoRedoTracker
    }
    undoRedoCanvas(trackObj);
})

redoTool.addEventListener('click', (e) => {
    if (track >= undoRedoTracker.length - 1) redoTool.style.cursor = 'not-allowed'
    if (track < undoRedoTracker.length - 1) track++;

    let trackObj = {
        trackValue: track,
        undoRedoTracker
    }
    undoRedoCanvas(trackObj);
})

function beginPath(stokeObj) {
    tool.beginPath();
    tool.moveTo(stokeObj.x, stokeObj.y);
}

function drawStroke(stokeObj) {
    tool.strokeStyle = stokeObj.color;
    tool.lineWidth = stokeObj.width;
    tool.lineTo(stokeObj.x, stokeObj.y);
    tool.stroke();
}

function undoRedoCanvas(trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;
    let img = new Image();
    img.src = undoRedoTracker[track];
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}