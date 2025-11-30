package com.example.apidentalclinic.services;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.apidentalclinic.dtos.MedicoEdicaoDTO;
import com.example.apidentalclinic.models.Anamnese;
import com.example.apidentalclinic.models.Medico;
import com.example.apidentalclinic.models.Paciente;
import com.example.apidentalclinic.models.Prontuario;
import com.example.apidentalclinic.models.RegistroAtendimento;
import com.example.apidentalclinic.repositories.AnamneseRepository;
import com.example.apidentalclinic.repositories.ConsultaRepository;
import com.example.apidentalclinic.repositories.MedicoRepository;
import com.example.apidentalclinic.repositories.PacienteRepository;
@Service
public class MedicoService {
    

    @Autowired
    private ProntuarioService prontuarioService;

    @Autowired
    private ConsultaRepository consultaRepository;
    

    @Autowired
    private PacienteRepository pacienteRepository;
    
    @Autowired
    private AnamneseRepository anamneseRepository;

    @Autowired
    private MedicoRepository medicoRepository;


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
public boolean registrarAnamnese(int idPaciente, String respostas) {
    try {
        Paciente paciente = pacienteRepository.findById(idPaciente)
            .orElseThrow(() -> new RuntimeException("Paciente não encontrado com ID: " + idPaciente));


     
        Prontuario prontuario = prontuarioService.visualizarProntuario(paciente.getIdUsuario());


       
        if (prontuario.getAnamnese() != null) {
            Anamnese existente = prontuario.getAnamnese();
            existente.setRespostas(respostas);
            existente.setDataPreenchimento(LocalDate.now());
            anamneseRepository.save(existente);
            return true;
        }


   
        Anamnese nova = new Anamnese();
        nova.setPaciente(paciente);
        nova.setRespostas(respostas);


        Anamnese salva = anamneseRepository.save(nova);


        prontuario.setAnamnese(salva);
        prontuarioService.salvarAnamnese(idPaciente, salva);


        return true;


    } catch (Exception e) {
        e.printStackTrace();
        return false;
    }
}
    public Medico editarMedico(MedicoEdicaoDTO dto) {
        // Busca o médico pelo idUsuario (herdado de Usuario)
        Medico medico = medicoRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Médico não encontrado."));

        // Atualiza os campos que podem ser editados
        medico.setNome(dto.getNome());
        medico.setEmail(dto.getEmail());
        medico.setTelefone(dto.getTelefone());
        medico.setCrm(dto.getCrm());
        medico.setEspecialidade(dto.getEspecialidade());

        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            medico.setSenha(dto.getSenha()); // se tiver regra de hash, aplica aqui
        }

        // Salva no banco
        return medicoRepository.save(medico);
    }




}
