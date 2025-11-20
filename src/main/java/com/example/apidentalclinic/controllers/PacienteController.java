package com.example.apidentalclinic.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.apidentalclinic.enums.TipoUsuario;
import com.example.apidentalclinic.models.Paciente;
import com.example.apidentalclinic.repositories.UsuarioRepository;


@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "*") // Libera para seu HTML acessar sem bloqueio
public class PacienteController {

    @Autowired
    private UsuarioRepository repository;

    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrarPaciente(@RequestBody Paciente paciente) {
        try {
            // Força os dados padrões de segurança
            paciente.setTipoUsuario(TipoUsuario.PACIENTE);
            paciente.setStats(true); // Ativo

            Paciente salvo = repository.save(paciente);
            return ResponseEntity.ok(salvo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao salvar: " + e.getMessage());
        }
    }
}
