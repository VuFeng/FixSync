package com.fixsync.server.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

@Configuration
@ConfigurationProperties(prefix = "aws")
@Getter
@Setter
public class S3Config {
    
    private String region = "ap-southeast-1";
    private S3Properties s3;
    private String accessKeyId;
    private String secretAccessKey;
    
    @Getter
    @Setter
    public static class S3Properties {
        private String bucket;
    }
    
    @Bean
    @ConditionalOnProperty(name = "file.upload.storage-type", havingValue = "s3")
    public S3Client s3Client() {
        if (accessKeyId == null || accessKeyId.isEmpty() || secretAccessKey == null || secretAccessKey.isEmpty()) {
            throw new IllegalStateException("AWS S3 credentials are required when storage-type is s3. Please set aws.accessKeyId and aws.secretAccessKey");
        }
        if (s3 == null || s3.getBucket() == null || s3.getBucket().isEmpty()) {
            throw new IllegalStateException("AWS S3 bucket name is required. Please set aws.s3.bucket");
        }
        
        AwsBasicCredentials awsCreds = AwsBasicCredentials.create(accessKeyId, secretAccessKey);
        
        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(awsCreds))
                .build();
    }
    
    @Bean
    @ConditionalOnProperty(name = "file.upload.storage-type", havingValue = "s3")
    public S3Presigner s3Presigner() {
        if (accessKeyId == null || accessKeyId.isEmpty() || secretAccessKey == null || secretAccessKey.isEmpty()) {
            throw new IllegalStateException("AWS S3 credentials are required when storage-type is s3. Please set aws.accessKeyId and aws.secretAccessKey");
        }
        
        AwsBasicCredentials awsCreds = AwsBasicCredentials.create(accessKeyId, secretAccessKey);
        
        return S3Presigner.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(awsCreds))
                .build();
    }
    
    public String getBucketName() {
        return s3 != null ? s3.getBucket() : null;
    }
}

