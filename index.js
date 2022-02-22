import yt_clone_navbar from "./components/navbar.js";
import {getData} from "./scripts/getData.js";


const API_KEY="AIzaSyCoivpgeBqPbUO35P70SGhyDWNEAuUFrsc";



// navbar for home page
let yt_clone_navbar_div=document.getElementById("yt-home-navbar");
yt_clone_navbar_div.innerHTML=yt_clone_navbar();


//search functionality
let searchParam = document.getElementById("yt-seacrh");
searchParam.addEventListener("keypress", (e)=>{
      if(e.key==='Enter'){
          searchVideosByparam()
      }

   
  })

//navigate to home page on click logo
let logoIcon=document.querySelectorAll(".yt-logo");
logoIcon.forEach((element)=>{
    element.addEventListener('click',(e)=>{
        alert("clicked...");
        window.location.href="/index.html"
    });

})



// getting data of most popular videos
let mostPopularData=await getData(`https://youtube.googleapis.com/youtube/v3/videos?key=${API_KEY}&part=snippet&chart=mostPopular&regionCode=in&maxResults=20`);
let mostPopularDataItems=mostPopularData.items;
localStorage.setItem("mostPopularData",JSON.stringify(mostPopularData));
//console.log(mostPopularDataItems);
display_MostPopular_Videos_India(mostPopularDataItems);
display_MostPopular_Videos_India();


//displaying data of most popular videos on home page default
function display_MostPopular_Videos_India(data){
    console.log("data",data)
    data.forEach(element => {
        //console.log("element",element)

        const{snippet:{thumbnails : {high}}}=element;
        const{snippet:{localized : {title}}}=element;

        const{snippet:{channelTitle}}=element;

        let card=document.createElement("div");

        let thumbnail=document.createElement("img");
        thumbnail.src=high.url;

        let details=document.createElement("div");

        let cImage=document.createElement("img");
        cImage.id="channelImage"
        let cId=element.snippet.channelId;
        let channelImage=getChannelImage(cId)
        channelImage.then(function(res){
            cImage.src=res;
        })

        let title_div=document.createElement("div");
        let vTitle=document.createElement('p');
        vTitle.innerText=compressText(title);
        vTitle.id="thumb-title"
        

        let cTitle=document.createElement('p');
        cTitle.innerText=channelTitle;
        cTitle.id="channel-title"
      

        title_div.append(vTitle,cTitle);
       
        details.append(cImage,title_div);
        details.id="thumb-details";
       
        card.append(thumbnail,details);
        card.addEventListener("click",()=>{
            console.log("clciked")
            navigateToVideoPage(element.id);

        });
        document.getElementById("yt-video-container").append(card);
        
    });

}

//getting channel image using channelId

async function getChannelImage(channelId){
    let channelDetails=await getData(`https://youtube.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&channelId=${channelId}&type=channel`);
    let res=getImgUrl(channelDetails.items);
    return res;

}

function getImgUrl(data){

    let imgURL;
    data.forEach(element => {

        const{snippet:{thumbnails : {high:{url}}}}=element;
        imgURL=url;

    });
    return imgURL;

}
async function searchVideosByparam(){
    let searchQuery=document.getElementById("yt-seacrh").value;
    console.log("searchQuery",searchQuery);
        let searchData=await getData(`https://youtube.googleapis.com/youtube/v3/search?key=${API_KEY}&type=video&part=snippet&q=${searchQuery}&maxResults=20`);
        displaySearchVideos(searchData.items)
}


function displaySearchVideos(items){
    document.getElementById("yt-video-container").innerHTML="";
    items.forEach(element => {

        const{snippet:{thumbnails : {high}}}=element;

        let card=document.createElement("div");
        let image=document.createElement("img");
        image.src=high.url;
        card.append(image);

        card.addEventListener("click",()=>{
            navigateToVideoPage(element.id.videoId);

        });
        document.getElementById("yt-video-container").append(card);
        
    });
}


function navigateToVideoPage(videoId){
    localStorage.setItem("yt-video-id",videoId);
    window.location.href="/video.html";
    
}


function compressText(title){
    let str=title.substring(0, 61)+"...";
    return str;
}






