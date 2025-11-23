package com.example.apidentalclinic.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "registro_atendimento")
public class RegistroAtendimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idRegistroAtendimento;

    @Column(name = "data_hora")
    private LocalDateTime dataHora;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(columnDefinition = "TEXT")
    private String diagnostico; // ADICIONADO – EXISTE NO UML

    @ManyToOne
    @JoinColumn(name = "id_prontuario", nullable = false)
    private Prontuario prontuario;

    @ManyToOne
    @JoinColumn(name = "id_medico", nullable = false)
    private Medico medico;

    @ManyToOne
    @JoinColumn(name = "id_consulta", nullable = false)
    private Consulta consulta;

    public RegistroAtendimento() {}

    public RegistroAtendimento(
            int idRegistroAtendimento,
            LocalDateTime dataHora,
            String observacoes,
            Prontuario prontuario,
            Medico medico,
            Consulta consulta
    ) {
        this.idRegistroAtendimento = idRegistroAtendimento;
        this.dataHora = dataHora;
            this.observacoes = observacoes;
        this.prontuario = prontuario;
        this.medico = medico;
        this.consulta = consulta;
    }

    public int getIdRegistroAtendimento() {
        return idRegistroAtendimento;
    }

    public void setIdRegistroAtendimento(int idRegistroAtendimento) {
        this.idRegistroAtendimento = idRegistroAtendimento;
    }

    public LocalDateTime getDataHora() {     // CORRIGIDO
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

 



    public Prontuario getProntuario() {
        return prontuario;
    }

    public void setProntuario(Prontuario prontuario) {
        this.prontuario = prontuario;
    }

    public Medico getMedico() {
        return medico;
    }

    public void setMedico(Medico medico) {
        this.medico = medico;
    }

    public Consulta getConsulta() {
        return consulta;
    }

    public void setConsulta(Consulta consulta) {
        this.consulta = consulta;
    }

    @Override
    public String toString() {
        return "RegistroAtendimento [" +
                "Id: " + this.idRegistroAtendimento +
                ", Data: " + this.dataHora +
                ", Observações: '" + this.observacoes + '\'' +
                ']';
    }
}