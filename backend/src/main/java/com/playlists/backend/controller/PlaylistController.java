package com.playlists.backend.controller;

import com.playlists.backend.entity.*;
import com.playlists.backend.repository.PlaylistRepository;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/playlists")
public class PlaylistController {

    private final PlaylistRepository playlistRepository;

    public PlaylistController(PlaylistRepository playlistRepository) {
        this.playlistRepository = playlistRepository;
    }

    @GetMapping
    public List<Playlist> getAllPlaylists() {
        return playlistRepository.findAll();
    }

    @PostMapping
    public Playlist createPlaylist(@RequestBody Playlist playlist) {
        return playlistRepository.save(playlist);
    }

    @GetMapping("/{id}")
    public Playlist getPlaylist(@PathVariable Long id) {
        return playlistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));
    }

    @PutMapping("/{id}")
    public Playlist updatePlaylist(@PathVariable Long id, @RequestBody Playlist updatedPlaylist) {
        return playlistRepository.findById(id)
                .map(playlist -> {
                    playlist.setName(updatedPlaylist.getName());
                    playlist.setDescription(updatedPlaylist.getDescription());
                    // No need to update videos directly here, as they are managed through addVideoToPlaylist or VideoController
                    return playlistRepository.save(playlist);
                })
                .orElseThrow(() -> new RuntimeException("Playlist not found"));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePlaylist(@PathVariable Long id) {
        playlistRepository.deleteById(id);
    }

    @PostMapping("/{playlistId}/videos")
    public Playlist addVideoToPlaylist(@PathVariable Long playlistId, @RequestBody Video video) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        playlist.addVideo(video); 

        return playlistRepository.save(playlist);
    }

    @DeleteMapping("/{playlistId}/videos/{videoId}")
    public void deleteVideoFromPlaylist(@PathVariable Long playlistId, @PathVariable Long videoId) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        Video videoToRemove = playlist.getVideos().stream()
                .filter(video -> video.getId().equals(videoId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Video not found in playlist"));

        playlist.removeVideo(videoToRemove);
        playlistRepository.save(playlist);
    }
    }