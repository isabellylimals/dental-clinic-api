package com.example.apidentalclinic.services;

import java.time.LocalDate; // 1. Alterado

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.apidentalclinic.models.Anamnese;
import com.example.apidentalclinic.models.Consulta;
import com.example.apidentalclinic.models.Medico;
import com.example.apidentalclinic.models.Paciente;
import com.example.apidentalclinic.models.Prontuario;
import com.example.apidentalclinic.models.RegistroAtendimento;
import com.example.apidentalclinic.repositories.ConsultaRepository;
import com.example.apidentalclinic.repositories.MedicoRepository;
import com.example.apidentalclinic.repositories.ProntuarioRepository;

@Service
public class ProntuarioService {

    @Autowired
    private ProntuarioRepository prontuarioRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private ConsultaRepository consultaRepository;

    // + criarProntuario(paciente: Paciente): Prontuario
    public Prontuario criarProntuario(Paciente paciente) {
        
        if (prontuarioRepository.findByPacienteIdUsuario(paciente.getIdUsuario()).isPresent()) {
            throw new RuntimeException("Este paciente já possui um prontuário ativo.");
        }

        Prontuario novoProntuario = new Prontuario();
        novoProntuario.setPaciente(paciente);
        novoProntuario.setDataCriacao(LocalDate.now());
        
        return prontuarioRepository.save(novoProntuario);
    }

    // + vizualizarProntuario(): Prontuario
    public Prontuario visualizarProntuario(Integer idPaciente) {
        return prontuarioRepository.findByPacienteIdUsuario(idPaciente)
                .orElseThrow(() -> new RuntimeException("Prontuário não encontrado para o paciente ID: " + idPaciente));
    }

    // + salvarAnamnese(idPaciente: Integer, anamnese: Anamnese): void
    public void salvarAnamnese(Integer idPaciente, Anamnese anamnese) {
        Prontuario prontuario = visualizarProntuario(idPaciente);
        prontuario.setAnamnese(anamnese);
        prontuarioRepository.save(prontuario);
    }

   public void adicionarEvolucao(Integer idPaciente, RegistroAtendimento entradaJson) {

    Prontuario prontuario = visualizarProntuario(idPaciente);

System.out.println("Prontuário encontrado: testando  " + prontuario);

    Medico medico = medicoRepository.findById(entradaJson.getMedico().getIdUsuario())
            .orElseThrow(() -> new RuntimeException("Médico não encontrado."));


   
    Consulta consulta = consultaRepository.findById(entradaJson.getConsulta().getIdConsulta())
            .orElseThrow(() -> new RuntimeException("Consulta não encontrada."));

System.out.println("Prontuário encontrado: testando  " + prontuario);

 
    RegistroAtendimento registro = new RegistroAtendimento();
    registro.setDataHora(entradaJson.getDataHora());
    registro.setObservacoes(entradaJson.getObservacoes());
    registro.setMedico(medico);
    registro.setConsulta(consulta);
    registro.setProntuario(prontuario);
System.out.println("Prontuário encontrado: testando  " + prontuario);

   
    prontuario.getRegistros().add(registro);
System.out.println("Prontuário encontrado: testando  " + prontuario);

  
    prontuarioRepository.save(prontuario);
    System.out.println("Prontuário encontrado: testando  " + prontuario);
}


}