package com.example.apidentalclinic.controllers;
     

import com.example.apidentalclinic.models.Anamnese;
import com.example.apidentalclinic.models.Prontuario;
import com.example.apidentalclinic.services.ConsultadorProntuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/prontuarios")
// @CrossOrigin("*") // Descomente se tiver problemas de CORS com o Front-End
public class ConsultadorProntuarioController {

    @Autowired
    private ConsultadorProntuarioService consultadorService;

    // Exemplo de uso: GET http://localhost:8080/api/prontuarios/consulta/12345678900
    @GetMapping("/consulta/{cpf}")
    public ResponseEntity<Prontuario> getProntuarioPorCpf(@PathVariable String cpf) {
        try {
            Prontuario prontuario = consultadorService.consultarProntuario(cpf);
            return ResponseEntity.ok(prontuario);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Exemplo de uso: GET http://localhost:8080/api/prontuarios/anamnese/12345678900
    @GetMapping("/anamnese/{cpf}")
    public ResponseEntity<Anamnese> getAnamnesePorCpf(@PathVariable String cpf) {
        try {
            Anamnese anamnese = consultadorService.consultarAnamnese(cpf);
            return ResponseEntity.ok(anamnese);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
