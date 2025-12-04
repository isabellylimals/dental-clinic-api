package com.example.apidentalclinic.controllers;

import com.example.apidentalclinic.dtos.RelatorioGraficoDTO; // Importe o DTO
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

    @GetMapping("/relatorio")
    public ResponseEntity<RelatorioGraficoDTO> gerarRelatorio(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim,
            @RequestParam(required = false) Integer idMedico,
            @RequestParam(required = false) String status
    ) {
        // Agora chama o método novo e retorna o Objeto, não String
        RelatorioGraficoDTO dadosGraficos = administradorService.gerarRelatorioGrafico(inicio, fim, idMedico, status);
        return ResponseEntity.ok(dadosGraficos);
    }
}