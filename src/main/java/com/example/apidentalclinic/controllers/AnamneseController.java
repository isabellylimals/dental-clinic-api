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

import com.example.apidentalclinic.models.Anamnese;
import com.example.apidentalclinic.services.AnamneseService;

@RestController
@RequestMapping("/api/anamneses")
@CrossOrigin(origins = "*")
public class AnamneseController {

    @Autowired
    private AnamneseService anamneseService;

    @PostMapping("/observacao")
    public ResponseEntity<?> adicionarObservacao(@RequestBody Map<String, Object> payload) {
        try {
            Integer idAnamnese = Integer.valueOf(payload.get("idAnamnese").toString());
            String observacao = (String) payload.get("observacao");

            Anamnese atualizada = anamneseService.registrarObservacao(idAnamnese, observacao);
            return ResponseEntity.ok(atualizada);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao registrar observação: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> visualizar(@PathVariable Integer id) {
        try {
            Anamnese a = anamneseService.visualizarAnamnese(id);
            return ResponseEntity.ok(a);
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Anamnese não encontrada");
        }
    }
}