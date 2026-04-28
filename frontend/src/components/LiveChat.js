import './LiveChat.css';

export class LiveChat {
  constructor(comments, onSendMessage, username, onSetUsername) {
    this.comments = comments || [];
    this.onSendMessage = onSendMessage;
    this.username = username;
    this.onSetUsername = onSetUsername;
    this.container = document.createElement('section');
    this.container.className = 'chatSection';
    
    this.render();
  }

  // Equivalent to handleSend
  handleSend() {
    const input = this.container.querySelector('input');
    const text = input.value.trim();
    if (!text) return;

    if (!this.username) {
      this.onSetUsername(text);
    } else {
      this.onSendMessage(text);
      input.value = ''; // Reset input
    }
  }

  // Equivalent to useEffect (Auto-scroll)
  scrollToBottom() {
    const messagesDiv = this.container.querySelector('.messages'); 
    if (messagesDiv) {
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  }

  // This replaces your JSX
  render() {
    const isSettingUsername = !this.username;

    this.container.innerHTML = `
      <div class="header">Live Chat</div>
      <div class="messages">
        ${this.comments.map(cmt => `
          <div class="message" style="margin-bottom: 4px;">
            <strong class="messageUser">${cmt.author}:</strong> <span style="font-size: 0.95em;">${cmt.text}</span>
          </div>
        `).join('')}
      </div>
      <div class="inputArea">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 24px; height: 24px; background: ${isSettingUsername ? '#555' : '#cc0000'}; border-radius: 50%; flex-shrink: 0; font-size: 10px; display: flex; align-items: center; justify-content: center; color: white;">
            ${isSettingUsername ? '?' : this.username.charAt(0).toUpperCase()}
          </div>
          <input type="text" 
                 placeholder="${isSettingUsername ? 'Enter username to chat...' : 'Say something...'}"
                 value="">
        </div>
      </div>
    `;

    // Re-attach Event Listeners
    const input = this.container.querySelector('input');
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleSend();
    });

    // Auto-focus if setting username
    if (isSettingUsername) {
      setTimeout(() => input.focus(), 0);
    }

    this.scrollToBottom();
  }

  // Method to update the chat when new messages or username arrive
  update(newComments, newUsername) {
    this.comments = newComments || [];
    this.username = newUsername;
    this.render();
  }
}
