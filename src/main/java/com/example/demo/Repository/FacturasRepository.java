package com.example.demo.Repository;

import com.example.demo.models.Facturas;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacturasRepository extends JpaRepository<Facturas, Long> {

}
