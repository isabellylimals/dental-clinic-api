package com.example.apidentalclinic.services;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.apidentalclinic.models.Anamnese;
import com.example.apidentalclinic.models.Paciente;
import com.example.apidentalclinic.repositories.AnamneseRepository;
import com.example.apidentalclinic.repositories.PacienteRepository;

@Service
public class AnamneseService {

    @Autowired
    private AnamneseRepository anamneseRepository;

    // + registrarObservacao(medico: Medico, observacao: String): void
    public Anamnese registrarObservacao(int idAnamnese, String observacao) {

        Anamnese anamnese = anamneseRepository.findById(idAnamnese)
                .orElseThrow(() -> new RuntimeException("Anamnese não encontrada."));

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
