package com.example.apidentalclinic;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.apidentalclinic.models.Anamnese;
import com.example.apidentalclinic.repositories.AnamneseRepository;

@Component
public class TesteAnamnese implements CommandLineRunner {

    @Autowired
    private AnamneseRepository anamneseRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("\n=================================================");
        System.out.println("📝 TESTE: SALVANDO UMA ANAMNESE DE EXEMPLO");
        System.out.println("=================================================\n");

        try {
            Anamnese ficha = new Anamnese();
            // Simulando as respostas que viriam do formulário
            ficha.setRespostas("Paciente relata dor no siso. Histórico de diabetes na família. Alérgico a Penicilina.");
            ficha.setInformacoes("Obs Médica: Paciente muito ansioso.");
            ficha.setDataPreenchimento(new Date());

            anamneseRepository.save(ficha);

            System.out.println("✅ Anamnese salva com sucesso! ID: " + ficha.getIdAnamnese());
        } catch (Exception e) {
            System.err.println("❌ Erro ao salvar anamnese: " + e.getMessage());
        }
        System.out.println("------------------------------------------------\n");
    }
}