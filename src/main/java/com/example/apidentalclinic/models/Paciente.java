package com.example.apidentalclinic.models;

import java.util.Date;
import java.util.List;

import com.example.apidentalclinic.enums.TipoUsuario;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Entity
@DiscriminatorValue("PACIENTE") 
@Getter @Setter
public class Paciente extends Usuario {

    @Column(name = "anamnese_validada") // precisa existir no SQL
    private Boolean anamneseValidada = false;

    @Column(unique = true)
    private String cpf;

    @Column(name = "data_nascimento")
    private Date dataNascimento;

    private String endereco;

    @OneToMany(mappedBy = "paciente")
    @JsonIgnore
    private List<Consulta> consultas;

    
    public Paciente() {
        this.setTipoUsuario(TipoUsuario.PACIENTE);
    }

    
    public Paciente(String nome, String email, String senha,
                    String telefone, boolean stats, String cpf,
                    Date dataNascimento, String endereco) {

        super(nome, email, senha, TipoUsuario.PACIENTE, telefone, stats);
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
        this.endereco = endereco;
    }

    
    
    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public Date getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(Date dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    
    @Override
    public String toString() {
        return super.toString().replace("]", "") +
                ", Cpf: '" + this.cpf + '\'' +
                ", DataNascimento: " + this.dataNascimento +
                ", Endereco: '" + this.endereco + '\'' +
                ", AnamneseValidada: " + this.anamneseValidada +
                ']';
    }
}
