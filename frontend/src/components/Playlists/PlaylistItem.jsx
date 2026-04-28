import React from 'react';
import VideoItem from './VideoItem';
import styles from './Playlists.module.css';

const PlaylistItem = ({ 
  playlist, 
  isExpanded, 
  isEditing, 
  onToggle, 
  onStartEdit, 
  onDelete, 
  editingName, 
  onEditingNameChange, 
  onEditSubmit, 
  currentVideoId, 
  onSelectVideo, 
  onStartAddVideo, 
  onEditVideo, 
  onDeleteVideo,
  addingToPlaylist,
  step,
  newVideoTitle,
  newVideoLink,
  onNewVideoTitleChange,
  onNewVideoLinkChange,
  onVideoSubmit,
  editingVideoId
}) => {
  return (
    <div className={styles.playlistContainer}>
      {isEditing ? (
        <div style={{ marginBottom: '8px' }}>
          <input
            autoFocus
            type="text"
            value={editingName}
            onChange={(e) => onEditingNameChange(e.target.value)}
            onKeyDown={onEditSubmit}
            className={styles.inlineInput}
          />
        </div>
      ) : (
        <div 
          onClick={() => onToggle(playlist.id)}
          className={styles.playlistHeader}
        >
          <span style={{ flex: 1 }}>{playlist.name}</span>
          <div className={styles.headerActions}>
            <button className={styles.iconBtn} onClick={(e) => onStartEdit(e, playlist)}>✏️</button>
            <button className={styles.iconBtn} onClick={(e) => onDelete(e, playlist.id)}>🗑️</button>
            <span style={{ marginLeft: '8px' }}>{isExpanded ? '▼' : '▶'}</span>
          </div>
        </div>
      )}
      
      {isExpanded && (
        <div className={styles.videoList}>
          {playlist.videos.map((video) => (
            <VideoItem 
              key={video.id}
              video={video}
              playlistId={playlist.id}
              currentVideoId={currentVideoId}
              onSelect={onSelectVideo}
              onEdit={onEditVideo}
              onDelete={onDeleteVideo}
            />
          ))}
          
          {addingToPlaylist === playlist.id ? (
            <div style={{ marginTop: '8px' }}>
              <input
                autoFocus
                type="text"
                placeholder={step === 1 ? (editingVideoId ? "Edit title" : `Add title to ${playlist.name}`) : `Add link to ${newVideoTitle}`}
                value={step === 1 ? newVideoTitle : newVideoLink}
                onChange={(e) => step === 1 ? onNewVideoTitleChange(e.target.value) : onNewVideoLinkChange(e.target.value)}
                onKeyDown={(e) => onVideoSubmit(e, playlist.id)}
                className={styles.inlineInput}
                style={{ borderColor: '#cc0000' }}
              />
              <div className={styles.formFooter} style={{ textAlign: 'right' }}>
                Press Enter to {step === 1 ? 'continue' : 'finish'}, Esc to cancel
              </div>
            </div>
          ) : (
            <button 
              onClick={(e) => { e.stopPropagation(); onStartAddVideo(playlist.id); }}
              className={styles.addVideoBtn}
            >
              + Add Video to {playlist.name}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PlaylistItem;
