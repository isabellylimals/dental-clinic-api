package com.example.apidentalclinic.controllers;

import com.example.apidentalclinic.services.AdministradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/administrador")
@CrossOrigin("*")
public class AdministradorController {

    @Autowired
    private AdministradorService administradorService;

    // GET: /api/administrador/relatorio?inicio=2023-01-01T00:00:00&fim=2025-12-31T23:59:59
    @GetMapping("/relatorio")
    public ResponseEntity<String> gerarRelatorio(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim,
            @RequestParam(required = false) Integer idMedico,
            @RequestParam(required = false) String status
    ) {
        
        String relatorio = administradorService.gerarRelatorio(inicio, fim, idMedico, status);
        return ResponseEntity.ok(relatorio);
    }
}