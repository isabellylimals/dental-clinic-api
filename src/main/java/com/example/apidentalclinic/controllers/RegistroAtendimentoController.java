package com.example.apidentalclinic.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.apidentalclinic.models.RegistroAtendimento;
import com.example.apidentalclinic.services.RegistroAtendimentoService;

@RestController
@RequestMapping("/api/atendimentos")
@CrossOrigin(origins = "*")
public class RegistroAtendimentoController {

    @Autowired
    private RegistroAtendimentoService atendimentoService;

    @PostMapping("/criar")
    public ResponseEntity<?> criarRegistro(@RequestBody Map<String, Object> body) {
        try {
            Integer idMedico = (Integer) body.get("idMedico");
            Integer idConsulta = (Integer) body.get("idConsulta");
    
            String observacoes = (String) body.get("observacoes");

            if (idMedico == null || idConsulta == null) {
                return ResponseEntity.badRequest().body("idMedico e idConsulta são obrigatórios.");
            }

            RegistroAtendimento novo = atendimentoService.criarRegistro(
                    idMedico,
                    idConsulta,
                    observacoes
            );

            return ResponseEntity.ok(novo);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/editar/{idRegistro}")
public ResponseEntity<?> editarRegistro(
        @PathVariable Integer idRegistro,
        @RequestBody Map<String, String> body) {

    try {
        String observacoes = body.get("observacoes");

        boolean atualizado = atendimentoService.editarRegistro(
                idRegistro,
                observacoes
        );

        return ResponseEntity.ok("Registro atualizado com sucesso!");

    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

}
