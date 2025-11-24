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
import com.example.apidentalclinic.models.Paciente;
import com.example.apidentalclinic.models.Prontuario;
import com.example.apidentalclinic.models.RegistroAtendimento;
import com.example.apidentalclinic.repositories.AnamneseRepository;
import com.example.apidentalclinic.repositories.PacienteRepository;
import com.example.apidentalclinic.services.ProntuarioService;

@RestController
@RequestMapping("/api/prontuarios")
@CrossOrigin(origins = "*")
public class ProntuarioController {

    @Autowired
    private ProntuarioService prontuarioService;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private AnamneseRepository anamneseRepository;

    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<?> visualizar(@PathVariable Integer idPaciente) {
        try {
            Prontuario prontuario = prontuarioService.visualizarProntuario(idPaciente);
            return ResponseEntity.ok(prontuario);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }


    @PostMapping("/{idPaciente}/anamnese")
public ResponseEntity<?> salvarAnamnese(
        @PathVariable Integer idPaciente,
        @RequestBody Map<String, Integer> body) {

    try {
        Integer idAnamnese = body.get("idAnamnese");

        if (idAnamnese == null) {
            return ResponseEntity.badRequest().body("idAnamnese é obrigatório.");
        }

     Anamnese anamnese = anamneseRepository.findById(idAnamnese)
        .orElseThrow(() -> new RuntimeException("Anamnese não encontrada"));


        prontuarioService.salvarAnamnese(idPaciente, anamnese);

        return ResponseEntity.ok("Anamnese anexada ao prontuário com sucesso.");

    } catch (Exception e) {
        return ResponseEntity.status(400).body(e.getMessage());
    }
}

    @PostMapping("/criar/{idPaciente}")
public ResponseEntity<?> criarProntuario(@PathVariable Integer idPaciente) {
    try {
        Paciente paciente = pacienteRepository.findById(idPaciente)
            .orElseThrow(() -> new RuntimeException("Paciente não encontrado."));

        Prontuario prontuario = prontuarioService.criarProntuario(paciente);

        return ResponseEntity.ok(prontuario);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

 @PostMapping("/{idPaciente}/evolucao")
public ResponseEntity<?> adicionarEvolucao(
        @PathVariable Integer idPaciente,
        @RequestBody RegistroAtendimento evolucao) {


    try {
        prontuarioService.adicionarEvolucao(idPaciente, evolucao);
        return ResponseEntity.status(201).body("Evolução registrada com sucesso!");
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

}