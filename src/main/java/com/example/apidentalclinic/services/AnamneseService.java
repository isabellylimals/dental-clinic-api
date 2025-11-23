package com.example.apidentalclinic.services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.apidentalclinic.models.Anamnese;
import com.example.apidentalclinic.models.Paciente;
import com.example.apidentalclinic.repositories.AnamneseRepository;
import com.example.apidentalclinic.repositories.PacienteRepository;

@Service
public class AnamneseService {

    @Autowired
    private AnamneseRepository anamneseRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    // + registrarObservacao(medico: Medico, observacao: String): void
    public Anamnese registrarObservacao(int idAnamnese, String observacao) {
        Anamnese anamnese = anamneseRepository.findById(idAnamnese)
                .orElseThrow(() -> new RuntimeException("Anamnese não encontrada"));

        String textoAtual = anamnese.getInformacoes();
        if (textoAtual == null) {
            textoAtual = "";
        }

        String novaInfo = textoAtual + "\n[OBS MÉDICO]: " + observacao;
    
        
        return anamneseRepository.save(anamnese);
    }

    // + visualizarAnamnese(): void
    public Anamnese visualizarAnamnese(int idAnamnese) {
        return anamneseRepository.findById(idAnamnese)
                .orElseThrow(() -> new RuntimeException("Anamnese não encontrada"));
    }

 public Anamnese preencher(String cpf, String respostas) {

    Paciente paciente = pacienteRepository.findByCpf(cpf)
            .orElseThrow(() -> new RuntimeException("Paciente não encontrado com CPF: " + cpf));

    Anamnese anamnese = new Anamnese();
    anamnese.setPaciente(paciente);
    anamnese.setRespostas(respostas);

    return anamneseRepository.save(anamnese);
}


}