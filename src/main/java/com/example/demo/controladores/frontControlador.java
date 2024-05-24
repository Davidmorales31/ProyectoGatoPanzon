package com.example.demo.controladores;

import com.example.demo.models.Usuarios;
import com.example.demo.servicies.Setvice;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Objects;

@Controller
public class frontControlador {

    @Autowired
    private Setvice userService;

    @GetMapping("/")
    public String showIndexPage(Model model, HttpSession session, RedirectAttributes redirectAttributes) {
        Usuarios currentUser = (Usuarios) session.getAttribute("currentUser");
        if (Objects.isNull(currentUser)) {
            redirectAttributes.addFlashAttribute("error", "No tienes una sesión iniciada, por favor vuelve a iniciar sesión");
            return "redirect:/login";
        }
        model.addAttribute("user", currentUser);
        return "index";
    }

    @GetMapping("/registro")
    public String Registro(Model model) {
        model.addAttribute("user", new Usuarios());
        return "register";
    }

    @PostMapping("/registro")
    public String registerUser(@ModelAttribute Usuarios user, RedirectAttributes redirectAttributes) {
        userService.save(user);
        redirectAttributes.addFlashAttribute("message", "Registro realizado correctamente, por favor inicia sesión");
        return "redirect:/login";
    }

    @GetMapping("/login")
    public String showLoginPage(Model model, HttpSession session) {
        Usuarios currentUser = (Usuarios) session.getAttribute("currentUser");
        if (Objects.nonNull(currentUser)) {
            return "redirect:/";
        }
        model.addAttribute("user", new Usuarios());
        return "login";
    }

    @PostMapping("/login")
    public String login(@ModelAttribute("user") Usuarios user, RedirectAttributes redirectAttributes, HttpSession session) {
        Usuarios validUser = userService.validateUser(user.getEmail(), user.getPassword());
        if (Objects.nonNull(validUser)) {
            redirectAttributes.addFlashAttribute("message", "Inicio de sesión exitoso!");
            session.setAttribute("currentUser", validUser);
            return "redirect:/";
        } else {
            redirectAttributes.addFlashAttribute("error", "Email o contraseña incorrectas");
            return "redirect:/login";
        }
    }

    @PostMapping("/logout")
    public String logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return "redirect:/login";
    }

    @GetMapping("/historialPedidos")
    public String historialPedidos(Model model, HttpSession session) {
        Usuarios currentUser = (Usuarios) session.getAttribute("currentUser");

        // Verifica si el usuario actual es null o no es admin
        if (currentUser == null || !currentUser.getEmail().equals("admin@admin.com")) {
            return "redirect:/login"; // Redirige al usuario no autorizado a la página de inicio de sesión
        }

        // Si el usuario es admin, continúa con el procesamiento
        model.addAttribute("user", currentUser);
        return "pedidos"; // Nombre del archivo HTML
    }


    @GetMapping("/cambiar-idioma")
    public String cambiarIdioma(String lang) {
        // Puedes realizar alguna lógica adicional aquí, si es necesario

        return "redirect:/inicio?lang=" + lang;
    }

}
