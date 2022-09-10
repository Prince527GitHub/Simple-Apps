const { remote } = require('electron');
const dialog = remote.dialog;
const mainWindow = remote.getCurrentWindow();

const jsmediatags = require('jsmediatags');

const info = document.getElementById('info');
const title = document.getElementById('title');
const img = document.getElementById('image');
const btnControl = document.getElementById('btn-control');
const btnRepeat = document.getElementById('btn-repeat');
const btnForward = document.getElementById('btn-forward');
const btnRewind = document.getElementById('btn-backward');
const btnVolume = document.getElementById('volume-dropdown');
const volumeInner = document.getElementById('volume-inner-dropdown');
const audioPercent = document.getElementById('audio-progress');
const btnTheme = document.getElementById('btn-theme');
const volumeSlider = document.getElementById("volume-control");
const root = document.documentElement;

if (!localStorage.getItem('theme')) localStorage.setItem('theme', 'dark');

if (localStorage.getItem('theme') === "dark") {
    btnTheme.classList.add("bi-moon");
    root.style.setProperty("--bg-color", "#1A1818");
    root.style.setProperty("--text-color", "#ffffff");
    volumeInner.classList.add("dark");
    color = '#fff';
    colorClass = 'dark';
} else {
    btnTheme.classList.add("bi-sun");
    root.style.setProperty("--bg-color", "#ffffff");
    root.style.setProperty("--text-color", "#000000");
}

let audio = null;
let volume = 100;

async function audioLoad() {
    const file = await dialog.showOpenDialog(mainWindow, {
        filters: [{
            name: "Audio File",
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
        img.classList.remove("hidden");
        title.innerHTML = "";
        info.innerHTML = "";
        audio = new Audio(file.filePaths[0].replace(/#/g, '%23'));
        audio.play();
        btnControl.classList.remove("hidden");
        btnRepeat.classList.remove("hidden");
        btnRewind.classList.remove("hidden");
        btnForward.classList.remove("hidden");
        btnVolume.classList.remove("hidden");
        audioPercent.classList.remove("hidden");
        volumeSlider.value = volume;
        audioVolume(volume);
        audioProgress();
    } catch (err) {
        console.error(err);
        alert("An error has occurred while trying to play the audio.");
    }

    audio.onended = () => {
        img.classList.add("hidden");
        title.innerHTML = "";
        info.innerHTML = "";
        btnControl.classList.add("hidden");
        btnRepeat.classList.add("hidden");
        btnRewind.classList.add("hidden");
        btnForward.classList.add("hidden");
        btnVolume.classList.add("hidden");
        audioPercent.classList.add("hidden");
    };

    jsmediatags.read(file.filePaths[0], {
        onSuccess: (tag) => {
            const image = tag.tags.picture;
            if (image) {
                const base64String = Buffer.from(image.data, 'binary').toString('base64');
                img.src = `data:${image.format};base64,${base64String}`;
            } else img.src = "./img/undefined.png";

            title.innerHTML = tag.tags.title;
            info.innerHTML = tag.tags.artist;
        },
        onError: (error) => {
            img.src = "./img/undefined.png";
            title.innerHTML = "undefined";
            info.innerHTML = "undefined";
        },
    });
};

async function audioControl() {
    if (audio === null) return;

    const icon = document.getElementById("icon-control");

    if (audio.paused) {
        audio.play();
        icon.classList.remove("bi-play");
        icon.classList.add("bi-pause");
    } else {
        audio.pause();
        icon.classList.remove("bi-pause");
        icon.classList.add("bi-play");
    }
}

async function audioRepeat() {
    if (audio === null) return;

    const icon = document.getElementById("icon-repeat");

    if (audio.loop) {
        audio.loop = false;
        icon.classList.remove("bi-infinity");
        icon.classList.add("bi-arrow-repeat");
    } else {
        audio.loop = true;
        icon.classList.remove("bi-arrow-repeat");
        icon.classList.add("bi-infinity");
    }
}

async function audioForward() {
    if (audio === null) return;

    audio.currentTime += 10;
}

async function audioBackward() {
    if (audio === null) return;

    audio.currentTime -= 10;
}

async function audioVolume(val) {
    if (audio === null) return;

    const sliderValue = document.getElementById("volume-value");

    audio.volume = val / 100;
    const valPercent = (volumeSlider.value / volumeSlider.max)*100;

    volumeSlider.value = valPercent;
    sliderValue.innerHTML = volumeSlider.value;
}

async function audioProgress() {
    if (audio === null) return;

    const element = document.getElementById('audio-progress-control');

    audio.addEventListener('timeupdate', () => {
        const duration = audio.duration;
        const currentTime = audio.currentTime;
        const percent = (currentTime / duration) * 100;
        element.value = percent;
    });
}

async function theme() {
    if (localStorage.getItem('theme') === "dark") {
        btnTheme.classList.remove("bi-moon");
        btnTheme.classList.add("bi-sun");
        root.style.setProperty("--bg-color", "#ffffff");
        root.style.setProperty("--text-color", "#000000");
        volumeInner.classList.remove("dark");
        localStorage.setItem("theme", "light");
    } else {
        btnTheme.classList.remove("bi-sun");
        btnTheme.classList.add("bi-moon");
        root.style.setProperty("--bg-color", "#1A1818");
        root.style.setProperty("--text-color", "#ffffff");
        volumeInner.classList.add("dark");
        localStorage.setItem("theme", "dark");
    }
}