const root = document.documentElement;

// Map function
const scale = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

window.onload = function(e) {
     scaleTextOnWindowChange();
     loopTypeWriter();
};

window.onscroll = function(e) {
    scaleTextOnWindowChange();
};

function scaleTextOnWindowChange() {
    var element = document.getElementById("h");
    var ypos = window.scrollY;
    document.documentElement.style.setProperty("--font-weight-line1", scale(ypos, 0, 500, 20, 300));
    document.documentElement.style.setProperty("--font-weight-line2", scale(ypos, 0, 500, 300, 20));
};

var i = 0;
var txt = 'Do Something New. Share your story. ';
var speed = 175;
var animation = setInterval(typeWriter, speed);

function loopTypeWriter()
{
    i = 0;
}

function typeWriter() {
  if (i < txt.length) {
    document.getElementById("demo").innerHTML = txt.charAt(i);
    document.documentElement.style.setProperty("--font-weight-row5", scale(i, 0, txt.length, 4, 300));
    document.documentElement.style.setProperty("--font-width-row5", scale(i, 0, txt.length, 100, 50));
    i++;
  } else {
    
    loopTypeWriter();
  }
}


