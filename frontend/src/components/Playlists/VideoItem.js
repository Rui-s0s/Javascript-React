export function VideoItem({ 
  video, 
  playlistId, 
  currentVideoId, 
  onSelect, 
  onEdit, 
  onDelete 
}) {
  // Logic for the background color
  const isActive = currentVideoId === video.id;
  const background = isActive ? '#3f3f3f' : 'transparent';

  // We return a string of HTML
  // Note: We use data-attributes to identify which video/playlist this belongs to
  return `
    <div 
      class="videoItem" 
      data-video-id="${video.id}" 
      data-playlist-id="${playlistId}"
      style="background: ${background};"
    >
      <div class="thumbnail"></div>
      <div class="videoInfo">
        <div class="video-title">
          ${video.title}
        </div>
        <div class="headerActions">
          <button class="iconBtn editBtn">✏️</button>
          <button class="iconBtn delete-btn">🗑️</button>
        </div>
      </div>
    </div>
  `;
}