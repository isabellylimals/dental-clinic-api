package com.example.apidentalclinic.services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.apidentalclinic.models.Anamnese;
import com.example.apidentalclinic.repositories.AnamneseRepository;

@Service
public class AnamneseService {

    @Autowired
    private AnamneseRepository anamneseRepository;

    // + registrarObservacao(medico: Medico, observacao: String): void
    public Anamnese registrarObservacao(int idAnamnese, String observacao) {
        Anamnese anamnese = anamneseRepository.findById(idAnamnese)
                .orElseThrow(() -> new RuntimeException("Anamnese não encontrada"));

        String textoAtual = anamnese.getInformacoes();
        if (textoAtual == null) {
            textoAtual = "";
        }

        String novaInfo = textoAtual + "\n[OBS MÉDICO]: " + observacao;
        anamnese.setInformacoes(novaInfo);
        
        return anamneseRepository.save(anamnese);
    }

    // + visualizarAnamnese(): void
    public Anamnese visualizarAnamnese(int idAnamnese) {
        return anamneseRepository.findById(idAnamnese)
                .orElseThrow(() -> new RuntimeException("Anamnese não encontrada"));
    }
}