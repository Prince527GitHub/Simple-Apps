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

let audio = null;

selectFile.onclick = async () => {
    const file = await dialog.showOpenDialog(mainWindow, {
        filters: [
            {
                name: "Audio Files",
                extensions: ["mp3", "wav", "ogg", "flac", "m4a", "acc"]
            }
        ],
        properties: ["openFile"]
    });

    if (file.canceled) return;

    if (audio !== null) audio.pause();

    try {
        audio = new Audio(file.filePaths[0]);
        audio.play();
        btnGroup.innerHTML = `<button class="btn" onclick="audioControl()">Pause</button>`;
    } catch (err) {
        console.log(err);
    }

    audio.onended = () => {
        img.src = "./img/placeholder.jpg";
        title.innerHTML = "";
        info.innerHTML = "";
        btnGroup.innerHTML = "";
    };

    jsmediatags.read(file.filePaths[0], {
        onSuccess: (tag) => {
            const image = tag.tags.picture;
            if (image) {
                const base64String = Buffer.from(image.data, 'binary').toString('base64');
                img.src = `data:${image.format};base64,${base64String}`;
            }

            title.innerHTML = tag.tags.title;
            info.innerHTML = `<br>Artist: ${tag.tags.artist}<br>Album: ${tag.tags.album}<br>Year: ${tag.tags.year}`;
        },
        onError: (error) => {
            console.log(error);
        },
    });
};

async function audioControl() {
    if (audio === null) return; 
    if (audio.paused) {
        audio.play();
        btnGroup.innerHTML = `<button type="button" class="btn" onclick="audioControl()">Pause</button>`;
    } else {
        audio.pause();
        btnGroup.innerHTML = `<button type="button" class="btn" onclick="audioControl()">Play</button>`;
    }
}