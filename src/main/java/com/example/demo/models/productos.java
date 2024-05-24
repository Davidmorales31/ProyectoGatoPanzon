package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class productos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String ImagenUrl;
    String Precio;
    String Nombre;
    @Column(length = 5000)
    String Descripcion;
}
