package com.example.demo.models;


import jakarta.persistence.*;
import com.example.demo.models.DetalleFactur;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Facturas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String direccion;

    private Double total;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<DetalleFactur> detalles;

    // Getters y setters
}
