package com.playlists.backend.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Playlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    // This connects to the "playlist" field in the Video class
    // 'cascade = ALL' means if you delete a playlist, all its videos are deleted too
    @OneToMany(mappedBy = "playlist", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Video> videos = new ArrayList<>();

    // Standard Boilerplate (Getters and Setters)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<Video> getVideos() { return videos; }
    public void setVideos(List<Video> videos) { this.videos = videos; }

    // Methods

    public void addVideo(Video video) {
        this.videos.add(video);    // Add to the list
        video.setPlaylist(this);   // Set the "Back Link" (very important!)
    }

    public void removeVideo(Video video) {
        this.videos.remove(video);
        video.setPlaylist(null);   // Break the link
    }
}