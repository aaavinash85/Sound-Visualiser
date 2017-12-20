var fft, // Allow us to analyze the song
    numBars = 1024, // The number of bars to use; power of 2 from 16 to 1024
    song; // The p5 sound object

// Load our song
var loader = document.querySelector(".loader");
document.getElementById("audiofile").onchange = function(event) {
    if(event.target.files[0]) {
        if(typeof song != "undefined") { // Catch already playing songs
            song.disconnect();
            song.stop();
        }
        
        // Load our new song
        song = loadSound(URL.createObjectURL(event.target.files[0]));
        loader.classList.add("loading");
    }
}

var canvas;
function setup() { // Setup p5.js
    canvas = createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(51);
    
    if(typeof song != "undefined" 
       && song.isLoaded() 
       && !song.isPlaying()) { // Do once
        loader.classList.remove("loading");
        
        song.play();
        song.setVolume(0.5);

        fft = new p5.FFT();
        fft.waveform(numBars);
        fft.smooth(0.85);
    }
    
    if(typeof fft != "undefined") {
        var spectrum = fft.analyze();
        noStroke();
        fill("rgb(0, 255, 0)");
        for(var i = 0; i < numBars; i++) {
            var x = map(i, 0, numBars, 0, width);
            var h = -height + map(spectrum[i], 0, 255, height, 0);
            rect(x, height, width / numBars, h);
        }
    }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}