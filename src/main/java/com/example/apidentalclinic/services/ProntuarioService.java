package com.example.apidentalclinic.services;

import java.time.LocalDate; // 1. Alterado

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.apidentalclinic.models.Anamnese;
import com.example.apidentalclinic.models.Paciente;
import com.example.apidentalclinic.models.Prontuario;
import com.example.apidentalclinic.repositories.ProntuarioRepository;

@Service
public class ProntuarioService {

    @Autowired
    private ProntuarioRepository prontuarioRepository;

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
}