package com.example.demo.Repository;

import com.example.demo.models.productos;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<productos, Long> {
}
