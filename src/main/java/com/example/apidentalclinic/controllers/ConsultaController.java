package com.example.apidentalclinic.controllers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.apidentalclinic.enums.StatusConsulta;
import com.example.apidentalclinic.models.Consulta;
import com.example.apidentalclinic.models.Medico;
import com.example.apidentalclinic.models.Paciente;
import com.example.apidentalclinic.models.Servico;
import com.example.apidentalclinic.repositories.ConsultaRepository;
import com.example.apidentalclinic.repositories.MedicoRepository;
import com.example.apidentalclinic.repositories.PacienteRepository;
import com.example.apidentalclinic.repositories.ServicoRepository;
import com.example.apidentalclinic.services.ConsultaService;

@RestController
@RequestMapping("/api/consultas")
@CrossOrigin(origins = "*")
public class ConsultaController {
    

    @Autowired
    private ConsultaService consultaService;
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
public ResponseEntity<?> agendar(@RequestBody Map<String, Object> body) {
    try {
        // ------------------------------
        // 1. Ler parâmetros do JSON
        // ------------------------------
        Integer idMedico = Integer.valueOf(body.get("idMedico").toString());
        Integer idPaciente = Integer.valueOf(body.get("idPaciente").toString());
        Integer idServico = Integer.valueOf(body.get("idServico").toString());

        // ------------------------------
        // 2. Converter data/hora
        // Formato aceito: "2025-11-22T14:30"
        // ------------------------------
        String dataHoraStr = body.get("dataHora").toString();
        LocalDateTime dataHora;

        try {
            dataHora = LocalDateTime.parse(dataHoraStr);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Formato de data inválido. Use: yyyy-MM-dd'T'HH:mm:ss");
        }

        // ------------------------------
        // 3. Buscar entidades
        // ------------------------------
        Medico medico = medicoRepository.findById(idMedico)
                .orElseThrow(() -> new RuntimeException("Médico não encontrado"));

        Paciente paciente = pacienteRepository.findById(idPaciente)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        Servico servico = servicoRepository.findById(idServico)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));

        // ------------------------------
        // 4. Validar anamnese
        // ------------------------------
        if (paciente.getAnamneseValidada() == null || !paciente.getAnamneseValidada()) {
            return ResponseEntity.badRequest()
                    .body("A anamnese deve ser validada antes do agendamento.");
        }

        // ------------------------------
        // 5. Verificar conflito de horário
        // ------------------------------
        boolean conflito = consultaRepository.existsByMedicoIdUsuarioAndDataHora(
                medico.getIdUsuario(),
                dataHora
        );

        if (conflito) {
            return ResponseEntity.badRequest()
                    .body("Já existe uma consulta marcada nesse horário para esse médico.");
        }

        // ------------------------------
        // 6. Criar consulta
        // ------------------------------
        Consulta consulta = new Consulta();
        consulta.setMedico(medico);
        consulta.setPaciente(paciente);
        consulta.setServico(servico);
        consulta.setDataHora(dataHora);
        consulta.setStatus(StatusConsulta.CONFIRMADA);

        // ------------------------------
        // 7. Salvar
        // ------------------------------
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
    public ResponseEntity<?> atualizarStatus(@RequestBody Map<String, String> body) {
        return consultaService.atualizarStatus(body);
    }

}