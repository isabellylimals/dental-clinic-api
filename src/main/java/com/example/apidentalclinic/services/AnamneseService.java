package com.example.apidentalclinic.services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.apidentalclinic.models.Anamnese;
import com.example.apidentalclinic.repositories.AnamneseRepository;

@Service
public class AnamneseService {

    @Autowired
    private AnamneseRepository anamneseRepository;


    // --- MÉTODO 2: REGISTRAR OBSERVAÇÃO (Médico) ---
    // O médico busca a anamnese pelo ID e adiciona uma nota
    public Anamnese registrarObservacao(int idAnamnese, String observacao) {
        Anamnese anamnese = anamneseRepository.findById(idAnamnese)
                .orElseThrow(() -> new RuntimeException("Anamnese não encontrada"));

        // Pega o texto que já existe (ou vazio se for nulo)
        String textoAtual = anamnese.getInformacoes();
        if (textoAtual == null) {
            textoAtual = "";
        }

        // Adiciona a nova observação
        String novaInfo = textoAtual + "\n[OBS MÉDICO]: " + observacao;
        anamnese.setInformacoes(novaInfo);
        
        return anamneseRepository.save(anamnese);
    }

    // --- MÉTODO 3: VISUALIZAR ---
    public Anamnese visualizarAnamnese(int idAnamnese) {
        return anamneseRepository.findById(idAnamnese)
                .orElseThrow(() -> new RuntimeException("Anamnese não encontrada"));
    }
}