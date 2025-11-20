package com.example.apidentalclinic.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.apidentalclinic.enums.StatusConsulta;
import com.example.apidentalclinic.models.Consulta;
import com.example.apidentalclinic.models.Medico;
import com.example.apidentalclinic.models.Paciente;
import com.example.apidentalclinic.models.Servico;
import com.example.apidentalclinic.repositories.ConsultaRepository;
import com.example.apidentalclinic.repositories.MedicoRepository;
import com.example.apidentalclinic.repositories.PacienteRepository;
import com.example.apidentalclinic.repositories.ServicoRepository;

@RestController
@RequestMapping("/api/consultas")
@CrossOrigin(origins = "*")
public class ConsultaController {

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private ServicoRepository servicoRepository;

    @PostMapping("/cadastrar")
    public ResponseEntity<?> solicitar(@RequestBody Consulta consulta) {
        try {

            Paciente paciente = pacienteRepository.findById(consulta.getIdPaciente())
                    .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

            Medico medico = medicoRepository.findById(consulta.getIdMedico())
                    .orElseThrow(() -> new RuntimeException("Médico não encontrado"));

            Servico servico = servicoRepository.findById(consulta.getIdServico())
                    .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));

          
            consulta.setPaciente(paciente);
            consulta.setMedico(medico);
            consulta.setServico(servico);

            Consulta salva = consultaRepository.save(consulta);
            return ResponseEntity.ok(salva);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao cadastrar consulta: " + e.getMessage());
        }
    }
   @PostMapping("/confirmar")
    public ResponseEntity<?> agendar(@RequestBody Map<String, Integer> body) {
    try {
        Integer idConsulta = body.get("idConsulta");

        Consulta consulta = consultaRepository.findById(idConsulta)
                .orElse(null);

        if (consulta == null) {
            return ResponseEntity.status(404).body("Consulta não encontrada");
        }

        consulta.setStatus(StatusConsulta.CONFIRMADA);
        consultaRepository.save(consulta);

        return ResponseEntity.ok("Consulta confirmada com sucesso!");

    } catch (Exception e) {
        return ResponseEntity.badRequest()
                .body("Erro ao confirmar consulta: " + e.getMessage());
    }
}

    @GetMapping("/buscar-por-cpf")
    public ResponseEntity<?> buscarConsultasPorPaciente(@RequestParam String cpf) {
        List<Consulta> consultas = consultaRepository.findByPacienteCpf(cpf);
        return ResponseEntity.ok(consultas);
    }
}
