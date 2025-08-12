const ad = document.querySelector(".song");
const playing = document.querySelector(".fa-play");
const pauses = document.querySelector(".fa-pause");
const forw = document.querySelector(".fa-forward-step");
const ttl = document.querySelector(".title");
const art_img = document.querySelector("#artist");
const art_name = document.querySelector("#name");
const playSong = document.querySelector("#playsong");
const progres = document.querySelector(".line"); // outer line (clickable)
const linebar = document.querySelector(".linechild"); // inner progress bar
const strt = document.querySelector("#start");
const end = document.querySelector("#end");

const artist_name = ['alan walker', 'drake', 'jubin nautiya', 'asees kaur'];
const artist_title = ['faded', 'baby i like your style one dance', 'raatan lambiyan', 'la la lo la la'];

let x = 0;
let isPlaying = false;

playSong.addEventListener('click', effect);

function effect() {
    if (ad.duration === ad.currentTime) {
        x += 1;
    }

    if (!playing.classList.contains('none')) {
        ad.play();

        if (!isPlaying) {
            setInterval(prog, 1000);
            setInterval(updateProgressLine, 1000);
            isPlaying = true;
        }

        progres.addEventListener('click', (e) => {
			var widthbar2 = (e.offsetX / e.target.clientWidth) * ad.duration;
			ad.currentTime = widthbar2;
	});

    } else {
        ad.pause();
    }

    ttl.classList.toggle('run');
    playing.classList.toggle('none');
    pauses.classList.toggle('none');
    art_img.classList.toggle('round');
    dur();
}

function removeEffect() {
    ad.pause();
    ad.currentTime = 0.01;
    ttl.classList.remove('run');
    playing.classList.remove('none');
    pauses.classList.add('none');
    art_img.classList.remove('round');
}

function backward() {
    dur();
    x -= 1;
    if (x < 0) {
        x = artist_name.length - 1;
    }
    removeEffect();
    songs(x);
    // Update UI
    playing.classList.add('none');
    pauses.classList.remove('none');
    ttl.classList.add('run');
    art_img.classList.add('round');
}

function forward() {
    dur();
    x += 1;
    if (x >= artist_name.length) {
        x = 0;
    }
    removeEffect();
    songs(x);
    // Update UI
    playing.classList.add('none');
    pauses.classList.remove('none');
    ttl.classList.add('run');
    art_img.classList.add('round');
}


function songs(index) {
    art_name.innerHTML = artist_name[index];
    ttl.innerHTML = artist_title[index];
    art_img.src = `m${index}.jpeg`;
    ad.src = `s${index}.mp3`;
    ad.addEventListener("loadedmetadata", dur);
    ad.play();
}

function dur() {
    const dura = ad.duration;
    if (!isNaN(dura)) {
        const secdu = Math.floor(dura % 60).toString().padStart(2, '0');
        const mindu = Math.floor(dura / 60);
        end.innerHTML = `${mindu}:${secdu}`;
    }
}

function prog() {
    var curtime = ad.currentTime;
    var mincur = Math.floor(curtime / 60);
    var seccur = Math.floor(curtime % 60);
    if (seccur < 10) {
        seccur = `0${seccur}`;
    }
    strt.innerHTML = `${mincur}:${seccur}`;
}

function updateProgressLine() {
    if (!isNaN(ad.duration)) {
        var widthbar = (ad.currentTime / ad.duration) * 100;
        linebar.style.width = `${widthbar}%`;
    }
}

songs(0);
ad.addEventListener('ended', forward);
