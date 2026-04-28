import React, { useState, useEffect, useRef } from 'react';
import styles from './LiveChat.module.css';

const LiveChat = ({ messages, onSendMessage }) => {
  const [localInput, setLocalInput] = useState('');
  const messagesEndRef = useRef(null);

  // Internal scroll logic that only affects this container
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages]);

  const handleSend = () => {
    if (localInput.trim()) {
      onSendMessage(localInput);
      setLocalInput('');
    }
  };

  return (
    <section className={styles.chatSection}>
      <div className={styles.header}>Live Chat</div>
      <div className={styles.messages}>
        {messages.map((msg) => (
          <div key={msg.id} className="message" style={{ marginBottom: '4px' }}>
            <strong className={styles.messageUser}>{msg.user}:</strong>
            <span style={{ fontSize: '0.95em' }}>{msg.text}</span>
          </div>
        ))}
        {/* Dummy div to anchor the scroll */}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputArea}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', background: '#cc0000', borderRadius: '50%', flexShrink: 0, fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Y</div>
          <input
            type="text"
            placeholder="Say something..."
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
        </div>
      </div>
    </section>
  );
};

export default LiveChat;
