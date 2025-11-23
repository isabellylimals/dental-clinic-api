package com.example.apidentalclinic.models;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "anamnese")
public class Anamnese {

    @ManyToOne
@JoinColumn(name = "id_paciente", nullable = false)
private Paciente paciente;


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_anamnese")
    private int idAnamnese;

    @Column(name = "data_preenchimento")

    private LocalDate dataPreenchimento;

    @Column(columnDefinition = "TEXT")
    private String informacoes;

    @Column(columnDefinition = "TEXT")
    private String respostas;

    public Anamnese() {

        this.dataPreenchimento = LocalDate.now();
    }

    public Anamnese(int idAnamnese, LocalDate dataPreenchimento, String informacoes, String respostas) {
        this.idAnamnese = idAnamnese;
        this.dataPreenchimento = dataPreenchimento;
        this.informacoes = informacoes;
        this.respostas = respostas;

        if (this.informacoes == null) {
            this.informacoes = "";
        }
    }

    public int getIdAnamnese() {
        return idAnamnese;
    }

    public void setIdAnamnese(int idAnamnese) {
        this.idAnamnese = idAnamnese;
    }

    public LocalDate getDataPreenchimento() {
        return dataPreenchimento;
    }

    public void setDataPreenchimento(LocalDate dataPreenchimento) {
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

    public void setPaciente(Paciente paciente) {
    this.paciente = paciente;
}

}