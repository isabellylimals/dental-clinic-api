package com.example.apidentalclinic.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.apidentalclinic.enums.StatusConsulta;
import com.example.apidentalclinic.models.Consulta;
import com.example.apidentalclinic.models.Medico;
import com.example.apidentalclinic.models.Paciente;
import com.example.apidentalclinic.models.Servico;
import com.example.apidentalclinic.repositories.ConsultaRepository;
import com.example.apidentalclinic.repositories.MedicoRepository;
import com.example.apidentalclinic.repositories.PacienteRepository;
import com.example.apidentalclinic.repositories.ServicoRepository;

@Service
public class ConsultaService {

    @Autowired private ConsultaRepository consultaRepository;
    @Autowired private PacienteRepository pacienteRepository;
    @Autowired private MedicoRepository medicoRepository;
    @Autowired private ServicoRepository servicoRepository;

    // solicitar(paciente: Paciente, servico: Servico, dataHoraDesejada: datetime): Consulta
    @SuppressWarnings("null") 
    public Consulta solicitar(Consulta consultaInput) {
        
        
        if (consultaInput.getCpfPacienteInput() == null || 
            consultaInput.getEspecialidadeInput() == null || 
            consultaInput.getNomeServicoInput() == null) {
            throw new IllegalArgumentException("CPF do Paciente, Especialidade e Nome do Serviço são obrigatórios.");
        }

        
        Paciente paciente = pacienteRepository.findByCpf(consultaInput.getCpfPacienteInput())
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado com CPF: " + consultaInput.getCpfPacienteInput()));
        
        
        List<Medico> medicos = medicoRepository.findByEspecialidadeContainingIgnoreCase(consultaInput.getEspecialidadeInput());
        
        if (medicos.isEmpty()) {
            throw new RuntimeException("Nenhum médico encontrado com a especialidade: " + consultaInput.getEspecialidadeInput());
        }
        
        
        Medico medico = medicos.get(0); 

        
        boolean horarioOcupado = consultaRepository.existsByMedicoIdUsuarioAndDataHora(
                medico.getIdUsuario(), 
                consultaInput.getDataHora()
        );

        if (horarioOcupado) {
            throw new RuntimeException("Horário Indisponível: Já existe uma consulta solicitada ou agendada para este médico às " + consultaInput.getDataHora());
        }
        
        Servico servico = servicoRepository.findByNomeServico(consultaInput.getNomeServicoInput())
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado: " + consultaInput.getNomeServicoInput()));

        
        consultaInput.setPaciente(paciente);
        consultaInput.setMedico(medico);
        consultaInput.setServico(servico);
        
        if (consultaInput.getStatus() == null) {
            consultaInput.setStatus(StatusConsulta.SOLICITADA);
        }

        return consultaRepository.save(consultaInput);
    }


    // + agendar(paciente: Paciente, medico: Medico, servico: Servico, dataHora: datetime): Consulta
    public Consulta agendar(int idConsulta) {
        Consulta consultaExistente = consultaRepository.findById(idConsulta)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));

        boolean conflito = consultaRepository.existsByMedicoIdUsuarioAndDataHoraAndIdConsultaNot(
                consultaExistente.getMedico().getIdUsuario(),
                consultaExistente.getDataHora(),
                idConsulta
        );

        if (conflito) {
            throw new RuntimeException("O médico já possui OUTRA consulta confirmada neste horário.");
        }

        consultaExistente.setStatus(StatusConsulta.CONFIRMADA);
        return consultaRepository.save(consultaExistente);
    }

    //  cancelarConsulta(): void 
    public void cancelarConsulta(int idConsulta) {
        Consulta consulta = consultaRepository.findById(idConsulta)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));

        consulta.setStatus(StatusConsulta.CANCELADA);
        consultaRepository.save(consulta);
    }

    //  atualizarStatus(novoStatus: StatusConsulta): boolean
    public void atualizarStatus(int idConsulta, StatusConsulta novoStatus) {
        Consulta consulta = consultaRepository.findById(idConsulta)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));

        consulta.setStatus(novoStatus);
        consultaRepository.save(consulta);
    }

    
    public List<Consulta> buscarPendentes() {
        return consultaRepository.findByStatus(StatusConsulta.SOLICITADA);
    }

    // + buscarConsultasPorPaciente(String: cpf): List<Consulta>
    public List<Consulta> buscarConsultasPorPaciente(String cpf) {
        return consultaRepository.findByPacienteCpf(cpf);
    }

    // + buscarAgendaMedico(int: idMedico, LocalDate: data): List<Consulta>
    public List<Consulta> buscarAgendaMedico(int idMedico, LocalDate data) {
        LocalDateTime inicioDia = data.atStartOfDay();
        LocalDateTime fimDia = data.atTime(23, 59, 59);
        return consultaRepository.findByMedicoIdUsuarioAndDataHoraBetween(idMedico, inicioDia, fimDia);
    }
    
}
