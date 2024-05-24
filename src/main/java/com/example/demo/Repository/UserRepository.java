package com.example.demo.Repository;

import com.example.demo.models.Usuarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<Usuarios, Long> {
    Usuarios findByEmail(String email);
}
