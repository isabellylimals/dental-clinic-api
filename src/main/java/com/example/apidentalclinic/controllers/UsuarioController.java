package com.example.apidentalclinic.controllers;

import com.example.apidentalclinic.models.Usuario;
import com.example.apidentalclinic.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin("*") // LIBERA O FRONTEND
public class UsuarioController {

    @Autowired
    private UsuarioService service;

    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrar(@RequestBody Usuario usuario) {
        try {
            return new ResponseEntity<>(service.cadastrarUsuario(usuario), HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> dados) {
        Usuario usuario = service.autenticar(dados.get("email"), dados.get("senha"));
        return (usuario != null) ? ResponseEntity.ok(usuario) : ResponseEntity.status(401).body("Erro no login");
    }

    @PutMapping("/editar")
    public ResponseEntity<?> editar(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(service.editarUsuario(usuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> desativar(@PathVariable int id) {
        service.desativarConta(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping
    public ResponseEntity<List<Usuario>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @PutMapping("/{id}/ativar")
    public ResponseEntity<?> ativar(@PathVariable int id) {
        service.ativarConta(id);
        return ResponseEntity.ok().build();
    }
}