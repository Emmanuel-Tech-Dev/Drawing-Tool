

// DOM Selectors

//Line width selector
const slider = document.getElementById("myRange");
const output = document.getElementById("range");

// Canvas selector
const canvas = document.getElementById('canvas');
const input = document.querySelector('input');
const ctx = canvas.getContext('2d');

//Color Selector
const color = document.getElementById("color_picker");
const color_value = document.getElementById("color");

const clicks = document.querySelectorAll('[id^="click"]');
const body = document.querySelector('body');

const model = document.querySelectorAll('.model');
const models = [
  document.getElementById('model'),
  document.getElementById('model-2'),
  document.getElementById('model-3')
];

const downloadBtn = document.querySelector('.download-icon');
const alertComponent = document.querySelector('.alert-container');
const container = document.querySelector('.wrapper');

// STATE
ctx.strokeStyle = '';
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hue = '';
let lineWidth = ctx.lineWidth;
let minWidth = lineWidth ;
let maxWidth = 120;
let direction = true; // true = increase, false = decrease
let numClicks = 0;
// Update the current slider value (each time you drag the slider handle)
let mousedown = false


// FUNCTIONS 

//function to download image
function downloadImage() {
  // Create a new canvas with white background
  const newCanvas = document.createElement('canvas');
  newCanvas.width = canvas.width;
  newCanvas.height = canvas.height;
  const newCtx = newCanvas.getContext('2d');
  newCtx.fillStyle = '#ffffff';
  newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);

  // Copy the contents of the original canvas to the new canvas
  newCtx.drawImage(canvas, 0, 0);

  // Get canvas data url
  const dataURL = newCanvas.toDataURL({ pixelRatio: 2 });

  // Create download link and trigger click
  const downloadLink = document.createElement('a');
  downloadLink.download = 'my-drawing.jpg';
  downloadLink.href = dataURL;
  downloadLink.click();
}


// fuction to display model menu on click
function toggleModelDisplay(index) {
  numClicks++;
  const click = clicks[index];
  const model = models[index];

  if (numClicks % 2 === 1) {
    click.classList.add('active');
    model.style.display = 'block';
    if (index === 2) {
      body.classList.add('loader-active');
    }
   
  } else {
    model.style.display = 'none';
    click.classList.remove('active');
    numClicks = 0;
    if (index === 2) {
      body.classList.remove('loader-active');
    }

    
  }

 
}

// function to increase the line auto increase the linewidth when checkbox is checked
function moving() {

  if (autoAdjustCheckbox.checked){

  if (direction) {
    lineWidth++;
    if (lineWidth > maxWidth) {
      direction = false;
    }
  } else {
    lineWidth--;
    if (lineWidth < minWidth) {
      direction = true;
    }
  }
  ctx.lineWidth = lineWidth;

}else{
  let width = slider.value
  ctx.lineWidth = width;
}
}

// function to generate random colors 
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// function to trigger random colors when auto adjust color is checked
function ColorAdjust() {
  if (autoAdjustcolor.checked) {
    const randomColor = getRandomColor();
    ctx.strokeStyle = randomColor;
    console.log(ctx.strokeStyle);
  }
}


//function to draw on the canvas

function draw(e) {

  if (!isDrawing) return;
  // console.log(e) ;

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY]; //Es6 array destracturing

  moving();

  ColorAdjust();
 
}


// ALL EVENT LISTENNERS HANDLERS

// event listener to increase or descrease the width of the lines 
slider.addEventListener('mousedown', () => {
  mousedown = true
})

slider.addEventListener('mousemove', () => {
  if (mousedown) {
    output.innerHTML = `${slider.value}%`; 
    const lineWidth = slider.value;
    ctx.lineWidth = lineWidth;

   
  }
})

slider.addEventListener('mouseup', () => {
  mousedown = false
})


// event listener to change the color of the drawing lines 
color.addEventListener('input', () => {
  const selected_color = color.value;
  console.log(selected_color);
  ctx.strokeStyle = `${selected_color}`;

});

// event to toggle model display 
clicks.forEach((click, index) => {
  click.addEventListener('click', () => toggleModelDisplay(index));
});

// event to add an active class to every model item on click and then add the data set of that active item to the linejoin , gco , linecap 
model.forEach(model => {
  const modelNavs = model.querySelectorAll('.model-nav li');
  
  modelNavs.forEach(nav => {
    nav.addEventListener('click', event => {
      const clickedLi = event.target.closest('li');
  
      if (clickedLi) {
        const activeLi = model.querySelector('.active');
  
        if (activeLi) {
          activeLi.classList.remove('active');
        }
  
        clickedLi.classList.add('active');
  
        const dataSet = clickedLi.dataset.set;
  
        if (model.id === 'model') {
          ctx.lineJoin = dataSet;
        } else if (model.id === 'model-2') {
          ctx.lineCap = dataSet;
        } else if (model.id === 'model-3') {
          ctx.globalCompositeOperation = dataSet;
        }
      }
    });
  });
});


// Auto adjust line widht when checkbox is checked
const autoAdjustCheckbox = document.getElementById('auto-adjust');
autoAdjustCheckbox.addEventListener('change', () => {
   autoAdjustCheckbox.checked;
});

// Auto adjust color when checkbox is checked
const autoAdjustcolor = document.getElementById('auto-color');
autoAdjustcolor.addEventListener('change', () => {
  ColorAdjust();
});


// handling the mouse events on the canvas
canvas.addEventListener('mousemove' , draw)
canvas.addEventListener('mousedown' , (e) => {
    isDrawing = true;
    [lastX , lastY] = [e.offsetX , e.offsetY]
})
canvas.addEventListener('mouseup' , () => isDrawing = false)
canvas.addEventListener('mouseout' , () => isDrawing = false)

//set time on the random colors to generate a color every 1min
setInterval(getRandomColor, 10000);


// downloading the results of your drawing 
downloadBtn.addEventListener('click', downloadImage);


// determing the width of the windows

const windowWidth = window.innerWidth;
console.log(windowWidth)

if(windowWidth < 1200){
 container.style.display = 'none';
 alertComponent.style.display = 'block'
}else{
  container.style.display = 'block';
 alertComponent.style.display = 'none'
}





