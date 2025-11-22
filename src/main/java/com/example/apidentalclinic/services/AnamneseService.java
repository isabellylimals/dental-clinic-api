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

    private final AnamneseRepository anamneseRepository;
    private final PacienteRepository pacienteRepository;

    public AnamneseService(
            AnamneseRepository anamneseRepository,
            PacienteRepository pacienteRepository) {

        this.anamneseRepository = anamneseRepository;
        this.pacienteRepository = pacienteRepository;
    }

    // -----------------------------
    // MÉTODO 1: Preencher Anamnese
    // -----------------------------
public Anamnese preencher(Map<String, Object> body) {

    // 1 — Validar informações obrigatórias
    String info = (String) body.get("informacoes");
    String respostas = (String) body.get("respostas");
    Integer idPaciente = Integer.valueOf(body.get("idPaciente").toString());

    if (info == null || info.isBlank() || respostas == null || respostas.isBlank()) {
        throw new IllegalArgumentException("Informações e respostas são obrigatórias.");
    }

    // 2 — Buscar Paciente
    Paciente paciente = pacienteRepository.findById(idPaciente)
            .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

    // 3 — Converter data
    Date dataPreenchimento;
    try {
        if (body.containsKey("dataPreenchimento")) {
            String dataStr = body.get("dataPreenchimento").toString();

            try {
                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
                dataPreenchimento = sdf1.parse(dataStr);
            } catch (ParseException e1) {
                SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
                dataPreenchimento = sdf2.parse(dataStr);
            }
        } else {
            dataPreenchimento = new Date();
        }

    } catch (Exception e) {
        throw new IllegalArgumentException("Formato de data inválido.");
    }

    // 4 — Criar anamnese
    Anamnese anamnese = new Anamnese();
    anamnese.setInformacoes(info);
    anamnese.setRespostas(respostas);
    anamnese.setDataPreenchimento(dataPreenchimento);

    Anamnese salva = anamneseRepository.save(anamnese);

    // 5 — Marcar paciente como validado
    paciente.setAnamneseValidada(true);
    pacienteRepository.save(paciente);

    return salva;
}


    // -----------------------------
    // MÉTODO 2: Registrar observação
    // -----------------------------
    public Anamnese registrarObservacao(int idAnamnese, String observacao) {

        Anamnese anamnese = anamneseRepository.findById(idAnamnese)
                .orElseThrow(() -> new RuntimeException("Anamnese não encontrada."));

        String texto = anamnese.getInformacoes();
        texto = (texto == null ? "" : texto);

        texto += "\n[OBS MÉDICO]: " + observacao;

        anamnese.setInformacoes(texto);
        return anamneseRepository.save(anamnese);
    }

    // -----------------------------
    // MÉTODO 3: Visualizar
    // -----------------------------
    public Anamnese visualizarAnamnese(int idAnamnese) {
        return anamneseRepository.findById(idAnamnese)
                .orElseThrow(() -> new RuntimeException("Anamnese não encontrada"));
    }
}
