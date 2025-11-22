package com.example.apidentalclinic.controllers;
import com.example.apidentalclinic.models.Paciente;
import com.example.apidentalclinic.services.GerenciadorDePacientesService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/gerenciador-pacientes")
@CrossOrigin("*")
public class GerenciadorDePacientesController {


    @Autowired
    private GerenciadorDePacientesService service;


   
    @GetMapping
    public ResponseEntity<List<Paciente>> visualizarTodos() {
        return ResponseEntity.ok(service.visualizarPacientesCadastrados());
    }


   
    @GetMapping("/buscar-cpf")
    public ResponseEntity<List<Paciente>> buscarPorCpf(@RequestParam String cpf) {
        return ResponseEntity.ok(service.buscarPacientePorCpf(cpf));
    }


   
    @GetMapping("/{id}")
    public ResponseEntity<?> verFicha(@PathVariable int id) {
        try {
            return ResponseEntity.ok(service.visualizarFichaPaciente(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}