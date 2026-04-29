package com.playlists.backend.entity;

import jakarta.persistence.*; // This imports @Entity, @Id, @GeneratedValue, etc.

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String url;
    private int likes;
    private int dislikes;

    @ManyToOne // Many videos belong to one playlist
    @JoinColumn(name = "playlist_id")
    @JsonIgnore
    private Playlist playlist;

    @OneToMany(mappedBy = "video", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>(); 

    // Standard Boilerplate (Getters and Setters)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String name) { this.title = name; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public int getLikes() { return likes; }
    public void addLike() { this.likes += 1; }

    public int getDislikes() { return dislikes; }
    public void addDislike() { this.dislikes += 1; }
    
    public Playlist getPlaylist() { return playlist;}
    public void setPlaylist(Playlist playlist) { this.playlist = playlist;}

    // Methods
    public void addComment(Comment comment) {
        this.comments.add(comment);
        comment.setVideo(this);    // Set the "Back Link"
    }

    public List<Comment> getComments() {
        return comments;
    }
}