var videos = [];
const videoContainer = document.getElementById('videoContainer');
const videoUrlInput = document.getElementById('videoUrlInput');
const addVideoButton = document.getElementById('addVideoButton');
const intervalInput = document.getElementById('intervalInput');
const fadeTimeInput = document.getElementById('fadeTimeInput');
const maxFadeTimeInput = document.getElementById('maxFadeTimeInput');
const maxVideosInput = document.getElementById('maxVideosInput');
const toggleButton = document.getElementById('toggleButton');
const demoButton = document.getElementById('demoButton');
const maxMorphTime = 120;
const maxMinFadeTime = 120;
const maxMaxFadeTime = 120;
videoContainer.rot = 0;
let intervalId = null; // To store the interval ID
var lastTimestamp = 0;
var playlist ="";
var plVideo;

toggleButton.addEventListener('click', () => {
	if (intervalId) {
		clearInterval(intervalId);
		intervalId = null;
		toggleButton.textContent = 'Start Morph';
	}else {
		intervalId = setTimeout(randomMuteToggle,
		getInterval());
		toggleButton.textContent = 'Stop Morph';
	}
});

demoButton.addEventListener('click', () => {
	videoUrlInput.value = "https://www.youtube.com/watch?v=8V71sATDTqs&list=PLDQQ04vXUMwG1t21kOfpNl_IMR4WncHBT&index=3";
	addVideoButton.click();
})

intervalInput.addEventListener('input', () => {
  intervalInput.labels[0].textContent = `Morph time: ${inputString(intervalInput.value,maxMorphTime)} s`;
});

fadeTimeInput.addEventListener('input', () => {
	fadeTimeInput.labels[0].textContent = `Min Fade Time: ${inputString(fadeTimeInput.value,maxMinFadeTime)} s`;
	if(inputScale(fadeTimeInput.value,maxMinFadeTime) > inputScale(maxFadeTimeInput.value,maxMaxFadeTime)){ //aww fuck this is weird
		maxFadeTimeInput.value = fadeTimeInput.value;
		maxFadeTimeInput.labels[0].textContent = `Max Fade Time: ${inputString(maxFadeTimeInput.value,maxMaxFadeTime)} s`;
	}
});

maxFadeTimeInput.addEventListener('input', () => {
  maxFadeTimeInput.labels[0].textContent = `Max Fade Time: ${inputString(maxFadeTimeInput.value,maxMaxFadeTime)} s`;
	if(fadeTimeInput.value > maxFadeTimeInput.value){
		fadeTimeInput.value = maxFadeTimeInput.value;
		fadeTimeInput.labels[0].textContent = `Min Fade Time: ${inputString(fadeTimeInput.value,maxMinFadeTime)} s`;
	}
});

maxVideosInput.addEventListener('input', () => {
  maxVideosInput.labels[0].textContent = `Max Videos: ${Math.floor(maxVideosInput.value)}/${videos.length}`;
});

function inputScale(input,max){
	return scalequad(parseFloat(input))*max;
}

function inputString(input,max){
	const value = scalequad(parseFloat(input))*max;
	const string = value >= 10 && value <100 ?
	String(value).slice(0,2):
	String(value).slice(0,3);
	return string;
}

