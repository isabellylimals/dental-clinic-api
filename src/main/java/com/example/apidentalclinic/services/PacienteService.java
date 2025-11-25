package com.example.apidentalclinic.services;

import com.example.apidentalclinic.models.Anamnese;
import com.example.apidentalclinic.models.Consulta;
import com.example.apidentalclinic.models.Paciente;
import com.example.apidentalclinic.models.Prontuario;
import com.example.apidentalclinic.repositories.AnamneseRepository;
import com.example.apidentalclinic.repositories.ProntuarioRepository;
import com.example.apidentalclinic.repositories.ConsultaRepository;
import com.example.apidentalclinic.repositories.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PacienteService {

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private AnamneseRepository anamneseRepository;

    @Autowired
    private ProntuarioRepository prontuarioRepository;

    // ==============================================================
    // FUNCIONALIDADE 1: ACOMPANHAR CONSULTAS (Futuras)
    // ==============================================================
    public List<Consulta> acompanharConsultas(String cpf) {
        // Valida se o paciente existe (opcional, mas bom para segurança)
        if (!pacienteRepository.findByCpf(cpf).isPresent()) {
            throw new RuntimeException("Paciente não encontrado com CPF: " + cpf);
        }

        // Pega a data/hora de AGORA
        LocalDateTime agora = LocalDateTime.now();

        // Busca no banco tudo que for depois de agora
        return consultaRepository.findByPacienteCpfAndDataHoraAfterOrderByDataHoraAsc(cpf, agora);
    }

    // ==============================================================
    // FUNCIONALIDADE 2: PREENCHER ANAMNESE
    // ==============================================================
    public Anamnese preencherAnamnese(String cpf, String respostas) {
        // 1. Validar se o Paciente existe
        Paciente paciente = pacienteRepository.findByCpf(cpf)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado com CPF: " + cpf));

        // 2. Buscar o Prontuário dele (Usando o repositório que corrigimos com @Query)
        Prontuario prontuario = prontuarioRepository.findByPacienteCpf(cpf)
                .orElseThrow(() -> new RuntimeException("Erro: Prontuário não encontrado para este paciente."));

        // 3. Criar a Anamnese
        Anamnese anamnese = new Anamnese();
        anamnese.setPaciente(paciente); // Vincula ao objeto Paciente
        anamnese.setDataPreenchimento(LocalDate.now());
        anamnese.setRespostas(respostas);
        anamnese.setInformacoes(""); // Deixa vazio para o médico preencher depois

        // 4. Salvar Anamnese no Banco
        anamnese = anamneseRepository.save(anamnese);

        // 5. Vincular a Anamnese ao Prontuário e Atualizar Prontuário
        prontuario.setAnamnese(anamnese);
        prontuarioRepository.save(prontuario);

        return anamnese;
    }
}