import { Navbar } from './components/Navbar.js';
import { VideoPlayer } from './components/VideoPlayer.js';
import { LiveChat } from './components/LiveChat.js';
import { PlaylistsContainer } from './components/Playlists/PlaylistsContainer.js';

import './index.css';
import './App.css';

// --- INITIAL DATA & PERSISTENCE ---
const INITIAL_DATA = [{
  id: 'pl1',
  name: 'My Awesome Playlist',
  videos: [{
    id: 'vid1',
    title: 'Building a YouTube Clone with Vanilla JS',
    link: 'https://youtube.com/watch?v=vanilla-js-tutorial',
    likes: 1200,
    dislikes: 42,
    messages: [{ id: 'msg1', user: 'User1', text: 'No React needed!' }]
  }]
}];

let state = {
  playlists: JSON.parse(localStorage.getItem('yt_clone_data')) || INITIAL_DATA,
  currentVideo: null,
  showChat: true,
  expandedPlaylists: [],
  isCreatingPlaylist: false,
  editingPlaylistId: null,
  newPlaylistName: '',
  addingToPlaylist: null,
  editingVideoId: null,
  newVideoTitle: '',
  newVideoLink: '',
  step: 1
};

// Initialize current video and expanded state
state.currentVideo = state.playlists[0]?.videos[0] || null;
state.expandedPlaylists = state.playlists[0] ? [state.playlists[0].id] : [];

// --- COMPONENT INSTANCES ---
let player = null;
let chat = null;
let playlistsUI = null;

const root = document.getElementById('app-root');

// --- THE UPDATE LOOP (The Engine) ---
function updateUI() {
  // Sync to LocalStorage
  localStorage.setItem('yt_clone_data', JSON.stringify(state.playlists));
  
  const mainLayout = document.querySelector('.main-layout');
  if (!mainLayout) return renderShell();

  // 1. Update Video Player
  if (state.currentVideo) {
    const playerProps = getPlayerProps();
    if (!player) {
      player = new VideoPlayer(playerProps);
      mainLayout.prepend(player.container);
    } else {
      player.update(playerProps);
    }
  } else if (player) {
    player.container.remove();
    player = null;
  }

  // 2. Update Live Chat
  if (state.showChat && state.currentVideo) {
    const messages = state.currentVideo.messages || [];
    if (!chat) {
      chat = new LiveChat(messages, handleSendMessage);
      mainLayout.appendChild(chat.container);
    } else {
      chat.updateMessages(messages);
    }
  } else if (chat) {
    chat.container.remove();
    chat = null;
  }

  // 3. Update Playlists
  if (playlistsUI) {
    playlistsUI.update(getPlaylistProps());
  }
}

// --- LOGIC HANDLERS ---

function handleSendMessage(text) {
  if (!state.currentVideo) return;
  const newMessage = { id: 'msg' + Date.now(), user: 'You', text };
  
  state.playlists = state.playlists.map(pl => ({
    ...pl,
    videos: pl.videos.map(v => v.id === state.currentVideo.id 
      ? { ...v, messages: [...(v.messages || []), newMessage] } : v)
  }));

  // Update reference for immediate UI feedback
  if (!state.currentVideo.messages) state.currentVideo.messages = [];
  state.currentVideo.messages.push(newMessage);
  
  updateUI();
}

function handleLikeDislike(type) {
  if (!state.currentVideo) return;
  
  if (type === 'like') state.currentVideo.likes++;
  else state.currentVideo.dislikes++;

  state.playlists = state.playlists.map(pl => ({
    ...pl,
    videos: pl.videos.map(v => v.id === state.currentVideo.id ? state.currentVideo : v)
  }));
  
  updateUI();
}

function handlePlaylistSubmit(e) {
  const value = e.target.value ? e.target.value.trim() : state.newPlaylistName.trim();

  if (e.key === 'Enter') {
    if (!value) return;

    if (state.editingPlaylistId) {
      state.playlists = state.playlists.map(pl => 
        pl.id === state.editingPlaylistId ? { ...pl, name: value } : pl
      );
      state.editingPlaylistId = null;
    } else {
      const newPl = { id: 'pl' + Date.now(), name: value, videos: [] };
      state.playlists.push(newPl);
      state.expandedPlaylists.push(newPl.id);
      state.isCreatingPlaylist = false;
    }
    state.newPlaylistName = '';
    updateUI();
  } else if (e.key === 'Escape') {
    state.isCreatingPlaylist = false;
    state.editingPlaylistId = null;
    state.newPlaylistName = '';
    updateUI();
  }
}