addVideoButton.addEventListener('click', () => {
	const url = videoUrlInput.value;
	const videoId = extractVideoIdFromUrl(url);
	//player.loadPlaylist({listType:"playlist",
			//list:"PLvQ0E7VVVRcsMOBlNlaOI8-m1CzKixofE",
			//})

	if (videoId) {
	//move this stuff around!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//move stuff to create video function
		//var liteYtEmbed = createVideo(videoId[0]);
			//create video funciton
		let liteYtEmbed = document.createElement('lite-youtube');
		liteYtEmbed.setAttribute('videoid', videoId[0]);
		liteYtEmbed.setAttribute('js-api', '');
		liteYtEmbed.setAttribute('params', `${videoId.length > 1 ? `listType=playlist&list=${videoId[1]}&`: `playlist=${videoId[0]}&`}loop=1&autoplay=0&controls=1&enablejsapi=1&fs=0&iv_load_policy=3`);
		//listType=playlist&list=${videoId[0]}&
		videoContainer.appendChild(liteYtEmbed);
		
		var playlistArray = [];
		//debugger;
		
			(async () => { //make player function
				try {
					//liteYtEmbed.needsYTApi = true;
					liteYtEmbed.player = await liteYtEmbed.getYTPlayer();
					liteYtEmbed.volumeChangeRate =  0; //volume per ms
						liteYtEmbed.floatVolume = 0;
						liteYtEmbed.player.setVolume(1);
						liteYtEmbed.volumeChangeRate =  15;
						liteYtEmbed.transVars = [0,0,0];
						liteYtEmbed.mute = false;
						videos.push(liteYtEmbed);
					
					
					playlistArray = liteYtEmbed.player.getPlaylist();
					console.log(playlistArray);
	
				} catch (error) {
					console.error('Error getting YouTube player with playlist:', error);
					return;
					// Handle the error appropriately (e.g., show a message to the user)
				}	
				if(playlistArray != null && playlistArray.length > 1){
					(async()=>{
						for (let id of playlistArray){
							let liteYtEmbed = document.createElement('lite-youtube');
							liteYtEmbed.setAttribute('videoid', id);
							liteYtEmbed.setAttribute('js-api', '');
							liteYtEmbed.setAttribute('params', `playlist=${id}&loop=1&autoplay=1&controls=1&enablejsapi=1&fs=0&iv_load_policy=3`);
							//liteYtEmbed.needsYTApi = true;
							videoContainer.appendChild(liteYtEmbed);
							try {
								liteYtEmbed.player = await liteYtEmbed.getYTPlayer();
								liteYtEmbed.volumeChangeRate =  15; //volume per ms
								liteYtEmbed.floatVolume = 1;
								liteYtEmbed.player.setVolume(1);
								liteYtEmbed.transVars = [0,0,0];
								liteYtEmbed.mute = false;
								liteYtEmbed.hue = 0;
								liteYtEmbed.style.backgroundImage = "";
								videos.push(liteYtEmbed);
								
							} 
							catch (error) {
								console.error('Error getting YouTube player:', error);
								// Handle the error appropriately (e.g., show a message to the user)
							}
					}
					maxVideosInput.max = videos.length;
					maxVideosInput.labels[0].textContent = `Max2 Videos: ${maxVideosInput.value}/${videos.length}`;
				})();
				liteYtEmbed.remove();
				videos.splice(videos.indexOf(liteYtEmbed),1);
				
			}
			else{
				maxVideosInput.max = videos.length;
				maxVideosInput.labels[0].textContent = `Max2 Videos: ${maxVideosInput.value}/${videos.length}`;}
			})();
			//liteYtEmbed.remove();
			
		videoUrlInput.value = ''; // Clear the input field
		
	} 
	
	else {
		alert('Invalid YouTube URL. Please enter a valid URL.');
	}
});

function makePlaylist(video,playlist){

	console.log(`THE THING IS: ${playlist}`);
	video.player.loadPlaylist({listType:"playlist",
	list:playlist});
	let playlistArray = video.player.getPlaylist();
}

function createVideo(videoId){
	let liteYtEmbed = document.createElement('lite-youtube');
		liteYtEmbed.setAttribute('videoid', videoId);
		liteYtEmbed.setAttribute('js-api', '');
		liteYtEmbed.setAttribute('params', `playlist=${videoId}&loop=1&autoplay=1&controls=1&enablejsapi=1&fs=0&iv_load_policy=3`);
		return liteYtEmbed;
}


videoUrlInput.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
	addVideoButton.click(); // Simulate a button click
	}
});

//function extractVideoIdFromUrl(url) {
	//const regExp = /\?v=([a-zA-Z0-9_-]{11})/; 
	//const match = url.match(regExp);
	//return (match && match[1]) ? match[1] : false; 
//}

//(async () => {
			//try {
				//liteYtEmbed.player = await liteYtEmbed.getYTPlayer();
				//liteYtEmbed.volumeChangeRate =  0; //volume per ms
				//liteYtEmbed.floatVolume = 0;
				//liteYtEmbed.player.setVolume(1);
				//liteYtEmbed.transVars = [0,0,0];
				//liteYtEmbed.mute = false;
				//videos.push(liteYtEmbed); 
			//} catch (error) {
				//console.error('Error getting YouTube player:', error);
				// Handle the error appropriately (e.g., show a message to the user)
			//}
		//})();
		
		//videos.push(liteYtEmbed);
		//debugger;

