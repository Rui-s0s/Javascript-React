package com.playlists.backend.controller;

import com.playlists.backend.entity.Video;
import com.playlists.backend.entity.Comment;
import com.playlists.backend.repository.VideoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

    private final VideoRepository videoRepository;

    public VideoController(VideoRepository videoRepository) {
        this.videoRepository = videoRepository;
    }

    @GetMapping("/{id}")
    public Video getVideoById(@PathVariable Long id) {
        return videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));
    }

    @PutMapping("/{id}")
    public Video updateVideo(@PathVariable Long id, @RequestBody Video updatedVideo) {
        return videoRepository.findById(id)
                .map(video -> {
                    video.setTitle(updatedVideo.getTitle());
                    video.setUrl(updatedVideo.getUrl());
                    return videoRepository.save(video);
                })
                .orElseThrow(() -> new RuntimeException("Video not found"));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteVideo(@PathVariable Long id) {
        videoRepository.deleteById(id);
    }

    @PostMapping("/{id}/comments")
    public Video addComment(@PathVariable Long id, @RequestBody Comment comment) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));
        
        video.addComment(comment); 
        return videoRepository.save(video);
    }

    @GetMapping("/{id}/comments")
    public List<Comment> getVideoComments(@PathVariable Long id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));
        return video.getComments();
    }

    @PatchMapping("/{id}/like")
    public Video likeVideo(@PathVariable Long id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));
        
        video.addLike(); 
        return videoRepository.save(video);
    }

    @PatchMapping("/{id}/dislike")
    public Video dislikeVideo(@PathVariable Long id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));
        
        video.addDislike();
        return videoRepository.save(video);
    }
}