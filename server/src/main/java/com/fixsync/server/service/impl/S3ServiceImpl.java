package com.fixsync.server.service.impl;

import com.fixsync.server.config.S3Config;
import com.fixsync.server.service.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.InputStream;
import java.net.URL;
import java.time.Duration;

@Slf4j
@Service
@org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(name = "file.upload.storage-type", havingValue = "s3")
@RequiredArgsConstructor
public class S3ServiceImpl implements S3Service {
    
    private final S3Client s3Client;
    private final S3Presigner s3Presigner;
    private final S3Config s3Config;
    
    @Override
    public String uploadFile(String key, MultipartFile file, String contentType) {
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(s3Config.getBucketName())
                    .key(key)
                    .contentType(contentType)
                    .contentLength(file.getSize())
                    .build();
            
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            
            log.info("File uploaded to S3: {}", key);
            return key;
        } catch (Exception e) {
            log.error("Error uploading file to S3: {}", key, e);
            throw new RuntimeException("Failed to upload file to S3: " + e.getMessage(), e);
        }
    }
    
    @Override
    public InputStream downloadFile(String key) {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(s3Config.getBucketName())
                    .key(key)
                    .build();
            
            return s3Client.getObject(getObjectRequest);
        } catch (Exception e) {
            log.error("Error downloading file from S3: {}", key, e);
            throw new RuntimeException("Failed to download file from S3: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void deleteFile(String key) {
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(s3Config.getBucketName())
                    .key(key)
                    .build();
            
            s3Client.deleteObject(deleteObjectRequest);
            log.info("File deleted from S3: {}", key);
        } catch (Exception e) {
            log.error("Error deleting file from S3: {}", key, e);
            throw new RuntimeException("Failed to delete file from S3: " + e.getMessage(), e);
        }
    }
    
    @Override
    public URL generatePresignedUrl(String key, long expirationInMinutes) {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(s3Config.getBucketName())
                    .key(key)
                    .build();
            
            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(expirationInMinutes))
                    .getObjectRequest(getObjectRequest)
                    .build();
            
            PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);
            
            return presignedRequest.url();
        } catch (Exception e) {
            log.error("Error generating presigned URL for S3: {}", key, e);
            throw new RuntimeException("Failed to generate presigned URL: " + e.getMessage(), e);
        }
    }
    
    @Override
    public String getFileUrl(String key) {
        // Return AWS S3 standard URL
        return String.format("https://%s.s3.%s.amazonaws.com/%s", 
                s3Config.getBucketName(), s3Config.getRegion(), key);
    }
    
    @Override
    public boolean fileExists(String key) {
        try {
            HeadObjectRequest headObjectRequest = HeadObjectRequest.builder()
                    .bucket(s3Config.getBucketName())
                    .key(key)
                    .build();
            
            s3Client.headObject(headObjectRequest);
            return true;
        } catch (NoSuchKeyException e) {
            return false;
        } catch (Exception e) {
            log.error("Error checking file existence in S3: {}", key, e);
            return false;
        }
    }
}

