package com.example.apidentalclinic.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.apidentalclinic.models.Prontuario;
import com.example.apidentalclinic.services.ProntuarioService;

@RestController
@RequestMapping("/api/prontuarios")
@CrossOrigin(origins = "*")
public class ProntuarioController {

    @Autowired
    private ProntuarioService prontuarioService;

    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<?> visualizar(@PathVariable Integer idPaciente) {
        try {
            Prontuario prontuario = prontuarioService.visualizarProntuario(idPaciente);
            return ResponseEntity.ok(prontuario);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
    
}