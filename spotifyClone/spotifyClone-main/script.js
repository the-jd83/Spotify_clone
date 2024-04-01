let currSong=new Audio();
let songs;
let currFolder;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder){
    currFolder=folder
    let a=await fetch(`http://127.0.0.1:3000/${folder}/`);
    let resp=await a.text();
    let div=document.createElement("div");
    div.innerHTML=resp;
    let as=div.getElementsByTagName("a");
     songs=[];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith("mp3") || element.href.endsWith("flac"))
        {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
        
    }
    let songUl=document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUl.innerHTML="";
    for (const song of songs) {
        songUl.innerHTML=songUl.innerHTML+`<li>
        
        <img class="invert" src="images/music.svg" alt="music">
                        <div class="info">                            
                            <div>${song.replaceAll("%20"," ")}</div>
                            <div>Mitansh</div>
                        </div>
                        <div class="playNow">
                            <span>Play Now</span>
                            <img class="invert" src="images/playy.svg" alt="play">
                        </div>
                        </li>`;
    }


    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").getElementsByTagName("div")[0].innerHTML);
            playMusic(e.querySelector(".info").getElementsByTagName("div")[0].innerHTML);
        })
        
    });
    return songs;
}


const playMusic=(track,pause=false)=>{
    currSong.src=`/${currFolder}/`+track;
    if(!pause)
    {
        currSong.play();
        play.src="images/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML=decodeURI(track);
    document.querySelector(".songTime").innerHTML="00:00 / 00:00";
}


async function displayAlbums(){
    let a=await fetch(`http://127.0.0.1:3000/songs/`);
    let resp=await a.text();
    let div=document.createElement("div");
    div.innerHTML=resp;
    let anchors=div.getElementsByTagName("a");
    let array=Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if(e.href.includes("/songs")){
            let folder=(e.href.split("/").slice(-2)[0]);

            let a=await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            let resp=await a.json();
            console.log(resp);

            document.querySelector(".card-container").innerHTML=document.querySelector(".card-container").innerHTML+` <div data-folder="${folder}" class="card">
            <div class="play">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="20" height="20" rx="12" fill="#4CAF50" />
                    <path d="M7.5 18V6L17.5 12L7.5 18Z" fill="#000000" stroke="#1fdf64" stroke-width="1.5" stroke-linejoin="round"/>
                  </svg>   
            </div>
            <img src="/songs/${folder}/cover.jpg" alt="none">
            <h3>${resp.title}</h3>
            <div class="cc">
            <p>${resp.description}</p>
        </div>
        </div>`
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs=await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0]);
        })
    })
}

async function main(){
    await getSongs("songs/favsongs");
    playMusic(songs[0],true);
    displayAlbums();
    play.addEventListener("click",()=>{
        if(currSong.paused)
        {
            currSong.play();
            play.src="images/pause.svg";
        }
        else{
            currSong.pause();
            play.src="images/playy.svg"
        }
    })

    currSong.addEventListener("timeupdate",()=>{
        console.log(currSong.currentTime,currSong.duration);
        document.querySelector(".songTime").innerHTML=`${secondsToMinutesSeconds(currSong.currentTime)}/${secondsToMinutesSeconds(currSong.duration)}`;
        document.querySelector(".circle").style.left=(currSong.currentTime/currSong.duration)*100+"%";
})
    document.querySelector(".seekbar").addEventListener("click",e=>{
        document.querySelector(".circle").style.left=(e.offsetX/e.target.getBoundingClientRect().width)*100 +"%";
        currSong.currentTime=(currSong.duration*(e.offsetX/e.target.getBoundingClientRect().width));
    })

    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0";
    })

    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-130"+"%";
    })

    previous.addEventListener("click",()=>{
        console.log(songs);
        let index=songs.indexOf(currSong.src.split("/").slice(-1)[0]);
        if(index-1>=0)
        {
            playMusic(songs[index-1]);
        }
    })
    next.addEventListener("click",()=>{
        console.log(songs);
        let index=songs.indexOf(currSong.src.split("/").slice(-1)[0]);
        if(index+1<songs.length)
        {
            playMusic(songs[index+1]);
        }   
    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",e=>{
        console.log(e,e.target,e.target.value);
        currSong.volume=parseInt(e.target.value)/100;
        if(parseInt(e.target.value)==0)
        {
            document.querySelector(".vol").getElementsByTagName("img")[0].src="images/mute.svg";
        }
        else{
            document.querySelector(".vol").getElementsByTagName("img")[0].src="images/volume.svg"
        }
    })
    volbtn.addEventListener("click",()=>{
        if(currSong.volume==0)
        {
            currSong.volume=1;
            document.querySelector(".range").getElementsByTagName("input")[0].value=100;
            document.querySelector(".vol").getElementsByTagName("img")[0].src="images/volume.svg"
        }
        else{
            currSong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
            document.querySelector(".vol").getElementsByTagName("img")[0].src="images/mute.svg";
        }
    })

}


main();
