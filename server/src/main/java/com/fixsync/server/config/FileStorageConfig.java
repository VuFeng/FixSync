package com.fixsync.server.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "file.upload")
@Getter
@Setter
public class FileStorageConfig {
    
    private String storageType = "local"; // local or s3
    private String dir = "./uploads";
    private Long maxSize = 10485760L; // 10MB default
    private List<String> allowedTypes = List.of(
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    
    public Path getUploadPath() {
        return Paths.get(dir).toAbsolutePath().normalize();
    }
    
    public boolean isS3Storage() {
        return "s3".equalsIgnoreCase(storageType);
    }
}

