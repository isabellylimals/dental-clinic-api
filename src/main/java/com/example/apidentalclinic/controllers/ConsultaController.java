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

    @PostMapping("/solicitar")
    public ResponseEntity<?> solicitar(@RequestBody Consulta consulta) {
        try {
            // CORREÇÃO DEFINITIVA:
            // 1. Extrair para variáveis locais primeiro
            Integer idPaciente = consulta.getIdPaciente();
            Integer idMedico = consulta.getIdMedico();
            Integer idServico = consulta.getIdServico();

            // 2. Verificar se as variáveis são nulas
            if (idPaciente == null || idMedico == null || idServico == null) {
                return ResponseEntity.badRequest().body("IDs de Paciente, Médico e Serviço são obrigatórios.");
            }

            // 3. Usar as variáveis locais (o compilador agora confia nelas)
            Paciente paciente = pacienteRepository.findById(idPaciente)
                    .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

            Medico medico = medicoRepository.findById(idMedico)
                    .orElseThrow(() -> new RuntimeException("Médico não encontrado"));

            Servico servico = servicoRepository.findById(idServico)
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

    @PostMapping("/agendar")
    public ResponseEntity<?> agendar(@RequestBody Consulta consulta) {
        try {
            if (consulta.getPaciente() == null || consulta.getMedico() == null) {
                 return ResponseEntity.badRequest().body("Dados de Paciente ou Médico incompletos.");
            }

            if (!consulta.getPaciente().isAnamneseValidada()) {
                return ResponseEntity.badRequest()
                        .body("A anamnese do paciente deve ser validada antes do agendamento.");
            }

            boolean conflito = consultaRepository.existsByMedicoIdUsuarioAndDataHora(
                    consulta.getMedico().getIdUsuario(),
                    consulta.getDataHora()
            );

            if (conflito) {
                return ResponseEntity.badRequest()
                        .body("Já existe uma consulta marcada neste horário para esse médico.");
            }

            consulta.setStatus(StatusConsulta.CONFIRMADA);
            Consulta salva = consultaRepository.save(consulta);

            return ResponseEntity.ok(salva);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao agendar consulta: " + e.getMessage());
        }
    }

    @GetMapping("/buscar-por-cpf")
    public ResponseEntity<?> buscarConsultasPorPaciente(@RequestParam String cpf) {
        List<Consulta> consultas = consultaRepository.findByPacienteCpf(cpf);
        return ResponseEntity.ok(consultas);
    }

    @PostMapping("/cancelar")
    public ResponseEntity<?> cancelarConsulta(@RequestBody Map<String, Integer> body) {
        try {
            Integer idRaw = body.get("idConsulta");

            if (idRaw == null) {
                return ResponseEntity.badRequest().body("O ID da consulta é obrigatório.");
            }

            int idConsulta = idRaw;

            Consulta consulta = consultaRepository.findById(idConsulta)
                    .orElse(null);

            if (consulta == null) {
                return ResponseEntity.status(404).body("Consulta não encontrada");
            }

            consulta.setStatus(StatusConsulta.CANCELADA);
            consultaRepository.save(consulta);

            return ResponseEntity.ok("Consulta cancelada com sucesso!");

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao cancelar consulta: " + e.getMessage());
        }
    }

    @PostMapping("/atualizar-status")
    public ResponseEntity<?> atualizarStatus(@RequestBody Map<String, Integer> body) {
        try {
            Integer idRaw = body.get("idConsulta");

            if (idRaw == null) {
                return ResponseEntity.badRequest().body("O ID da consulta é obrigatório.");
            }

            int idConsulta = idRaw;

            Consulta consulta = consultaRepository.findById(idConsulta)
                    .orElse(null);

            if (consulta == null) {
                return ResponseEntity.status(404).body("Consulta não encontrada");
            }

            consulta.setStatus(StatusConsulta.REALIZADA);
            consultaRepository.save(consulta);

            return ResponseEntity.ok("Status da consulta atualizado com sucesso!");

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao atualizar consulta " + e.getMessage());
        }
    }
}