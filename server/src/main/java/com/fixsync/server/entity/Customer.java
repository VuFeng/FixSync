package com.fixsync.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "customers", indexes = {
    @Index(name = "idx_customers_phone", columnList = "phone"),
    @Index(name = "idx_customers_email", columnList = "email"),
    @Index(name = "idx_customers_name", columnList = "name")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Customer extends BaseEntity {
    
    @Column(name = "name", nullable = false, length = 255)
    private String name;
    
    @Column(name = "phone", nullable = false, length = 20)
    private String phone;
    
    @Column(name = "email", length = 255)
    private String email;
    
    @Column(name = "address", columnDefinition = "TEXT")
    private String address;
    
    @Column(name = "note", columnDefinition = "TEXT")
    private String note;
    
    // Relationships
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Device> devices;
}







