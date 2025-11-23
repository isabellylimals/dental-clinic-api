package com.example.apidentalclinic.services;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.apidentalclinic.models.Consulta;
import com.example.apidentalclinic.models.Medico;
import com.example.apidentalclinic.models.Paciente;
import com.example.apidentalclinic.models.Prontuario;
import com.example.apidentalclinic.models.RegistroAtendimento;
import com.example.apidentalclinic.repositories.ConsultaRepository;
import com.example.apidentalclinic.repositories.MedicoRepository;
import com.example.apidentalclinic.repositories.ProntuarioRepository;
import com.example.apidentalclinic.repositories.RegistroAtendimentoRepository;

@Service
public class RegistroAtendimentoService {
    @Autowired
    private RegistroAtendimentoRepository registroAtendimentoRepository;
    
    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired 
    private MedicoRepository medicoRepository;

    @Autowired
    private ProntuarioRepository prontuarioRepository;


    public RegistroAtendimento criarRegistro(
        int idMedico,
        int idConsulta,
        String observacoes) {

    Medico medico = medicoRepository.findById(idMedico)
            .orElseThrow(() -> new RuntimeException("Médico não encontrado."));


    Consulta consulta = consultaRepository.findById(idConsulta)
            .orElseThrow(() -> new RuntimeException("Consulta não encontrada."));

  
    Paciente paciente = consulta.getPaciente();

    Prontuario prontuario = prontuarioRepository.findByPacienteIdUsuario(
            paciente.getIdUsuario()
    ).orElseThrow(() -> new RuntimeException("Prontuário do paciente não encontrado."));
    RegistroAtendimento registro = new RegistroAtendimento();
    registro.setMedico(medico);
    registro.setConsulta(consulta);
    registro.setProntuario(prontuario);
    registro.setObservacoes(observacoes);
    registro.setDataHora(LocalDateTime.now());

    return registroAtendimentoRepository.save(registro);
}
public boolean editarRegistro(int idRegistro,String observacoes) {

    RegistroAtendimento registro = registroAtendimentoRepository.findById(idRegistro)
            .orElseThrow(() -> new RuntimeException(
                    "Esse registro de atendimento que você está tentando editar não existe"));

   
    registro.setObservacoes(observacoes);
    registro.setDataHora(LocalDateTime.now()); // opcional: atualizar data/hora


    registroAtendimentoRepository.save(registro);

    return true;
}

    }

