package com.example.apidentalclinic.models;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "servico")
public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idServico;

    @Column(name = "nomeServico", nullable = false)
    private String nomeServico;

    @Column(columnDefinition = "TEXT")
    private String descricao;
    @OneToMany(mappedBy = "servico")
    @JsonIgnore
    private List<Consulta> consultas;

    public Servico() {
    }

    public Servico(int idServico, String nomeServico, String descricao) {
        this.idServico = idServico;
        this.nomeServico = nomeServico;
        this.descricao = descricao;
    }

    public int getIdServico() {
        return idServico;
    }

    public void setIdServico(int idServico) {
        this.idServico = idServico;
    }

    public String getNomeServico() {
        return nomeServico;
    }

    public void setNomeServico(String nomeServico) {
        this.nomeServico = nomeServico;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    @Override
    public String toString() {
        return "Servico [" +
                "IdServico: " + this.idServico +
                ", Nome: '" + this.nomeServico + '\'' +
                ", Descricao: '" + this.descricao + '\'' +
                ']';
    }
}