function handleVideoSubmit(e, playlistId) {
  const value = e.target.value.trim();
  
  if (e.key === 'Enter') {
    if (state.step === 1 && value) {
      state.newVideoTitle = value;
      state.step = 2;
      updateUI();
    } 
    else if (state.step === 2 && value) {
      state.newVideoLink = value;

      if (state.editingVideoId) {
        state.playlists = state.playlists.map(pl => 
          pl.id === playlistId ? {
            ...pl,
            videos: pl.videos.map(v => {
              if (v.id === state.editingVideoId) {
                const updated = { ...v, title: state.newVideoTitle, link: state.newVideoLink };
                if (state.currentVideo?.id === v.id) state.currentVideo = updated;
                return updated;
              }
              return v;
            })
          } : pl
        );
      } else {
        const newVideo = {
          id: 'vid' + Date.now(),
          title: state.newVideoTitle,
          link: state.newVideoLink,
          likes: 0,
          dislikes: 0,
          messages: []
        };
        state.playlists = state.playlists.map(pl => 
          pl.id === playlistId ? { ...pl, videos: [...pl.videos, newVideo] } : pl
        );
      }
      resetVideoForm();
      updateUI();
    }
  } else if (e.key === 'Escape') {
    resetVideoForm();
    updateUI();
  }
}

function resetVideoForm() {
  state.addingToPlaylist = null;
  state.editingVideoId = null;
  state.newVideoTitle = '';
  state.newVideoLink = '';
  state.step = 1;
}

// --- INITIAL SHELL RENDER ---
function renderShell() {
  root.innerHTML = `
    <div class="app-container">
      <div id="nav-target"></div>
      <main class="main-layout ${!state.showChat ? 'hide-chat' : ''}">
        <div id="playlists-target"></div>
      </main>
    </div>
  `;
  
  document.getElementById('nav-target').innerHTML = Navbar();
  
  playlistsUI = new PlaylistsContainer(getPlaylistProps());
  document.getElementById('playlists-target').appendChild(playlistsUI.container);
  
  updateUI();
}

// --- PROPS GENERATORS (The "State Selectors") ---

function getPlayerProps() {
  return {
    video: state.currentVideo,
    likes: state.currentVideo?.likes || 0,
    dislikes: state.currentVideo?.dislikes || 0,
    onLike: () => handleLikeDislike('like'),
    onDislike: () => handleLikeDislike('dislike'),
    showChat: state.showChat,
    onToggleChat: () => { state.showChat = !state.showChat; updateUI(); }
  };
}

function getPlaylistProps() {
  return {
    playlists: state.playlists,
    isCreating: state.isCreatingPlaylist,
    onStartCreate: () => { state.isCreatingPlaylist = true; updateUI(); },
    onPlaylistSubmit: handlePlaylistSubmit,
    newPlaylistName: state.newPlaylistName,
    onNewPlaylistNameChange: (val) => { state.newPlaylistName = val; },
    
    expandedPlaylists: state.expandedPlaylists,
    editingPlaylistId: state.editingPlaylistId,
    
    onTogglePlaylist: (id) => {
      state.expandedPlaylists = state.expandedPlaylists.includes(id) 
        ? state.expandedPlaylists.filter(p => p !== id) 
        : [...state.expandedPlaylists, id];
      updateUI();
    },
    onStartEditPlaylist: (e, pl) => {
      state.editingPlaylistId = pl.id;
      state.newPlaylistName = pl.name;
      updateUI();
    },
    onDeletePlaylist: (e, id) => {
      if (confirm("Delete playlist?")) {
        const deletedPlaylist = state.playlists.find(p => p.id === id);
        const currentVideoDeleted = deletedPlaylist?.videos.some(v => v.id === state.currentVideo?.id);
        
        state.playlists = state.playlists.filter(p => p.id !== id);
        if (currentVideoDeleted) state.currentVideo = null;
        updateUI();
      }
    },

    // Video Logic
    currentVideoId: state.currentVideo?.id,
    onSelectVideo: (video) => { state.currentVideo = video; updateUI(); window.scrollTo(0,0); },
    onStartAddVideo: (playlistId) => { 
      state.addingToPlaylist = playlistId; 
      state.step = 1; 
      updateUI(); 
    },
    onEditVideo: (e, plId, vid) => {
      state.addingToPlaylist = plId;
      state.editingVideoId = vid.id;
      state.newVideoTitle = vid.title;
      state.newVideoLink = vid.link;
      state.step = 1;
      updateUI();
    },
    onDeleteVideo: (e, plId, vidId) => {
      if (confirm("Delete video?")) {
        if (state.currentVideo?.id === vidId) state.currentVideo = null;
        state.playlists = state.playlists.map(pl => 
          pl.id === plId ? { ...pl, videos: pl.videos.filter(v => v.id !== vidId) } : pl
        );
        updateUI();
      }
    },
    onVideoSubmit: handleVideoSubmit,
    onNewVideoTitleChange: (val) => { state.newVideoTitle = val; },
    onNewVideoLinkChange: (val) => { state.newVideoLink = val; },

    // Video State
    addingToPlaylist: state.addingToPlaylist,
    step: state.step,
    newVideoTitle: state.newVideoTitle,
    newVideoLink: state.newVideoLink,
    editingVideoId: state.editingVideoId
  };
}

// Boot
renderShell();