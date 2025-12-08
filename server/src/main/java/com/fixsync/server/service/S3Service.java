package com.fixsync.server.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.net.URL;

public interface S3Service {
    String uploadFile(String key, MultipartFile file, String contentType);
    
    InputStream downloadFile(String key);
    
    void deleteFile(String key);
    
    URL generatePresignedUrl(String key, long expirationInMinutes);
    
    String getFileUrl(String key);
    
    boolean fileExists(String key);
}


