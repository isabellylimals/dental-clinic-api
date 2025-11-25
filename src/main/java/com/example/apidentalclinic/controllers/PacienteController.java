package com.example.apidentalclinic.controllers;

import com.example.apidentalclinic.models.Anamnese;
import com.example.apidentalclinic.models.Consulta;
import com.example.apidentalclinic.services.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin("*")
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    // ==============================================================
    // 1. ENDPOINT: VER MINHAS CONSULTAS FUTURAS
    // GET: http://localhost:8080/api/pacientes/minhas-consultas?cpf=12345678900
    // ==============================================================
    @GetMapping("/minhas-consultas")
    public ResponseEntity<?> verMinhasConsultas(@RequestParam String cpf) {
        try {
            List<Consulta> consultas = pacienteService.acompanharConsultas(cpf);
            return ResponseEntity.ok(consultas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ==============================================================
    // 2. ENDPOINT: PREENCHER ANAMNESE
    // POST: http://localhost:8080/api/pacientes/anamnese
    // Body: { "cpf": "...", "respostas": "..." }
    // ==============================================================
    @PostMapping("/anamnese")
    public ResponseEntity<?> preencherFicha(@RequestBody Map<String, String> dados) {
        try {
            String cpf = dados.get("cpf");
            String respostas = dados.get("respostas");

            if (cpf == null || respostas == null) {
                return ResponseEntity.badRequest().body("CPF e Respostas são obrigatórios.");
            }

            Anamnese novaAnamnese = pacienteService.preencherAnamnese(cpf, respostas);
            return ResponseEntity.ok(novaAnamnese);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro: " + e.getMessage());
        }
    }
}