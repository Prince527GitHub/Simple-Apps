const shell = require('electron').shell;
const malScraper = require('mal-scraper');

const updateOnlineStatus = () => {
    if(avigator.onLine ? 'online' : 'offline' === "offline") alert("You are offline");
}

window.addEventListener('online', updateOnlineStatus)
window.addEventListener('offline', updateOnlineStatus)

updateOnlineStatus()

async function searchAnime() {
    const searchBar = document.getElementById('search').value;
    const anime = await malScraper.getInfoFromName(searchBar);

    document.getElementById('body').innerHTML = `<ul class="nav"><li class="nav-item" style="margin-right:0.5em;margin-left:0%;"><ion-icon onclick="resetHTML()" class="icons" style="font-size:64px;" size="large" name="arrow-back"></ion-icon></li><li class="nav-item" style="margin-right:0.5em;margin-left:0.5em;"><ion-icon onclick="openAnime('${anime.url}')" class="icons" style="font-size:64px;color: rgb(110, 114, 114);" size="large" name="link"></ion-icon></li></ul><div class="img-text"><img class="cover-art" id="cover-art" src="./temp.png" alt="cover-art"><h1 class="title text-border" id="title">${anime.title}</h1><h3 class="subtitle text-border" id="subtitle">${anime.englishTitle}</h3><h6 class="description text-border" id="description">${anime.synopsis}</h6><h6 class="rating" id="rating">${anime.rating}</h6><h6 class="stats" id="stats"><ion-icon style="font-size:16px;" name="star"></ion-icon>: ${anime.score} | <ion-icon style="font-size:16px;" name="people"></ion-icon>: ${anime.members} | <ion-icon style="font-size:16px;" name="list"></ion-icon>: ${anime.popularity} | <ion-icon name="trophy"></ion-icon>: ${anime.ranked} <ion-icon name="heart"></ion-icon>: ${anime.favorites}</h6></div><div class="wrapper" id="actors"></div><div><div class="card-body"><div class="container"><div class="row"><div class="col"><img src="./tv.png" height="512" width="512"></div><div class="col" style="display:flex;align-items:center;justify-content:center"><h3>${anime.title} was produced by ${anime.producers.join(', ')} and the studios are ${anime.studios.join(', ')}.</h3></div></div></div><div class="container"><div class="row"><div class="col" style="display: flex; align-items: center; justify-content: center;"><h3>${anime.title} is based off a ${anime.source} and premiered ${anime.premiered} and has ${anime.episodes} episodes.</h3></div><div class="col"><iframe src="${anime.trailer}" width="512" height="512"></iframe></div></div></div><div class="container"><div class="row"><div class="col"><img src="./brush.png" height="512" width="512"></div><div class="col" style="display:flex;align-items:center;justify-content:center"><h3>${anime.title}'s genres are ${anime.genres.join(', ')}.</h3></div></div></div></div></div>`;

    await anime.characters.forEach(async (char) => {
        document.getElementById('actors').innerHTML += `<div class="item"><div class="card text-center" style="width:16rem;background-color:#4b4949;"><img src="${char.picture}" class="card-img-top" alt="characters-1"><div class="card-body"><h5 class="card-title">${char.name} - ${char.role}</h5></div><ul class="list-group list-group-flush"><li class="list-group-item" style="color:white;background-color:#4b4949;"><img src="${char.seiyuu.picture}" width="36" height="36" class="rounded-border" alt="characters-1" style="object-fit: cover;">${char.seiyuu.name}</li></ul><div class="card-body"><a onclick="openAnime('${char.link}')" href="#" class="btn btn-secondary">Character</a><a onclick="openAnime('${char.seiyuu.link}')" href="#" class="btn btn-secondary">Actor</a></div></div></div>`;
    });

    document.getElementById('cover-art').src = anime.picture;

    // await anime.staff.forEach(async (staff) => {
    //     document.getElementById('actors').innerHTML += `<div class="item"><div class="card text-center" style="width:16rem;background-color:#4b4949;"><img src="${staff.picture}" class="card-img-top" alt="characters-1"><div class="card-body"><h5 class="card-title">${staff.name}</h5></div><ul class="list-group list-group-flush"><li class="list-group-item" style="color:white;background-color:#4b4949;font-size:23.5px;">${staff.role}</li></ul><div class="card-body"><a onclick="openAnime('${staff.link}')" href="#" class="btn btn-secondary">Link</a></div></div></div>`
    // });
}

function resetHTML() {
    document.getElementById('body').innerHTML = `<div class="boxContainer"><table class="elementsContainer"><tr><td><input id="search" type="text" placeholder="Anime title . . ." class="search"></td><td><a href="#" onclick="searchAnime()"><ion-icon class="icons" name="search"></ion-icon></a></td></tr></table></div>`;
}

function openAnime(link) {
    shell.openExternal(link);
}