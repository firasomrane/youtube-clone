// Your use of the YouTube API must comply with the Terms of Service:
// https://developers.google.com/youtube/terms
// Called automatically when JavaScript client library is loaded.
function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}
    
// Called automatically when YouTube API interface is loaded (see line 9).
function onYouTubeApiLoad() {
    // This API key is intended for use only in this lesson.
    // See https://goo.gl/PdPA1 to get a key for your own applications.
    gapi.client.setApiKey('AIzaSyBEyr7OoabGnG7Za8UJhjenRLySfSUj_cU');
    getDOMElements();
}



//global variables
let videoArray= [];
const defaultInput=["balti","faya","pat flayn","free code camp","crash course","al plateau",
"q6t4uj9e37g","CS Dojo","fun fun function" ,"domics","valuetainment"];
let mainVideoIndex= 0;
//listSet false when the images list in not set yet
let listSet= false;
//firstVideoPlayed true if the first video is set
let firstVideoPlayed= true;
//the previousVideoIndex
previousVideoIndex= 0;

//get the DOM elements onload
//window.onload= getDOMElements;
function getDOMElements(){
    searchField= document.getElementById('input');
    searchButton= document.querySelector('button[type="button"]');
    displyedVideo= document.querySelector('.displayedVideo');
    videoListUl= document.querySelector('.video-list ul');
    //console.log(videoListUl)

    setFirstVideos()
    //when the user want to search for something
    searchButton.addEventListener('click', getInputValue);
}

function setFirstVideos(){
    const randomNumber= Math.floor(Math.random()*defaultInput.length);
    //console.log(randomNumber);
    searchField.value= defaultInput[randomNumber];
    mainVideoIndex= 0;
    search(defaultInput[randomNumber]);
}

function createVideoiFrame(){
    const video = document.createElement('iframe');
    /* video.setAttribute('width', '85%');
    video.setAttribute('height', '420px'); */
    video.setAttribute('frameborder', '0');
    video.setAttribute('allow', 'autoplay; encrypted-media');
    video.setAttribute('allowfullscreen', 'true');
    return video;
}

function createImage(){
    const image = document.createElement('img');
    image.classList.add('video__image')
    return image;
}

//get the search ssearchField value
function getInputValue() {
    listSet= false;
    const queryText = searchField.value;
    search(queryText);
}

function search(queryValue) {
    //console.log(queryValue)
    // Use the JavaScript client library to create a search.list() API call.
    var request = gapi.client.youtube.search.list({
        part: 'snippet',
        maxResults: 6,
        q: queryValue,
        type: "video",
        videoEmbeddable: true
    });

    // Send the request to the API server,
    // and invoke onSearchRepsonse() with the response.
    request.execute(onSearchResponse);
}

// Called automatically with the response of the YouTube API request.
function onSearchResponse(response) {
    showResponse(response);
}

// Helper function to display JavaScript value on HTML page.
function showResponse(response) {
    videoArray= response.items;
    showMainVideo(mainVideoIndex);
    showSideVideos();
    /*const responseString = JSON.stringify(response.items, '', 2);
    document.getElementById('response').innerHTML += responseString;*/
}

//display the main video after the request done by the user
function showMainVideo(index) {
    const firstVideoObject= videoArray[index];
    const mainVideo= createVideoiFrame();
    const videoSrc = `https://www.youtube.com/embed/${firstVideoObject.id.videoId}?autoplay`;
    mainVideo.setAttribute('src', videoSrc);
    //console.log(mainVideo);
    displyedVideo.innerHTML = "";
    displyedVideo.appendChild(mainVideo);
    
    if(listSet && !firstVideoPlayed){
        addStatusImage();
    }

}

//display the images of the other videos in the right side
function showSideVideos() {
    const videosObject= videoArray;
    //console.log(videosObject);
    //console.log(videoListUl)
    videoListUl.innerHTML= '';
    //console.log(videoListUl);
    videosObject.forEach((video,index) =>{
        const videoImage= createImage();
        const listItem= document.createElement('li');
        listItem.classList.add('video-list__item');
        listItem.setAttribute('data-index',index);
        const div= document.createElement('div');
        let videoTitle= video.snippet.title.replace(/(([^\s]+\s\s*){14})(.*)/,"$1…");
        //console.log(videoTitle);
        div.textContent= videoTitle;
        div.setAttribute('data-index',index);
        //console.log(video)
        const imageSrc= video.snippet.thumbnails.default.url;
        //console.log(imageSrc);
        //console.log(videoImage)
        videoImage.src= imageSrc;
        videoImage.setAttribute('data-index',index);
        console.log(videoImage);
        //listItem.innerHTML= '';
        listItem.appendChild(videoImage);
        listItem.appendChild(div)
        //console.log(listItem);
        videoListUl.appendChild(listItem);
        //console.log(videoListUl);
        //return 1;
    })

    //set global variable indicating that the list is set
    listSet= true;
    
    //add the image indicating the video that is desplaying
    addStatusImage();

    //use the event delegation
    videoListUl.addEventListener('click',changeVideo);

    window.addEventListener('keydown',keyPressed);
}

//function that changes the video
function changeVideo(e){
    //indicate that no longer the first video is playing
    firstVideoPlayed= false;
    //console.log(e.target);
    if(e.target.hasAttribute('data-index')){
        //console.log(e.target);
        const targetVideoIndex= e.target.getAttribute('data-index');
        //change the video only if the chosen one is different to the current one
        if(targetVideoIndex !== mainVideoIndex){
            previousVideoIndex= mainVideoIndex;
            mainVideoIndex= e.target.getAttribute('data-index');
            //console.log(mainVideoIndex);
            showMainVideo(mainVideoIndex)
        }
        
    }
}

//function invoked when a key is pressed
function keyPressed(e){

}

function addStatusImage(){

    //if there is already a status image ===(firstVideoPlayed===false) remove it 
    if(!firstVideoPlayed){
        removeOldStatusImage();
    }
    const displayedListItem= document.querySelector(`li[data-index="${mainVideoIndex}"]`);
    const statusImage= document.createElement('img');
    statusImage.setAttribute('data-index',mainVideoIndex);
    statusImage.setAttribute('src','img/playing.png');
    statusImage.classList.add('video-list--status');
    displayedListItem.appendChild(statusImage);
}

function removeOldStatusImage(){
    const previousStatusImage= document.querySelector(`img.video-list--status`);
    previousStatusImage.parentElement.removeChild(previousStatusImage);
}