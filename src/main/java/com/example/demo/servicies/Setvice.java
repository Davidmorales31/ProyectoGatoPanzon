package com.example.demo.servicies;

import com.example.demo.models.Usuarios;

public interface Setvice {
    Usuarios save(Usuarios user);
    Usuarios validateUser(String email, String password);
}
