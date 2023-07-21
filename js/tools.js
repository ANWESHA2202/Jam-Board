let toolsCont = document.querySelector('.tools-cont');
let pencilToolCont = document.querySelector('.pencil-tool-cont');
let eraserToolCont = document.querySelector('.eraser-tool-cont');
let optionsCont = document.querySelector('.options-cont');
let pencilTool = document.querySelector('.pencil-tool');
let eraserTool = document.querySelector('.eraser-tool');
let stickyTool = document.querySelector('.sticky-note-tool');
let uploadTool = document.querySelector('.upload-tool');
let pencilColors = document.querySelectorAll('.pencil-color');
let activeTool = document.querySelector('.active-tool');


let optionsFlag = true;
let pencilFlag = false;
let eraserFlag = false;
let colorFlag = {
    black: true,
    blue: false,
    red: false,
    green: false,
    yellow: false,
    orange: false,
    purple: false,
    pink: false,
}
pencilColors[0].style.border = '3px solid white'


optionsCont.addEventListener('click', (e) => {
    optionsFlag = !optionsFlag;
    let iconEle = optionsCont.children[0];

    if (optionsFlag) openTools(iconEle);
    else closeTools(iconEle);
})

function openTools(iconEle) {
    iconEle.classList.remove('fa-square-xmark')
    iconEle.classList.add('fa-bars')
    iconEle.classList.add('fa-beat')
    toolsCont.classList.add('hide-tools')
    pencilToolCont.style.display = 'none';
    eraserToolCont.style.display = 'none';
}

function closeTools(iconEle) {
    iconEle.classList.remove('fa-bars')
    iconEle.classList.remove('fa-beat')
    toolsCont.classList.remove('hide-tools')
    iconEle.classList.add('fa-square-xmark')
    toolsCont.style.display = 'flex';

}

pencilTool.addEventListener('click', (e) => {
    pencilFlag = !pencilFlag;
    if (pencilFlag) {
        eraserFlag = false;
        eraserTool.classList.remove('active-tool');
        pencilTool.classList.add('active-tool');
        eraserToolCont.style.display = 'none';
        pencilToolCont.style.display = 'block';
    } else {
        pencilTool.classList.remove('active-tool');
        pencilToolCont.style.display = 'none';
    }
})

eraserTool.addEventListener('click', (e) => {
    eraserFlag = !eraserFlag;
    if (eraserFlag) {
        pencilFlag = false;
        pencilTool.classList.remove('active-tool');
        eraserTool.classList.add('active-tool');
        pencilToolCont.style.display = 'none';
        eraserToolCont.style.display = 'flex';
    } else {
        eraserTool.classList.remove('active-tool');
        pencilTool.classList.add('active-tool');
        eraserToolCont.style.display = 'none';
    }
})

stickyTool.addEventListener('click', (e) => {
    let stickyTempHtml = `<textarea></textarea>`;
    generateSticky(stickyTempHtml);
})

uploadTool.addEventListener('click', (e) => {

    let input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();

    input.addEventListener('change', (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickyTempHtml = `<img src="${url}" alt="">`;
        generateSticky(stickyTempHtml);

    });


})

pencilColors.forEach((pencilColor) => {
    pencilColor.addEventListener('click', (e) => {
        console.log(e.target.classList[1]);
        let color = e.target.classList[1];
        let colorCode = document.querySelector(`.${color}`);
        colorFlag[color] = !colorFlag[color];
        if (colorFlag[color]) {
            console.log('here');
            colorCode.style.border = '3px solid white'
            colorCode.style.boxShadow = '0px 0px 10px 0px black'
        } else {
            colorCode.style.border = 'none'
            colorCode.style.boxShadow = 'none'
        }

        for (let restColor in colorFlag) {
            let restColorCode = document.querySelector(`.${restColor}`);
            if (restColor !== color) {
                colorFlag[restColor] = false;
                restColorCode.style.border = 'none'
                colorCode.style.boxShadow = 'none'
            }
        }
    });
})

function generateSticky(stickyTempHtml) {
    let stickyCont = document.createElement('div');
    stickyCont.setAttribute('class', 'sticky-cont');

    stickyCont.innerHTML = `
        <div class="header-cont">
            <div class="minimize">-</div>
            <div class="remove">X</div>
        </div>

        <div class="note-cont">
            ${stickyTempHtml}
        </div>
    `;
    document.body.appendChild(stickyCont);

    let minimize = stickyCont.querySelector('.minimize');
    let remove = stickyCont.querySelector('.remove');

    noteActions(minimize, remove, stickyCont);

    stickyCont.onmousedown = (event) => {
        dragAndDrop(stickyCont, event)
    };

    stickyCont.ondragstart = () => {
        return false;
    };
}

function noteActions(minimize, remove, stickyCont) {
    remove.addEventListener('click', (e) => {
        stickyCont.remove();
    })

    minimize.addEventListener('click', (e) => {
        let noteCont = stickyCont.querySelector('.note-cont');
        let textarea = noteCont.querySelector('textarea');

        if (minimize.innerHTML == '-') {
            noteCont.style.display = 'none';
            minimize.innerHTML = '+';
        } else {
            noteCont.style.display = 'block';
            minimize.innerHTML = '-';
        }
    })
}

function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;


    moveAt(event.pageX, event.pageY);


    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }


    document.addEventListener('mousemove', onMouseMove);


    element.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}