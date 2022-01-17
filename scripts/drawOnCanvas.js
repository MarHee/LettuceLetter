// Original Script by Matěj Pokorný https://stackoverflow.com/a/30684711 (26.11.2021 16:21 Uhr)
// --------------------------------------------------------------------------------------------
// create canvas element and append it to document body

let canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// Set attributes with helper Function
function setAttributes(element, attributes) {
    for (key in attributes) {
        element.setAttribute(key, attributes[key])
        console.log(key, attributes[key])
    }
}

setAttributes(canvas, {id: "canvas", width: "1000px;", height: "420px;", style: "border: 4px #94cf03 dotted;"})

// get canvas 2D context and set him correct size
let ctx = canvas.getContext('2d');

// Last known  positon
let pos = { x: 0, y: 0 };

//window.addEventListener('resize', resize);
document.addEventListener('mousemove', draw);
document.addEventListener('mousedown', setPosition);
document.addEventListener('mouseenter', setPosition);

// new position from mouse event
function setPosition(e) {
  pos.x = e.clientX -10; 
  pos.y = e.clientY -200 ; 
}

function draw(e) {
  // mouse left button must be pressed
  if (e.buttons !== 1) return;

  ctx.beginPath(); // begin

  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#211f1f';

  ctx.moveTo(pos.x, pos.y); // from
  setPosition(e);
  ctx.lineTo(pos.x, pos.y); // to

  ctx.stroke(); // draw it!
}