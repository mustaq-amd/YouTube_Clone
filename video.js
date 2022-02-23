import yt_clone_navbar from "./components/navbar.js";
import {getData} from "./scripts/getData.js";


const API_KEY="AIzaSyBmlAvBCKDp2Q7SblemYdfUo8zCTTCqn-Y";

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

let related_video_container=document.getElementById("related-video-container");
displayRelatedVideos(getRelatedVideos(videoId),related_video_container);


// getting data of related videos of particular videoId
async function getRelatedVideoData(videoId){
    console.log("videoId",videoId)
    let relatedVideoData=await getData(`https://youtube.googleapis.com/youtube/v3/search?key=${API_KEY}&type=video&part=snippet&relatedToVideoId=${videoId}&maxResults=20`);
    let relatedVideoDataItemsArr=relatedVideoData.items;
    console.log("relatedVideoDataItemsArr",relatedVideoDataItemsArr)
    let relatedVideoDataItems=filterByThumbnails(relatedVideoDataItemsArr);
    console.log("relatedVideoDataItems",relatedVideoDataItems);
    return relatedVideoDataItems;

}




//filtering objects which has snippets
function filterByThumbnails(data){
   console.log("filterByThumbnails",data)
    let relatedVideoDataItems=data.filter(function(item){
        console.log(item);
        return (item.snippet!=undefined);
      });
      return relatedVideoDataItems;
}

async function getRelatedVideos(videoId){
    let data=await getRelatedVideoData(videoId);
    console.log("getRelatedVideos",data)
    return data;
}





async function displayRelatedVideos(data,parent){
    parent.innerHTML="";
  
  let result=await data;
   console.log("f",result)
     result.map(function(element,index){
        const{snippet:{thumbnails : {high}}}=element;
        const{snippet:{title}}=element;
        const{snippet:{channelTitle}}=element;

        let card=document.createElement("div");
        card.id="related-video-box"

        let thumbnail=document.createElement("img");
        thumbnail.src=high.url;

        let details=document.createElement("div");

        let vTitle=document.createElement('p');
        vTitle.innerText=compressText(title);
        vTitle.id="thumb-title"

        let cTitle=document.createElement('p');
        cTitle.innerText=channelTitle;
        cTitle.id="channel-title"

        details.append(vTitle,cTitle);

        card.append(thumbnail,details);

        card.addEventListener("click",()=>{
            localStorage.setItem("yt-video-id",element.id.videoId);
            playSelectedVideo(element.id.videoId);
            let videoId=localStorage.getItem("yt-video-id");
            displayRelatedVideos(getRelatedVideos(videoId),related_video_container);

        });
        parent.append(card)
        
    });
}

function compressText(title){
    let str=title.substring(0, 40)+"...";
    return str;
}

