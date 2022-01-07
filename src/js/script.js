document.getElementById('btn-selectfile').innerHTML = `<i class="icons inline-block bi bi-file-earmark-music" id="selectFile"></i>`;

const {
    remote
} = require('electron');
const dialog = remote.dialog;
const mainWindow = remote.getCurrentWindow();

const jsmediatags = require('jsmediatags');

const selectFile = document.getElementById('selectFile');
const info = document.getElementById('info');
const title = document.getElementById('title');
const img = document.getElementById('image');
const btnGroup = document.getElementById('btn-audio');
const btnGroupRepeat = document.getElementById('btn-audio-repeat');
const fastForward = document.getElementById('btn-forward');
const rewind = document.getElementById('btn-backward');
const volumeBar = document.getElementById('btn-audio-volume');
const progressBarDiv = document.getElementById('audio-progress-bar');

let audio = null;
let volume = 100;

selectFile.onclick = async () => {
    const file = await dialog.showOpenDialog(mainWindow, {
        filters: [{
            name: "Audio Files",
            extensions: ["mp3", "wav", "ogg", "acc"]
        }],
        properties: ["openFile"]
    });

    if (file.canceled) return;

    if (audio !== null) {
        if (!audio.volume * 100 !== 100) volume = audio.volume * 100;
        audio.pause();
    }

    try {
        img.src = "./img/placeholder.jpg";
        title.innerHTML = "";
        info.innerHTML = "";
        audio = new Audio(file.filePaths[0].replace(/#/g, '%23'));
        audio.play();
        btnGroup.innerHTML = `<button class="rounded-button" type="button" onclick="audioControl()"><i size="large" class="bi bi-pause"></i></button>`;
        btnGroupRepeat.innerHTML = `<i class="icons bi bi-arrow-repeat" onclick="repeat()"></i>`;
        rewind.innerHTML = `<i onclick="backward()" class="icons bi bi-skip-backward" style="width:35px;height:35px;"></i>`;
        fastForward.innerHTML = `<i onclick="forward()" class="icons bi bi-skip-forward" style="width:35px;height:35px;"></i>`;
        volumeBar.innerHTML = `<div class="btn-group dropup bottom-right"><i class="icons bi bi-volume-up" data-bs-toggle="dropdown" aria-expanded="false"></i><ul class="dropdown-menu"><div style="color:#ffffff00;">dasdasdkprgoregpokperkgp2345r</div><div class="container"><input id="vol-control" type="range" min="0" max="100" step="1" value="${volume}" oninput="SetVolume(this.value)" onchange="SetVolume(this.value)"></input><div id="slider-value">100</div></div></ul></div>`;
        progressBarDiv.innerHTML = `<fieldset><label id="audio-progress-bar-start" for="audio-progress-control" style="display: inline-block;">0%</label><input style="display: inline-block;" id="audio-progress-control" name="audio-progress-control" type="range" min="0" max="100" value="100" readonly></label><span id="audio-progress-bar-end" for="audio-progress-control" style="display: inline-block;">100%</label></fieldset>`;
        SetVolume(volume);
        progress();
    } catch (err) {
        alart("An error has occurred while trying to play the audio.");
    }

    audio.onended = () => {
        img.src = "./img/placeholder.jpg";
        title.innerHTML = "";
        info.innerHTML = "";
        btnGroup.innerHTML = "";
        btnGroupRepeat.innerHTML = "";
        rewind.innerHTML = "";
        fastForward.innerHTML = "";
        volumeBar.innerHTML = "";
        progressBarDiv.innerHTML = "";
    };

    jsmediatags.read(file.filePaths[0], {
        onSuccess: (tag) => {
            const image = tag.tags.picture;
            if (image) {
                const base64String = Buffer.from(image.data, 'binary').toString('base64');
                img.src = `data:${image.format};base64,${base64String}`;
            } else img.src = "./img/undefined.jpg";

            title.innerHTML = tag.tags.title;
            info.innerHTML = tag.tags.artist;
        },
        onError: (error) => {
            img.src = "./img/undefined.jpg";
            title.innerHTML = "undefined";
            info.innerHTML = "undefined";
        },
    });
};

async function audioControl() {
    if (audio === null) return;
    if (audio.paused) {
        audio.play();
        btnGroup.innerHTML = `<button class="rounded-button" type="button" onclick="audioControl()"><i class="bi bi-pause" size="large"></i></button>`;
    } else {
        audio.pause();
        btnGroup.innerHTML = `<button class="rounded-button" type="button" onclick="audioControl()"><i class="bi bi-play" size="large"></i></button>`;
    }
}

async function repeat() {
    if (audio === null) return;
    if (audio.loop) {
        audio.loop = false;
        btnGroupRepeat.innerHTML = `<i class="icons bi bi-arrow-repeat" onclick="repeat()"></i>`;
    } else {
        audio.loop = true;
        btnGroupRepeat.innerHTML = `<i class="icons bi bi-infinity" onclick="repeat()"></i>`;
    }
}

async function forward() {
    if (audio === null) return;
    audio.currentTime += 10;
}

async function backward() {
    if (audio === null) return;
    audio.currentTime -= 10;
}

async function SetVolume(val) {
    if (audio === null) return;
    const volSlider = document.getElementById("vol-control");
    const sliderValue = document.getElementById("slider-value");
    audio.volume = val / 100;
    valPercent = (volSlider.value / volSlider.max)*100;
    volSlider.style.background = `linear-gradient(to right, #3264fe ${valPercent}%, #d5d5d5 ${valPercent}%)`;
    sliderValue.innerHTML = volSlider.value;
}

async function progress() {
    if (audio === null) return;
    const progressBar = document.getElementById('audio-progress-control');
    audio.addEventListener('timeupdate', () => {
        const duration = audio.duration;
        const currentTime = audio.currentTime;
        const percent = (currentTime / duration) * 100;
        progressBar.value = percent;
    });
}