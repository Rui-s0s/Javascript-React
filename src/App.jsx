import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const INITIAL_DATA = [
  {
    id: 'pl1',
    name: 'Frontend Development',
    videos: [
      {
        id: 1,
        title: '1. Building a YouTube Clone with React and CSS Grid',
        likes: 1200,
        dislikes: 42,
        messages: [{ id: 1, user: 'User1', text: 'Hello everyone!' }]
      }
    ]
  }
];

function App() {
  const [playlists, setPlaylists] = useState(INITIAL_DATA);
  const [currentVideo, setCurrentVideo] = useState(INITIAL_DATA[0].videos[0]);
  const [messages, setMessages] = useState(currentVideo.messages);
  const [likes, setLikes] = useState(currentVideo.likes);
  const [dislikes, setDislikes] = useState(currentVideo.dislikes);
  const [inputValue, setInputValue] = useState('');
  const [expandedPlaylists, setExpandedPlaylists] = useState(['pl1']);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    setMessages(currentVideo.messages);
    setLikes(currentVideo.likes);
    setDislikes(currentVideo.dislikes);
  }, [currentVideo]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      setMessages([...messages, { id: Date.now(), user: 'You', text: inputValue }]);
      setInputValue('');
    }
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

  const createPlaylist = () => {
    const name = prompt("Enter playlist name:");
    if (name) {
      const newPl = {
        id: 'pl' + Date.now(),
        name: name,
        videos: []
      };
      setPlaylists([...playlists, newPl]);
      setExpandedPlaylists([...expandedPlaylists, newPl.id]);
    }
  };

  const addVideo = (playlistId) => {
    const title = prompt("Enter video title:");
    if (title) {
      const newVideo = {
        id: Date.now(),
        title: title,
        likes: 0,
        dislikes: 0,
        messages: []
      };
      setPlaylists(playlists.map(pl => 
        pl.id === playlistId ? { ...pl, videos: [...pl.videos, newVideo] } : pl
      ));
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">
          <span>YT</span> Clone
        </div>
      </nav>

      <main className="main-layout">
        <section className="video-section">
          <div className="video-placeholder">
            <div style={{ textAlign: 'center' }}>
               ▶️ {currentVideo.title}
            </div>
          </div>
          <h1 className="video-title">{currentVideo.title}</h1>
          <div className="video-actions">
            <button className="action-btn" onClick={() => setLikes(likes + 1)}>
              👍 {likes.toLocaleString()}
            </button>
            <button className="action-btn" onClick={() => setDislikes(dislikes + 1)}>
              👎 {dislikes.toLocaleString()}
            </button>
            <button className="action-btn">↪️ Share</button>
          </div>
        </section>

        <section className="chat-section">
          <div className="chat-header">Live Chat</div>
          <div className="chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className="message">
                <strong style={{ color: '#aaa', marginRight: '8px' }}>{msg.user}:</strong>
                <span>{msg.text}</span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Chat..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleSendMessage}
            />
          </div>
        </section>

        <section className="description-section">
          <div className="playlists-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', color: '#fff', margin: 0 }}>Playlists</h3>
              <button 
                onClick={createPlaylist}
                style={{ background: '#cc0000', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
              >
                + New Playlist
              </button>
            </div>
            
            {playlists.map((playlist) => (
              <div key={playlist.id} style={{ marginBottom: '15px' }}>
                <div 
                  onClick={() => togglePlaylist(playlist.id)}
                  style={{ 
                    background: '#333', 
                    padding: '10px', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 'bold',
                    marginBottom: '8px'
                  }}
                >
                  {playlist.name}
                  <span>{expandedPlaylists.includes(playlist.id) ? '▼' : '▶'}</span>
                </div>
                
                {expandedPlaylists.includes(playlist.id) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '10px' }}>
                    {playlist.videos.map((video) => (
                      <div 
                        key={video.id} 
                        onClick={() => selectVideo(video)}
                        style={{ 
                          display: 'flex', 
                          gap: '12px', 
                          cursor: 'pointer',
                          padding: '6px',
                          borderRadius: '6px',
                          background: currentVideo.id === video.id ? '#3f3f3f' : 'transparent',
                          border: '1px solid #444'
                        }}
                      >
                        <div style={{ width: '80px', height: '45px', background: '#000', borderRadius: '4px', flexShrink: 0 }} />
                        <div style={{ overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                          <div style={{ fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {video.title}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={(e) => { e.stopPropagation(); addVideo(playlist.id); }}
                      style={{ background: 'transparent', color: '#aaa', border: '1px dashed #555', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', marginTop: '4px' }}
                    >
                      + Add Video to {playlist.name}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
