import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const PLAYLIST = [
  {
    id: 1,
    title: '1. Building a YouTube Clone with React and CSS Grid',
    description: 'In this video, we explore how to use CSS Grid to create complex layouts like YouTube. We\'ll cover grid-column, grid-row, and responsive design patterns.',
    views: '1,200,432',
    time: '2 hours ago',
    likes: 1200,
    dislikes: 42,
    messages: [
      { id: 1, user: 'User1', text: 'Hello everyone!' },
      { id: 2, user: 'DevGemini', text: 'This layout looks great!' },
      { id: 3, user: 'User2', text: 'Is this React?' },
    ]
  },
  {
    id: 2,
    title: '2. Mastering Flexbox for Modern Web Design',
    description: 'Flexbox is essential for one-dimensional layouts. Learn how to align items, justify content, and handle wrapping like a pro.',
    views: '850,000',
    time: '1 day ago',
    likes: 8500,
    dislikes: 120,
    messages: [
      { id: 1, user: 'FlexFan', text: 'Flexbox changed my life.' },
      { id: 2, user: 'CSS_Wizard', text: 'Grid + Flexbox is the way to go.' },
    ]
  },
  {
    id: 3,
    title: '3. Advanced State Management in React',
    description: 'Dive deep into hooks, context API, and when to reach for external libraries like Redux or Zustand.',
    views: '45,210',
    time: '5 mins ago',
    likes: 450,
    dislikes: 5,
    messages: [
      { id: 1, user: 'StateMaster', text: 'Hooks are so much cleaner.' },
      { id: 2, user: 'Newbie', text: 'This is a bit hard to follow but useful!' },
    ]
  }
];

function App() {
  const [currentVideo, setCurrentVideo] = useState(PLAYLIST[0]);
  const [messages, setMessages] = useState(PLAYLIST[0].messages);
  const [likes, setLikes] = useState(PLAYLIST[0].likes);
  const [dislikes, setDislikes] = useState(PLAYLIST[0].dislikes);
  const [inputValue, setInputValue] = useState('');
  
  const chatEndRef = useRef(null);

  // Update local state when currentVideo changes
  useEffect(() => {
    setMessages(currentVideo.messages);
    setLikes(currentVideo.likes);
    setDislikes(currentVideo.dislikes);
  }, [currentVideo]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
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
               ▶️ Now Playing: {currentVideo.title}
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
            <button className="action-btn">⬇️ Download</button>
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
          <div className="description-content">
            <strong>{currentVideo.views} views • {currentVideo.time}</strong>
            <p style={{ marginTop: '12px', borderBottom: '1px solid #444', paddingBottom: '16px' }}>
              {currentVideo.description}
            </p>
            
            <div className="playlist-area" style={{ marginTop: '20px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#fff' }}>Playlist</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {PLAYLIST.map((video) => (
                  <div 
                    key={video.id} 
                    onClick={() => selectVideo(video)}
                    style={{ 
                      display: 'flex', 
                      gap: '12px', 
                      cursor: 'pointer',
                      padding: '8px',
                      borderRadius: '8px',
                      background: currentVideo.id === video.id ? '#3f3f3f' : 'transparent',
                      border: '1px solid #444'
                    }}
                    className="playlist-item"
                  >
                    <div style={{ width: '120px', height: '67px', background: '#000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                      Thumbnail {video.id}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>{video.title}</div>
                      <div style={{ fontSize: '12px', color: '#aaa' }}>{video.views} views</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
