package com.playlists.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.playlists.backend.entity.Video;

public interface VideoRepository extends JpaRepository<Video, Long>{
    
}
