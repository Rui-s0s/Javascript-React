import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import VideoPlayer from './components/VideoPlayer';
import PlaylistsContainer from './components/Playlists/PlaylistsContainer';

const INITIAL_DATA = [
  {
    id: 'pl1',
    name: 'My Awesome Playlist',
    videos: [
      {
        id: 'vid1',
        title: 'Building a YouTube Clone with React',
        link: 'https://youtube.com/watch?v=clone-tutorial',
        likes: 1200,
        dislikes: 42
      }
    ]
  }
];

function App() {
  const [playlists, setPlaylists] = useState(() => {
    const saved = localStorage.getItem('yt_clone_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [currentVideo, setCurrentVideo] = useState(playlists[0]?.videos[0] || null);
  
  const [addingToPlaylist, setAddingToPlaylist] = useState(null);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoLink, setNewVideoLink] = useState('');
  const [step, setStep] = useState(1);

  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [editingPlaylistId, setEditingPlaylistId] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  useEffect(() => {
    localStorage.setItem('yt_clone_data', JSON.stringify(playlists));
  }, [playlists]);

  const handleLikeDislike = (type) => {
    if (!currentVideo) return;
    const newLikes = type === 'like' ? currentVideo.likes + 1 : currentVideo.likes;
    const newDislikes = type === 'dislike' ? currentVideo.dislikes + 1 : currentVideo.dislikes;
    
    const updatedVideo = { ...currentVideo, likes: newLikes, dislikes: newDislikes };
    setCurrentVideo(updatedVideo);

    setPlaylists(playlists.map(pl => ({
      ...pl,
      videos: pl.videos.map(v => v.id === currentVideo.id ? updatedVideo : v)
    })));
  };

  const selectVideo = (video) => {
    setCurrentVideo(video);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const togglePlaylist = (id) => {
    setExpandedPlaylists(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };
  
  const [expandedPlaylists, setExpandedPlaylists] = useState([playlists[0]?.id]);

  const handlePlaylistSubmit = (e) => {
    if (e.key === 'Enter' && newPlaylistName.trim()) {
      if (editingPlaylistId) {
        setPlaylists(playlists.map(pl => 
          pl.id === editingPlaylistId ? { ...pl, name: newPlaylistName } : pl
        ));
        setEditingPlaylistId(null);
      } else {
        const newPl = { id: 'pl' + Date.now(), name: newPlaylistName, videos: [] };
        setPlaylists([...playlists, newPl]);
        setExpandedPlaylists([...expandedPlaylists, newPl.id]);
        setIsCreatingPlaylist(false);
      }
      setNewPlaylistName('');
    } else if (e.key === 'Escape') {
      setIsCreatingPlaylist(false);
      setEditingPlaylistId(null);
      setNewPlaylistName('');
    }
  };

  const deletePlaylist = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Delete this playlist?")) {
      const newPlaylists = playlists.filter(pl => pl.id !== id);
      setPlaylists(newPlaylists);
      if (currentVideo && !newPlaylists.some(pl => pl.videos.some(v => v.id === currentVideo.id))) {
        setCurrentVideo(newPlaylists[0]?.videos[0] || null);
      }
    }
  };

  const startEditPlaylist = (e, pl) => {
    e.stopPropagation();
    setEditingPlaylistId(pl.id);
    setNewPlaylistName(pl.name);
  };

  const startAddingVideo = (playlistId) => {
    setAddingToPlaylist(playlistId);
    setEditingVideoId(null);
    setStep(1);
    setNewVideoTitle('');
    setNewVideoLink('');
  };

  const startEditVideo = (e, playlistId, video) => {
    e.stopPropagation();
    setAddingToPlaylist(playlistId);
    setEditingVideoId(video.id);
    setNewVideoTitle(video.title);
    setNewVideoLink(video.link);
    setStep(1);
  };

  const deleteVideo = (e, playlistId, videoId) => {
    e.stopPropagation();
    if (window.confirm("Delete this video?")) {
      const updatedPlaylists = playlists.map(pl => 
        pl.id === playlistId 
          ? { ...pl, videos: pl.videos.filter(v => v.id !== videoId) } 
          : pl
      );
      setPlaylists(updatedPlaylists);
      if (currentVideo?.id === videoId) {
        setCurrentVideo(updatedPlaylists[0]?.videos[0] || null);
      }
    }
  };

  const handleVideoSubmit = (e, playlistId) => {
    if (e.key === 'Enter') {
      if (step === 1 && newVideoTitle.trim()) {
        setStep(2);
      } else if (step === 2 && newVideoLink.trim()) {
        if (editingVideoId) {
          setPlaylists(playlists.map(pl => 
            pl.id === playlistId ? {
              ...pl,
              videos: pl.videos.map(v => v.id === editingVideoId ? { ...v, title: newVideoTitle, link: newVideoLink } : v)
            } : pl
          ));
        } else {
          const newVideo = {
            id: 'vid' + Date.now(),
            title: newVideoTitle,
            link: newVideoLink,
            likes: 0,
            dislikes: 0
          };
          setPlaylists(playlists.map(pl => 
            pl.id === playlistId ? { ...pl, videos: [...pl.videos, newVideo] } : pl
          ));
        }
        setAddingToPlaylist(null);
        setEditingVideoId(null);
        setNewVideoTitle('');
        setNewVideoLink('');
        setStep(1);
      }
    } else if (e.key === 'Escape') {
      setAddingToPlaylist(null);
      setEditingVideoId(null);
      setStep(1);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-layout hide-chat">
        {currentVideo ? (
          <VideoPlayer 
            video={currentVideo}
            likes={currentVideo.likes}
            dislikes={currentVideo.dislikes}
            onLike={() => handleLikeDislike('like')}
            onDislike={() => handleLikeDislike('dislike')}
          />
        ) : (
          <div style={{ color: '#aaa', padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
            <h2>No videos found</h2>
            <p>Create a playlist and add a video to get started!</p>
          </div>
        )}

        <PlaylistsContainer 
          playlists={playlists}
          isCreating={isCreatingPlaylist}
          onStartCreate={() => setIsCreatingPlaylist(true)}
          newPlaylistName={newPlaylistName}
          onNewPlaylistNameChange={setNewPlaylistName}
          onPlaylistSubmit={handlePlaylistSubmit}
          expandedPlaylists={expandedPlaylists}
          editingPlaylistId={editingPlaylistId}
          onTogglePlaylist={togglePlaylist}
          onStartEditPlaylist={startEditPlaylist}
          onDeletePlaylist={deletePlaylist}
          currentVideoId={currentVideo?.id}
          onSelectVideo={selectVideo}
          onStartAddVideo={startAddingVideo}
          onEditVideo={startEditVideo}
          onDeleteVideo={deleteVideo}
          addingToPlaylist={addingToPlaylist}
          step={step}
          newVideoTitle={newVideoTitle}
          newVideoLink={newVideoLink}
          onNewVideoTitleChange={setNewVideoTitle}
          onNewVideoLinkChange={setNewVideoLink}
          onVideoSubmit={handleVideoSubmit}
          editingVideoId={editingVideoId}
        />
      </main>
    </div>
  );
}

export default App;
