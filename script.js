let img = document.getElementById('img')
let audio = document.getElementById('audio');
let progressBar = document.getElementById('progress-bar');
let progress = document.getElementById('current-progress');
let thumb = document.getElementById('thumb')
let play = document.getElementById('play')
let prev = document.getElementById('prev')
let next = document.getElementById('next')
let playPause = document.getElementById('playPause')
let add = document.getElementById('add')
let song = document.getElementById('song')
let artist = document.getElementById('artist')
let favorite = document.getElementById('favorites')
let favorites = document.getElementById('favoriteList')
let bg = document.getElementById('bg')
let nav = document.getElementById('nav')
let shuffle = document.getElementById('shuffle')
let playing = false
let index = 0;
let songs = []
let favoritesList = []

nav.addEventListener('click',() => {
    favorite.classList.toggle('show')
})
const makeRequest = async() => {
    const url = './data.json'
    const res = await fetch(url)
    songs = await res.json()
    load(songs[index])
}
makeRequest()

function refreshFavorites()
{
    favorites.innerHTML = ""
    favoritesList.forEach(favorite => {
        let song = document.createElement('div')
        song.className = 'details'
        let icon = document.createElement('div')
        icon.classList.add('icon')
        let img = document.createElement('img')
        img.className = 'img'
        img.src = favorite["image"]
        icon.appendChild(img)
        let songName = document.createElement('span')
        songName.textContent = favorite["title"]
        let remove = document.createElement('span')
        remove.className = 'remove'
        remove.textContent = 'x'
        remove.addEventListener('click',() => {
            delete favoritesList[favoritesList.indexOf(favorite)]
            refreshFavorites()
        })
        song.append(icon,songName,remove)
        song.addEventListener('click',() => {
            load(favorite)
            audio.play()
            playing = true
            playbutton()
        })
        favorites.appendChild(song)
    })
}
add.addEventListener('click',() => {
    favoritesList[index] = songs[index];
    refreshFavorites()
})
shuffle.addEventListener('click',() => {
    for (let i = songs.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = songs[i];
        songs[i] = songs[j];
        songs[j] = temp;
    }
})
function playbutton()
{
    playing ? playPause.className = 'fa-solid fa-pause' : playPause.className = 'fa-solid fa-play'
}
play.addEventListener('click',() => {
    if(playing)
    {
        audio.pause()
        playing = false
        playbutton() 
    }
    else
    {
        audio.play()
        playing = true
        playbutton()
    }
})
prev.addEventListener('click',() => {
    index--
    index = index < 0 ? songs.length-1 : index
    load(songs[index])
    audio.play()
    playing = true
    playbutton()
})
next.addEventListener('click',() => {
    index++
    index = index >= songs.length ? 0 : index
    load(songs[index])
    audio.play()
    playing = true
    playbutton()
})
audio.addEventListener('timeupdate', () =>
{
    let value = (audio.currentTime / audio.duration) * 100
    thumb.style.left = value + '%'
    progress.style.width = value + '%'
    if(audio.currentTime == audio.duration)
    {
        next.click()
    }
})
progressBar.addEventListener('click', (e) => {
    let width = progressBar.clientWidth
    let clickX = e.clientX - progressBar.getBoundingClientRect().left
    let percent = (clickX / width)
    audio.currentTime = percent * audio.duration
})

function load(music)
{
    img.src = music["image"]
    audio.src = music["path"]
    song.textContent = music["title"]
    artist.textContent = music["artist"]
    bg.style.backgroundImage = `url('${music["image"]}')`
}