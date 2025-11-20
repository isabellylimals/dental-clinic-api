package com.example.apidentalclinic.models;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "anamnese")
public class Anamnese {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idAnamnese;

    @Column(name = "dataPreenchimento")
    private Date dataPreenchimento;

    @Column(columnDefinition = "TEXT") // Garante que suporte textos longos
    private String informacoes;

    @Column(columnDefinition = "TEXT")
    private String respostas;

    // --- CONSTRUTOR VAZIO (OBRIGATÓRIO JPA) ---
    public Anamnese() {
    }

    // --- SEU CONSTRUTOR ORIGINAL ---
    public Anamnese(int idAnamnese, Date dataPreenchimento, String informacoes, String respostas) {
        this.idAnamnese = idAnamnese;
        this.dataPreenchimento = dataPreenchimento;
        this.informacoes = informacoes;
        this.respostas = respostas;

        if (this.informacoes == null) {
            this.informacoes = "";
        }
    }

    // --- GETTERS E SETTERS ---

    public int getIdAnamnese() {
        return idAnamnese;
    }

    public void setIdAnamnese(int idAnamnese) {
        this.idAnamnese = idAnamnese;
    }

    public Date getDataPreenchimento() {
        return dataPreenchimento;
    }

    public void setDataPreenchimento(Date dataPreenchimento) {
        this.dataPreenchimento = dataPreenchimento;
    }

    public String getInformacoes() {
        return informacoes;
    }

    public void setInformacoes(String informacoes) {
        this.informacoes = informacoes;
    }

    public String getRespostas() {
        return respostas;
    }

    public void setRespostas(String respostas) {
        this.respostas = respostas;
    }

    @Override
    public String toString() {
        return "Anamnese [" +
                "IdAnamnese: " + this.idAnamnese +
                ", DataPreenchimento: " + this.dataPreenchimento +
                ", Informacoes: " + this.informacoes +
                ", Respostas: '" + this.respostas + '\'' +
                ']';
    }
}