package com.example.inventory_management.model;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "items")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private Integer quantity;

    private Double price;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;
}
