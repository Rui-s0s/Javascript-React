package com.playlists.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*; // This imports @Entity, @Id, @GeneratedValue, etc.

@Entity

public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String text;
    private String author;

    @JsonIgnore
    @ManyToOne
    private Video video; // Which video does this comment belong to?

    // Getters and setters
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }


    public Video getVideo() { return video;}
    public void setVideo(Video video) { this.video = video; }

}