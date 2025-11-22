package com.example.apidentalclinic.controllers;

import java.time.LocalDate;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.apidentalclinic.enums.StatusConsulta;
import com.example.apidentalclinic.models.Consulta;
import com.example.apidentalclinic.services.ConsultaService;

@RestController
@RequestMapping("/api/consultas")
@CrossOrigin(origins = "*")
public class ConsultaController {

    @Autowired
    private ConsultaService consultaService;

    @PostMapping("/solicitar")
    public ResponseEntity<?> solicitar(@RequestBody Consulta consulta) {
        try {
            Consulta novaConsulta = consultaService.solicitar(consulta);
            return ResponseEntity.ok(novaConsulta);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/agendar")
    public ResponseEntity<?> agendar(@RequestBody Map<String, Integer> body) {
        try {
            Integer idConsulta = body.get("idConsulta");
            if (idConsulta == null)
                return ResponseEntity.badRequest().body("ID da consulta obrigatório");

            Consulta consultaConfirmada = consultaService.agendar(idConsulta);
            return ResponseEntity.ok(consultaConfirmada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/cancelar")
    public ResponseEntity<?> cancelarConsulta(@RequestBody Map<String, Integer> body) {
        try {
            Integer idConsulta = body.get("idConsulta");
            if (idConsulta == null)
                return ResponseEntity.badRequest().body("ID obrigatório");

            consultaService.cancelarConsulta(idConsulta);
            return ResponseEntity.ok("Consulta cancelada com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/atualizar-status")
    public ResponseEntity<?> atualizarStatus(@RequestBody Map<String, Object> body) {
        try {
            Integer idConsulta = (Integer) body.get("idConsulta");
            String statusStr = (String) body.get("novoStatus");

            if (idConsulta == null || statusStr == null)
                return ResponseEntity.badRequest().body("Dados incompletos");

            StatusConsulta novoStatus = StatusConsulta.valueOf(statusStr);
            consultaService.atualizarStatus(idConsulta, novoStatus);

            return ResponseEntity.ok("Status atualizado para: " + novoStatus);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Status inválido.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/buscar-por-cpf")
    public ResponseEntity<?> buscarConsultasPorPaciente(@RequestParam String cpf) {
        return ResponseEntity.ok(consultaService.buscarConsultasPorPaciente(cpf));
    }

    @GetMapping("/agenda-medico")
    public ResponseEntity<?> buscarAgendaMedico(
            @RequestParam int idMedico,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return ResponseEntity.ok(consultaService.buscarAgendaMedico(idMedico, data));
    }

    @GetMapping("/pendentes")
    public ResponseEntity<?> listarPendentes() {
        return ResponseEntity.ok(consultaService.buscarPendentes());
    }
}