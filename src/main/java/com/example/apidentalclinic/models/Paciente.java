package com.example.apidentalclinic.models;


import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

import com.example.apidentalclinic.enums.TipoUsuario;

@Entity
@DiscriminatorValue("PACIENTE") // Valor que vai para a coluna 'tipo_usuario_db' no SQL
@Getter @Setter
public class Paciente extends Usuario {

    @Column(unique = true)
    private String cpf;

    @Column(name = "data_nascimento")
    private Date dataNascimento;

    private String endereco;

    // Construtor padrão define o tipo
    public Paciente() {
        this.setTipoUsuario(TipoUsuario.PACIENTE);
    }

    // --- SEU CONSTRUTOR ORIGINAL ---
    public Paciente(String nome, String email, String senha,
            String telefone, boolean stats, String cpf,
            Date dataNascimento, String endereco) {

        super(nome, email, senha, TipoUsuario.PACIENTE, telefone, stats);
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
        this.endereco = endereco;
    }

    // --- GETTERS E SETTERS ---

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

    // --- TO STRING ---
    @Override
    public String toString() {
        return super.toString().replace("]", "") +
                ", Cpf: '" + this.cpf + '\'' +
                ", DataNascimento: " + this.dataNascimento +
                ", Endereco: '" + this.endereco + '\'' +
                ']';
    }
}