package com.example.apidentalclinic.models;

import jakarta.persistence.*;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "prontuario")
public class Prontuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_prontuario") // SQL: id_prontuario
    private int idProntuario;

    @Column(name = "data_criacao")  // SQL: data_criacao
    @Temporal(TemporalType.DATE)
    private Date dataCriacao;

    // RELACIONAMENTO 1:1 COM PACIENTE
    @OneToOne
    @JoinColumn(name = "id_paciente", unique = true, nullable = false) // SQL: id_paciente
    private Paciente paciente;

    // RELACIONAMENTO 1:1 COM ANAMNESE
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_anamnese", unique = true) // SQL: id_anamnese
    private Anamnese anamnese;

    // RELACIONAMENTO 1:N COM REGISTROS
    @OneToMany(mappedBy = "prontuario", cascade = CascadeType.ALL)
    @JsonManagedReference // Evita loop infinito no JSON
    private List<RegistroAtendimento> registros = new ArrayList<>();

    // Construtor
    public Prontuario() {
        this.dataCriacao = new Date();
    }

    // --- SEU CONSTRUTOR (Adicionei Paciente) ---
    public Prontuario(int idProntuario, Date dataCriacao, Anamnese anamnese, Paciente paciente) {
        this.idProntuario = idProntuario;
        this.dataCriacao = dataCriacao;
        this.anamnese = anamnese;
        this.paciente = paciente;
        this.registros = new ArrayList<>();
    }

    // --- GETTERS E SETTERS ---

    public int getIdProntuario() {
        return idProntuario;
    }

    public void setIdProntuario(int idProntuario) {
        this.idProntuario = idProntuario;
    }

    public Date getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(Date dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public Anamnese getAnamnese() {
        return anamnese;
    }

    public void setAnamnese(Anamnese anamnese) {
        this.anamnese = anamnese;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

    public List<RegistroAtendimento> getRegistros() {
        return registros;
    }

    public void setRegistros(List<RegistroAtendimento> registros) {
        this.registros = registros;
    }

    @Override
    public String toString() {
        String anamneseStr = (this.anamnese != null) ? "ID: " + this.anamnese.getIdAnamnese() : "Nenhuma";
        String pacienteStr = (this.paciente != null) ? this.paciente.getNome() : "Nenhum";
        int quantidadeRegistros = (this.registros != null) ? this.registros.size() : 0;

        return "Prontuario [" +
                "IdProntuario: " + this.idProntuario +
                ", DataCriacao: " + this.dataCriacao +
                ", Anamnese: " + anamneseStr +
                ", Paciente: " + pacienteStr +
                ", Qtd Registros: " + quantidadeRegistros +
                ']';
    }
}