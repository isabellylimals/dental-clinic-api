package com.example.apidentalclinic.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.apidentalclinic.enums.TipoUsuario;
import com.example.apidentalclinic.models.Paciente;
import com.example.apidentalclinic.services.PacienteService;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "*")
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrarPaciente(@RequestBody Paciente paciente) {
        try {
            paciente.setTipoUsuario(TipoUsuario.PACIENTE);
            paciente.setStats(true);

            Paciente salvo = pacienteService.cadastrarPaciente(paciente);
            return ResponseEntity.status(201).body(salvo);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao salvar: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> listarTodos() {
        return ResponseEntity.ok(pacienteService.visualizarPacientesCadastrados());
    }

    // @GetMapping("/{id}")
    // public ResponseEntity<?> buscarPorCpf(@PathVariable String cpf) {
    //     return pacienteService.buscarPorCpf(cpf)
    //             .map(ResponseEntity::ok)
    //             .orElse(ResponseEntity.notFound().build());
    // }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Integer id, @RequestBody Paciente p) {
        Paciente atualizado = pacienteService.atualizarPaciente(id, p);

        if (atualizado == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> desativar(@PathVariable Integer id) {
        boolean ok = pacienteService.desativarPaciente(id);

        if (!ok) return ResponseEntity.notFound().build();

        return ResponseEntity.ok("Paciente desativado.");
    }
}
