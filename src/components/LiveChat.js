import './LiveChat.css';

export class LiveChat {
  constructor(messages, onSendMessage) {
    this.messages = messages;
    this.onSendMessage = onSendMessage;
    this.container = document.createElement('section');
    this.container.className = 'chatSection';
    
    this.render();
  }

  // Equivalent to handleSend
  handleSend() {
    const input = this.container.querySelector('input');
    const text = input.value.trim();
    if (text) {
      this.onSendMessage(text);
      input.value = ''; // Reset input
    }
  }

  // Equivalent to useEffect (Auto-scroll)
  scrollToBottom() {
  // Change '.messages-container' to '.messages' to match your HTML string
  const messagesDiv = this.container.querySelector('.messages'); 
  if (messagesDiv) {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
}

  // This replaces your JSX
  render() {
    this.container.innerHTML = `
      <div class="header">Live Chat</div> <div class="messages">             ${this.messages.map(msg => `
          <div class="message" style="margin-bottom: 4px;">
            <strong class="messageUser">${msg.user}:</strong> <span style="font-size: 0.95em;">${msg.text}</span>
          </div>
        `).join('')}
      </div>
      <div class="inputArea">            <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 24px; height: 24px; background: #cc0000; border-radius: 50%; flex-shrink: 0; font-size: 10px; display: flex; align-items: center; justify-content: center;">Y</div>
          <input type="text" placeholder="Say something...">
        </div>
      </div>
    `;

    // Re-attach Event Listeners (React does this automatically, we do it manually)
    const input = this.container.querySelector('input');
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleSend();
    });

    this.scrollToBottom();
  }

  // Method to update the chat when new messages arrive
  updateMessages(newMessages) {
    this.messages = newMessages;
    this.render(); // Re-render the internal HTML
  }
}
