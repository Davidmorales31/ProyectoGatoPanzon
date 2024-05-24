package com.example.demo.controladores;

import com.example.demo.Repository.FacturasRepository;
import com.example.demo.models.Facturas;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facturas")
public class FacturasController {

    @Autowired
    private FacturasRepository facturasRepository;

    @PostMapping("/guardar")
    public ResponseEntity<?> guardarFactura(@RequestBody Facturas factura) {
        // Aquí puedes realizar algunas validaciones antes de guardar la factura
        Facturas facturaGuardada = facturasRepository.save(factura);
        return ResponseEntity.ok().body(facturaGuardada);
    }

    @GetMapping("/factura") // Eliminamos "/api" de la URL
    public List<Facturas> facturas() {
        return facturasRepository.findAll();
    }

}
