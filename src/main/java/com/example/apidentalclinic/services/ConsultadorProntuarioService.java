package com.example.apidentalclinic.services;

import com.example.apidentalclinic.models.Anamnese;
import com.example.apidentalclinic.models.Prontuario;
import com.example.apidentalclinic.repositories.AnamneseRepository;
import com.example.apidentalclinic.repositories.ProntuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ConsultadorProntuarioService {

    @Autowired
    private ProntuarioRepository prontuarioRepository;

    @Autowired
    private AnamneseRepository anamneseRepository;

    /**
     * Consulta o Prontuário completo pelo CPF do paciente.
     */
    public Prontuario consultarProntuario(String cpf) {
        return prontuarioRepository.findByPacienteCpf(cpf)
                .orElseThrow(() -> new RuntimeException("Prontuário não encontrado para o CPF: " + cpf));
    }

    /**
     * Consulta apenas a Anamnese pelo CPF do paciente.
     */
    public Anamnese consultarAnamnese(String cpf) {
        return anamneseRepository.findTopByPacienteCpfOrderByDataPreenchimentoDesc(cpf)
                .orElseThrow(() -> new RuntimeException("Anamnese não encontrada para o CPF: " + cpf));
    }
}