function extractVideoIdFromUrl(url) {
	const videoRegExp = /\?v=([a-zA-Z0-9_-]{11})/;
	const playlistRegExp = /(?:list=|\b)(PL[a-zA-Z0-9_-]+)/;

	const videoMatch = url.match(videoRegExp);
	const playlistMatch = url.match(playlistRegExp);

	if (videoMatch && playlistMatch) {
		return [videoMatch[1], playlistMatch[1]]; // Both video ID and playlist ID
	} else if (videoMatch) {
		return [videoMatch[1]]; // Only video ID
	} else if (playlistMatch) {
		return ["qeCLsIvxCN0", playlistMatch[1]]; // playlist ID with placeholder video ID
	} else {
		return false; // Invalid URL
	}
}



function getInterval() {
	const baseInterval = inputScale(intervalInput.value,maxMorphTime) * 1000; // Convert seconds to milliseconds
	const randomMultiplier = 0.5 + Math.random() * 1.5; // Random number between 0.5 and 2
	return baseInterval * randomMultiplier;
}

function randomMuteToggle() {
	const numVideosToMute = videos.length - maxVideosInput.value; 
	let mutedCount = 0;
	for (const video of videos) {
			video.mute = false;
		}

	while (mutedCount < numVideosToMute) {
		const randomIndex = Math.floor(Math.random() * videos.length);
			if(!videos[randomIndex].mute){
				videos[randomIndex].mute = true;
				mutedCount++;
			}
		}
	intervalId = setTimeout(randomMuteToggle, getInterval());
}


function animateAllVolumes(timestamp) {
	const time = timestamp - lastTimestamp;
	const fadeTime = inputScale(fadeTimeInput.value,maxMinFadeTime);
	const maxFadeTime = inputScale(maxFadeTimeInput.value,maxMaxFadeTime);
	lastTimestamp = timestamp;
	//videoContainer.rot += time*Math.random()/6000;
	//videoContainer.style.rotate = `${videoContainer.rot}turn`;

videos.forEach(video => {
	if (video.player) {
		
			video.floatVolume += (video.volumeChangeRate * time) ;

			// IF floatvolume is zero or so
			if (video.floatVolume <= 0) {
				video.floatVolume = 0;
				if(video.player.getPlayerState() == -1){
				video.remove();
				videos.splice(videos.indexOf(video),1);
				return;
				}
				if(video.mute){ //take it out if muted.
					video.player.pauseVideo();
					if(video.style.display != "none"){
						video.style.display = "none"}
				return;
				}
				if(!video.mute && video.style.display == "none"){ //add it back in if not muted.
					video.style.display = "block";
					video.style.maxWidth = "100vw"
					video.player.playVideo()
				}
				// Reverse direction
				video.volumeChangeRate =  100/((fadeTime + scaleexp(Math.random()) * maxFadeTime)*1000);
				video.player.setPlaybackRate(0.1+Math.random()*1.5);
				video.transVars = [Math.random(),Math.random()*20,Math.random()*20];
				
				video.style.transform = `skew(${(Math.random()-0.5)*60}deg, ${(Math.random()-0.5)*60}deg)`;
				//video.style.rotate = `${Math.random()}turn`;
				
				video.hue = 360*Math.random();
				video.style.animationDuration=`${30+Math.random()*60}s`;
				video.style.animationDelay = `-${Math.random() * parseFloat(video.style.animationDuration)}s`;
			} else if (video.floatVolume >= 100) {
				//video.transVars = [Math.random(),Math.random()*20,Math.random()*20];
				video.floatVolume = 100;
				video.volumeChangeRate =  -100/((fadeTime + scaleexp(Math.random()) * maxFadeTime)*1000);
			}
			
			video.player.setVolume(Math.floor(video.floatVolume));
			video.style.opacity = scalelog(video.floatVolume / 100);
			if(video.mute){
				video.style.maxWidth = `${scalelog(video.floatVolume / 100)*100}vw`;
				//video.style.maxHeight = `${scalelog(video.floatVolume / 100)*100}%`;
			}
			video.style.scale = scalelog(video.floatVolume/100*.5+0.5);
			video.style.webkitFilter = `hue-rotate(${video.hue}deg) blur(${30-video.floatVolume}px`;
			 `)`
			//video.style.translate = `${video.transVars[1]*video.floatVolume/100}px ${video.transVars[2]*video.floatVolume/100}px`;
	}
});

requestAnimationFrame(animateAllVolumes); 
}

function scalelog(x){
return 2 * x - (x*x);
}

function scaleexp(x) {
return (x + x*x)/2;
}
function scalequad(x){
return x*x;
}

requestAnimationFrame(animateAllVolumes);
