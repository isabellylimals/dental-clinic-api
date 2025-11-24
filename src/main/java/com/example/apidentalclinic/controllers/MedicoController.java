package com.example.apidentalclinic.controllers;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.apidentalclinic.services.ConsultaService;
import com.example.apidentalclinic.services.MedicoService;


@RestController
@RequestMapping("/api/medicos")
@CrossOrigin("*")
public class MedicoController {
    


    @Autowired
    private MedicoService medicoService;

    @Autowired
    private ConsultaService consultaService;

    @PostMapping("/registrar-evolucao")
    public ResponseEntity<?> registrarEvolucao(
            @RequestBody Map<String, Object> body) {
        try {
            Integer idConsulta = (Integer) body.get("idConsulta");
            String observacoes = (String) body.get("observacoes");

            if (idConsulta == null) {
                return ResponseEntity.badRequest().body("idConsulta é obrigatório.");
            }

            medicoService.registrarEvolucao(idConsulta, observacoes);

            return ResponseEntity.ok("Evolução registrada com sucesso.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

     @GetMapping("/{idMedico}/consultas")
public ResponseEntity<?> listarConsultas(@PathVariable Integer idMedico) {
    return ResponseEntity.ok(consultaService.listarConsultasPorMedico(idMedico));
}
}