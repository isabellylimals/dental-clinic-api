package com.example.apidentalclinic.models;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "prontuario")
public class Prontuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_prontuario")
    private int idProntuario;

    @Column(name = "data_criacao")
    private LocalDate dataCriacao;

    @OneToOne
    @JoinColumn(name = "id_paciente", unique = true, nullable = false)
    private Paciente paciente;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_anamnese", unique = true)
    private Anamnese anamnese;

    @OneToMany(mappedBy = "prontuario", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<RegistroAtendimento> registros = new ArrayList<>();

    public Prontuario() {
        this.dataCriacao = LocalDate.now(); 
    }

    public Prontuario(int idProntuario, LocalDate dataCriacao, Anamnese anamnese, Paciente paciente) {
        this.idProntuario = idProntuario;
        this.dataCriacao = dataCriacao;
        this.anamnese = anamnese;
        this.paciente = paciente;
        this.registros = new ArrayList<>();
    }


    public int getIdProntuario() {
        return idProntuario;
    }

    public void setIdProntuario(int idProntuario) {
        this.idProntuario = idProntuario;
    }

    public LocalDate getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDate dataCriacao) {
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
   @OneToMany(mappedBy = "prontuario", cascade = CascadeType.ALL, orphanRemoval = true) //mudado
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