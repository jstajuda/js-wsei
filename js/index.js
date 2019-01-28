let inputFile = document.getElementById("imageFile");
let inputUrl = document.getElementById("imageUrl");
let loadFromUrlForm = document.getElementById("loadImageFromUrl");
let file, fileReader, url;

inputFile.onchange = function() {
    file = inputFile.files[0];
    fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener('load', createImageFromFile);
}

loadFromUrlForm.onsubmit = function(e) {
    e.preventDefault();
    url = inputUrl.value;
    loadImageFromUrl();
}

function createImageFromFile() {
    img = new Image();
    img.onload = imageLoaded;
    img.src = fileReader.result;
}

function loadImageFromUrl() {
    img = new Image();
    img.onload = imageLoaded;
    img.src = url;
}

function imageLoaded() {
    var canvas = document.getElementById("imgCanvas")
    var ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
}

