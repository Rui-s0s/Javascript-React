import { useState, useEffect } from 'react';

const API_BASE = '/api';

export function useYouTubeData() {
  const [playlists, setPlaylists] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [showChat, setShowChat] = useState(true);
  const [loading, setLoading] = useState(true);
  
  // Video Form State
  const [addingToPlaylist, setAddingToPlaylist] = useState(null);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoLink, setNewVideoLink] = useState('');
  const [step, setStep] = useState(1);

  // Playlist Form State
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [editingPlaylistId, setEditingPlaylistId] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const [expandedPlaylists, setExpandedPlaylists] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/data`);
      const data = await res.json();
      setPlaylists(data);
      if (data.length > 0 && !currentVideo) {
        const firstVideo = data[0].videos[0];
        if (firstVideo) setCurrentVideo(firstVideo);
      }
      setLoading(false);
    } catch (err) {
      console.error("Backend error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sync currentVideo whenever playlists change
  useEffect(() => {
    if (currentVideo) {
      const updatedVideo = playlists.flatMap(pl => pl.videos).find(v => v.id === currentVideo.id);
      if (updatedVideo && JSON.stringify(updatedVideo) !== JSON.stringify(currentVideo)) {
        setCurrentVideo(updatedVideo);
      }
    }
  }, [playlists]);

  const handleSendMessage = async (text) => {
    if (!currentVideo) return;
    const res = await fetch(`${API_BASE}/videos/${currentVideo.id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (res.ok) fetchData();
  };

  const handleLikeDislike = async (type) => {
    if (!currentVideo) return;
    const newLikes = type === 'like' ? currentVideo.likes + 1 : currentVideo.likes;
    const newDislikes = type === 'dislike' ? currentVideo.dislikes + 1 : currentVideo.dislikes;
    
    await fetch(`${API_BASE}/videos/${currentVideo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ likes: newLikes, dislikes: newDislikes })
    });
    fetchData();
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

  const handlePlaylistSubmit = async (e) => {
    if (e.key === 'Enter' && newPlaylistName.trim()) {
      const url = editingPlaylistId ? `${API_BASE}/playlists/${editingPlaylistId}` : `${API_BASE}/playlists`;
      const method = editingPlaylistId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newPlaylistName })
      });
      
      if (res.ok) {
        setIsCreatingPlaylist(false);
        setEditingPlaylistId(null);
        setNewPlaylistName('');
        fetchData();
      }
    } else if (e.key === 'Escape') {
      setIsCreatingPlaylist(false);
      setEditingPlaylistId(null);
      setNewPlaylistName('');
    }
  };

  const deletePlaylist = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Delete this playlist?")) {
      await fetch(`${API_BASE}/playlists/${id}`, { method: 'DELETE' });
      fetchData();
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

  const deleteVideo = async (e, playlistId, videoId) => {
    e.stopPropagation();
    if (window.confirm("Delete this video?")) {
      await fetch(`${API_BASE}/videos/${videoId}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const handleVideoSubmit = async (e, playlistId) => {
    if (e.key === 'Enter') {
      if (step === 1 && newVideoTitle.trim()) {
        setStep(2);
      } else if (step === 2 && newVideoLink.trim()) {
        const url = editingVideoId ? `${API_BASE}/videos/${editingVideoId}` : `${API_BASE}/playlists/${playlistId}/videos`;
        const method = editingVideoId ? 'PUT' : 'POST';
        
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newVideoTitle, link: newVideoLink })
        });

        if (res.ok) {
          setAddingToPlaylist(null);
          setEditingVideoId(null);
          setNewVideoTitle('');
          setNewVideoLink('');
          setStep(1);
          fetchData();
        }
      }
    } else if (e.key === 'Escape') {
      setAddingToPlaylist(null);
      setEditingVideoId(null);
      setStep(1);
    }
  };

  return {
    state: {
      playlists,
      currentVideo,
      showChat,
      loading,
      expandedPlaylists,
      addingToPlaylist,
      editingVideoId,
      newVideoTitle,
      newVideoLink,
      step,
      isCreatingPlaylist,
      editingPlaylistId,
      newPlaylistName
    },
    actions: {
      setShowChat,
      setNewVideoTitle,
      setNewVideoLink,
      setNewPlaylistName,
      setIsCreatingPlaylist,
      handleSendMessage,
      handleLikeDislike,
      selectVideo,
      togglePlaylist,
      handlePlaylistSubmit,
      deletePlaylist,
      startEditPlaylist,
      startAddingVideo,
      startEditVideo,
      deleteVideo,
      handleVideoSubmit
    }
  };
}
