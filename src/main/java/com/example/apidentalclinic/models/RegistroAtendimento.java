package com.example.apidentalclinic.models;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "registro_atendimento")
public class RegistroAtendimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idRegistroAtendimento;

    @Column(name = "dataHora")
    private Date dataHora;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    // --- RELACIONAMENTOS (Adicionados conforme seu SQL) ---

    @ManyToOne
    @JoinColumn(name = "idProntuario", nullable = false) // FK Obrigatória
    private Prontuario prontuario;

    @ManyToOne
    @JoinColumn(name = "idMedico") // FK Opcional (pode ser null)
    private Medico medico;

    @ManyToOne
    @JoinColumn(name = "idConsulta") // FK Opcional
    private Consulta consulta;

    // --- CONSTRUTOR VAZIO (OBRIGATÓRIO) ---
    public RegistroAtendimento() {
    }

    // --- SEU CONSTRUTOR (Atualizado com os relacionamentos) ---
    public RegistroAtendimento(int idRegistroAtendimento, Date dataHora, String observacoes,
                               Prontuario prontuario, Medico medico, Consulta consulta) {
        this.idRegistroAtendimento = idRegistroAtendimento;
        this.dataHora = dataHora;
        this.observacoes = observacoes;
        this.prontuario = prontuario;
        this.medico = medico;
        this.consulta = consulta;
    }

    // --- GETTERS E SETTERS ---

    public int getIdRegistroAtendimento() {
        return idRegistroAtendimento;
    }

    public void setIdRegistroAtendimento(int idRegistroAtendimento) {
        this.idRegistroAtendimento = idRegistroAtendimento;
    }

    public Date getDataHora() {
        return dataHora;
    }

    public void setDataHora(Date dataHora) {
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
                ", Obs: '" + this.observacoes + '\'' +
                ']';
    }
}