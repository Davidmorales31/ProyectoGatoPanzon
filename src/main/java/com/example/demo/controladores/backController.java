package com.example.demo.controladores;

import com.example.demo.Repository.FacturasRepository;
import com.example.demo.Repository.ProductoRepository;
import com.example.demo.models.Facturas;
import com.example.demo.models.productos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class backController {
    @Autowired
    private final ProductoRepository productoRepository;

    public backController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @GetMapping("/api/productos")
    public List<productos> productos(){
       return productoRepository.findAll();
    }


}

