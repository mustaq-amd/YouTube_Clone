import yt_clone_navbar from "./components/navbar.js";
import {getData} from "./scripts/getData.js";


const API_KEY="AIzaSyCd5eQlCCtmkKUE3I7nYkCX_rWgmcJTmEk";

// navbar for video page
let yt_clone_navbar_div=document.getElementById("yt-home-navbar");
yt_clone_navbar_div.innerHTML=yt_clone_navbar();

//navigate to home page on click logo
let logoIcon=document.querySelectorAll(".yt-logo");
logoIcon.forEach((element)=>{
    element.addEventListener('click',(e)=>{
        alert("clicked...");
        window.location.href="http://127.0.0.1:5503/index.html"
    });

})


//getting selected videoId from local storage
let videoId=localStorage.getItem("yt-video-id");
  playSelectedVideo(videoId);

//attaching videoId to frame
function playSelectedVideo(videoId){
    let videoContainer=document.getElementById("video-play-container");
    let frame=document.getElementById("vFrame");
    frame.src=`https://www.youtube.com/embed/${videoId}`;
    videoContainer.append(frame);
}