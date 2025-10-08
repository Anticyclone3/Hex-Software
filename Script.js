
/*
  Playlist array - customize with your files.
  Put audio files in a "songs" folder next to this HTML OR set absolute/relative URLs.
*/
// ...existing code...
const playlist = [
  {src: 'songs/audio.mp3', title: 'Fantasy Beat', artist: 'Anticyclone'},
  {src: 'songs/Progressive Tech House(3).mp3', title: 'Night Drive', artist: 'Anticyclone'},
  {src: 'songs/Happy Birthday Song___ [5u4xTa3LR2U].mp3', title: 'We Are Forever', artist: 'Anticyclone'},
  // Add more: {src: 'songs/yourfile.mp3', title:'Song Title', artist:'Artist Name'}
];
// ...existing code...

// Create audio element (hidden)
const audio = new Audio();
audio.preload = 'metadata';
audio.volume = 0.8;

let currentIndex = 0;
let isPlaying = false;

// DOM refs
const playlistEl = document.getElementById('playlist');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const cover = document.getElementById('cover');
const playPauseBtn = document.getElementById('playPause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeEl = document.getElementById('volume');
const muteBtn = document.getElementById('muteBtn');

function formatTime(sec){
  if(!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec/60), s = Math.floor(sec%60);
  return `${m}:${s.toString().padStart(2,'0')}`;
}

function renderPlaylist(){
  playlistEl.innerHTML = '';
  playlist.forEach((t,i)=>{
    const track = document.createElement('div');
    track.className = 'track';
    track.dataset.index = i;
    track.setAttribute('role','button');
    track.innerHTML = `
      <div style="width:8px"></div>
      <div class="meta">
        <div class="title">${t.title}</div>
        <div class="artist">${t.artist}</div>
      </div>
      <div class="dur" id="dur-${i}">-:--</div>
    `;
    track.addEventListener('click',()=>selectTrack(i));
    playlistEl.appendChild(track);

    // Load metadata to show duration
    const temp = document.createElement('audio');
    temp.src = t.src;
    temp.preload = 'metadata';
    temp.addEventListener('loadedmetadata', () => {
      const el = document.getElementById(`dur-${i}`);
      if(el) el.textContent = formatTime(temp.duration);
    });
    temp.addEventListener('error', ()=> {
      const el = document.getElementById(`dur-${i}`);
      if(el) el.textContent = '—';
    });
  });
}

function highlightActive(){
  document.querySelectorAll('.track').forEach(el=>el.classList.remove('active'));
  const cur = document.querySelector(`.track[data-index="${currentIndex}"]`);
  if(cur) cur.classList.add('active');
}

function loadTrack(index){
  if(index < 0) index = playlist.length - 1;
  if(index >= playlist.length) index = 0;
  currentIndex = index;
  audio.src = playlist[currentIndex].src;
  audio.load();
  trackTitle.textContent = playlist[currentIndex].title;
  trackArtist.textContent = playlist[currentIndex].artist;
  cover.textContent = playlist[currentIndex].title.split(' ').slice(0,2).map(w=>w[0]).join('') || '♪';
  highlightActive();
}

// Play / Pause
function play(){
  audio.play().then(()=> {
    isPlaying = true;
    playPauseBtn.textContent = '⏸️';
  }).catch(err => {
    // autoplay or file issue
    console.warn('Play failed:', err);
  });
}
function pause(){
  audio.pause();
  isPlaying = false;
  playPauseBtn.textContent = '▶️';
}

// Select and play track
function selectTrack(i){
  loadTrack(i);
  play();
}

// Next / Prev
function nextTrack(){ loadTrack(currentIndex+1); play(); }
function prevTrack(){ loadTrack(currentIndex-1); play(); }

// Progress handling
audio.addEventListener('timeupdate', ()=>{
  const pct = (audio.currentTime / (audio.duration || 1)) * 100;
  progressBar.style.width = pct + '%';
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
});

progress.addEventListener('click', (e)=>{
  const rect = progress.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const pct = x / rect.width;
  audio.currentTime = pct * (audio.duration || 0);
});

// ended -> next
audio.addEventListener('ended', ()=> nextTrack());

// play/pause button
playPauseBtn.addEventListener('click', ()=>{
  if(!audio.src) loadTrack(0);
  if(isPlaying) pause(); else play();
});
prevBtn.addEventListener('click', ()=> prevTrack());
nextBtn.addEventListener('click', ()=> nextTrack());

// volume control
volumeEl.addEventListener('input', (e)=>{
  audio.volume = e.target.value;
  if(audio.volume === 0) muteBtn.textContent = '🔈'; else muteBtn.textContent = '🔊';
});
muteBtn.addEventListener('click', ()=>{
  if(audio.muted){ audio.muted = false; muteBtn.textContent = '🔊'; volumeEl.value = audio.volume; }
  else { audio.muted = true; muteBtn.textContent = '🔈'; volumeEl.value = 0; }
});

// Keyboard shortcuts (space play/pause, left/right skip)
document.addEventListener('keydown', (e)=>{
  if(e.code === 'Space'){ e.preventDefault(); if(isPlaying) pause(); else play(); }
  if(e.code === 'ArrowRight') nextTrack();
  if(e.code === 'ArrowLeft') prevTrack();
});

// initialize
renderPlaylist();
loadTrack(0);

