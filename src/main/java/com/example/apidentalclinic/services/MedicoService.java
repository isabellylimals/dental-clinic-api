package com.example.apidentalclinic.services;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.apidentalclinic.models.RegistroAtendimento;
import com.example.apidentalclinic.repositories.ConsultaRepository;
import com.example.apidentalclinic.repositories.MedicoRepository;
@Service
public class MedicoService {
    

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private ProntuarioService prontuarioService;

    @Autowired
    private ConsultaRepository consultaRepository;

   public void registrarEvolucao(int idConsulta, String observacoes) {

    
        var consulta = consultaRepository.findById(idConsulta)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada com ID: " + idConsulta));

        var paciente = consulta.getPaciente();
        var medico = consulta.getMedico();

        RegistroAtendimento registro = new RegistroAtendimento();
        registro.setConsulta(consulta);
        registro.setMedico(medico);
        registro.setObservacoes(observacoes);
        registro.setDataHora(LocalDateTime.now());


        prontuarioService.adicionarEvolucao(
                paciente.getIdUsuario(),
                registro
        );
    }
}
