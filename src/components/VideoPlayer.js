import './VideoPlayer.css';

export class VideoPlayer {
  constructor(props) {
    // props = { video, likes, dislikes, onLike, onDislike, showChat, onToggleChat }
    this.props = props;
    this.container = document.createElement('section');
    this.container.className = 'videoSection'; // video-section
    
    this.render();
  }

  // Logic: Copy to clipboard
  handleShare() {
    if (this.props.video?.link) {
      navigator.clipboard.writeText(this.props.video.link)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Failed to copy: ', err));
    }
  }

  // Method to update the component when data changes
  update(newProps) {
    this.props = { ...this.props, ...newProps };
    this.render();
  }

  render() {
    const { video, likes, dislikes, showChat } = this.props;

    this.container.innerHTML = `
      <div class="video-placeholder">
        <div class="placeholderContent">
          <div class="playIcon">▶️</div>
          <div class="nowPlaying">${video.title}</div>
          <div class="videoLink">${video.link}</div>
        </div>
      </div>
      <h1 class="video-title">${video.title}</h1>
      
      <div class="actions">
        <button class="actionBtn" id="like-btn">
          👍 ${likes.toLocaleString()}
        </button>
        <button class="actionBtn" id="dislike-btn">
          👎 ${dislikes.toLocaleString()}
        </button>
        <button class="actionBtn" id="share-btn">
          ↪️ Share
        </button>
        <button class="actionBtn" id="toggle-chat-btn">
          ${showChat ? '❌ Hide Chat' : '💬 Show Chat'}
        </button>
      </div>
    `;

    // Manual Event Binding
    this.container.querySelector('#like-btn').onclick = this.props.onLike;
    this.container.querySelector('#dislike-btn').onclick = this.props.onDislike;
    this.container.querySelector('#share-btn').onclick = () => this.handleShare();
    this.container.querySelector('#toggle-chat-btn').onclick = this.props.onToggleChat;
  }
}