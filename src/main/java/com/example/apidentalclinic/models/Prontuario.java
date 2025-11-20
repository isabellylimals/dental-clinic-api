package com.example.apidentalclinic.models;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "prontuario")
public class Prontuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idProntuario;

    @Column(name = "dataCriacao")
    private Date dataCriacao;

    // RELACIONAMENTO 1:1 com Anamnese
    @OneToOne(cascade = CascadeType.ALL) // Se salvar prontuário, salva anamnese junto
    @JoinColumn(name = "idAnamnese")
    private Anamnese anamnese;

    // RELACIONAMENTO 1:1 com Paciente (Adicionado conforme seu SQL)
    @OneToOne
    @JoinColumn(name = "idPaciente", nullable = false, unique = true)
    private Paciente paciente;

    // RELACIONAMENTO 1:N com Registros
    // 'mappedBy' indica que quem manda na relação é o atributo 'prontuario' na classe RegistroAtendimento
    @OneToMany(mappedBy = "prontuario", cascade = CascadeType.ALL)
    private List<RegistroAtendimento> registros;

    // --- CONSTRUTOR VAZIO ---
    public Prontuario() {
        this.registros = new ArrayList<>();
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