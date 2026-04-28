package com.playlists.backend.repository;

import com.playlists.backend.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    // This gives you findAll(), save(), deleteById(), etc. for free!
}