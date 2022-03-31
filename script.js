// global constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var clueHoldTime = 900;
var pattern = [1, 2, 3, 4, 5, 6, 7, 8];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0;
var mistakeCounter = 0;


function startGame() {
    progress = 0;
    mistakeCounter = 0;
    gamePlaying = true;
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    secretPattern()
    playClueSequence()
}


function stopGame() {
    gamePlaying = false;
    document.getElementById("startBtn").classList.remove("hidden");
    document.getElementById("stopBtn").classList.add("hidden");
    clueHoldTime = 900;
}

// Sound Synthesis Functions
const freqMap = {
    1: 500,
    2: 312,
    3: 392,
    4: 466.2,
    5: 543,
    6: 628,
    7: 279,
    8: 349.6,
}
function playTone(btn, len) {
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025)
    context.resume()
    tonePlaying = true
    setTimeout(function () {
        stopTone()
    }, len)
}
function startTone(btn) {
    if (!tonePlaying) {
        context.resume()
        o.frequency.value = freqMap[btn]
        g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025)
        context.resume()
        tonePlaying = true
    }
}
function stopTone() {
    g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025)
    tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0, context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn) {
    document.getElementById("button" + btn).classList.add("lit")
}
function clearButton(btn) {
    document.getElementById("button" + btn).classList.remove("lit")
}

function playSingleClue(btn) {
    if (gamePlaying) {
        lightButton(btn);
        playTone(btn, clueHoldTime);
        setTimeout(clearButton, clueHoldTime, btn);
    }
}

function playClueSequence() {
    guessCounter = 0;
    context.resume()
    let delay = nextClueWaitTime;
    for (let i = 0; i <= progress; i++) {
        console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
        setTimeout(playSingleClue, delay, pattern[i])
        delay += clueHoldTime
        delay += cluePauseTime;
    }

}

function secretPattern() {
    for (let i = 0; i <= 7; i++) {
        pattern[i] = Math.floor(Math.random() * 8) + 1;
    }
}

function loseGame() {
    stopGame();
    alert("Game Over. You lost.");
}

function winGame() {
    stopGame();
    alert("Game Over. You won!");
}

function guess(btn) {
    console.log("user guessed: " + btn);
    if (!gamePlaying) {
        return;
    }

    if (pattern[guessCounter] == btn) {
        if (guessCounter == progress) {
            if (progress == pattern.length - 1) {
                winGame();
            } else {
                progress++;
                clueHoldTime -= 90;
                playClueSequence();
            }
        } else {
            guessCounter++;
        }
    } else {
        mistakeCounter += 1;
        if (mistakeCounter == 1) {
            alert("You have (2) attempts  left to guess.")
        } else if (mistakeCounter == 2) {
            alert("You have (1) attempts  left to guess.")
        } else {
            loseGame();
        }

    }
}



