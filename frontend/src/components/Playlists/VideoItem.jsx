import React from 'react';
import styles from './Playlists.module.css';

const VideoItem = ({ 
  video, 
  playlistId, 
  currentVideoId, 
  onSelect, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div 
      onClick={() => onSelect(video)}
      className={styles.videoItem}
      style={{ 
        background: currentVideoId === video.id ? '#3f3f3f' : 'transparent',
      }}
    >
      <div className={styles.thumbnail} />
      <div className={styles.videoInfo}>
        <div className={styles.videoTitle}>
          {video.title}
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={(e) => onEdit(e, playlistId, video)}>✏️</button>
          <button className={styles.iconBtn} onClick={(e) => onDelete(e, playlistId, video.id)}>🗑️</button>
        </div>
      </div>
    </div>
  );
};

export default VideoItem;
