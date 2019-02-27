let inputFile = document.getElementById("imageFile");
let inputUrl = document.getElementById("imageUrl");
let loadFromUrlForm = document.getElementById("loadImageFromUrl");
let file, fileReader, url;
let imageData = [];

var canvas = document.getElementById("imgCanvas")
var ctx = canvas.getContext("2d");

inputFile.onchange = function() {
    file = inputFile.files[0];
    fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener('load', createImageFromFile);
}

// loadFromUrlForm.onsubmit = function(e) {
//     e.preventDefault();
//     url = inputUrl.value;
//     loadImageFromUrl();
// }

// function loadImageFromUrl() {
//     img = new Image();
//     img.crossOrigin="Anonymous";
//     img.onload = imageLoaded;
//     img.src = url;
// }

function createImageFromFile() {
    img = new Image();
    img.onload = imageLoaded;
    img.src = fileReader.result;
}

function imageLoaded() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const brightenButton = document.getElementById('brightenButton');
const darkenButton = document.getElementById('darkenButton');
const moreContrastButton = document.getElementById('moreContrastButton');
const lessContrastButton = document.getElementById('lessContrastButton');
const grayscaleButton = document.getElementById('grayscaleButton');
const thresholdButton = document.getElementById('thresholdButton');

brightenButton.addEventListener('click', () => {brightness(imageData.data, 5)});
darkenButton.addEventListener('click', () => {brightness(imageData.data, -5)});
moreContrastButton.addEventListener('click', () => {contrastImage(imageData.data, 5)});
lessContrastButton.addEventListener('click', () => {contrastImage(imageData.data, -5)})
grayscaleButton.addEventListener('click', () => {grayscale(imageData.data)})
thresholdButton.addEventListener('click', () => {threshold(imageData.data, 128)})

function grayscale(data) {
    for (let i = 0; i < data.length; i += 4) {
        let red = data[i];
        let green = data[i+1];
        let blue = data[i+2];
        data[i] = data[i+1] = data[i+2] = 0.2126*red + 0.7152*green + 0.0722*blue;
    }
    updateImageData();
}

function brightness(data, adjustment) {
    for (let i = 0; i < data.length; i += 4) {
        data[i] += adjustment;
        data[i + 1] += adjustment;
        data[i + 2] += adjustment;
    }
    updateImageData();
}

function contrastImage(data, contrast) {
    contrast = (contrast / 100) + 1;
    let intercept = 128 * (1 - contrast);
    for(let i = 0; i < data.length; i += 4){ 
        data[i] = data[i] * contrast + intercept;
        data[i+1] = data[i+1] * contrast + intercept;
        data[i+2] = data[i+2] * contrast + intercept;
    }
    updateImageData();
}

function threshold(data, point) {
    for (let i = 0; i < data.length; i += 4) { 
        let red = data[i];
        let green = data[i+1];
        let blue = data[i+2];
        let v  = (0.2126*red + 0.7152*green + 0.0722*blue >= point) ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = v;
    }
    updateImageData();
}

function updateImageData() {
    ctx.putImageData(imageData, 0, 0);
}