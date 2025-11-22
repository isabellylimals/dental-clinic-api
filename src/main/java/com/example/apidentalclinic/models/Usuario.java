package com.example.apidentalclinic.models;

import com.example.apidentalclinic.enums.TipoUsuario;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "usuario")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tipo_usuario_db", discriminatorType = DiscriminatorType.STRING)
@Getter
@Setter

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "tipoUsuario", visible = true)
@JsonSubTypes({
        @JsonSubTypes.Type(value = Paciente.class, name = "PACIENTE"),
        @JsonSubTypes.Type(value = Medico.class, name = "MEDICO"),
        @JsonSubTypes.Type(value = Administrador.class, name = "ADMINISTRADOR")
})
public abstract class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private int idUsuario;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_usuario", nullable = false)
    private TipoUsuario tipoUsuario;

    private String telefone;

    @Column(name = "stats")
    private boolean stats = true;

    public Usuario() {
    }

    public Usuario(String nome, String email, String senha,
            TipoUsuario tipoUsuario, String telefone, boolean stats) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.tipoUsuario = tipoUsuario;
        this.telefone = telefone;
        this.stats = stats;
    }

    public int getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(int idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public TipoUsuario getTipoUsuario() {
        return tipoUsuario;
    }

    public void setTipoUsuario(TipoUsuario paciente) {
        this.tipoUsuario = paciente;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public boolean isStats() {
        return stats;
    }

    public void setStats(boolean stats) {
        this.stats = stats;
    }

    @Override
    public String toString() {
        return "Usuario [" +
                "IdUsuario: " + this.idUsuario +
                ", Nome: '" + this.nome + '\'' +
                ", Email: '" + this.email + '\'' +
                ", Senha: '" + this.senha + '\'' +
                ", TipoUsuario: " + this.tipoUsuario +
                ", Telefone: '" + this.telefone + '\'' +
                ", Status: " + (this.stats ? "Ativo" : "Inativo") +
                ']';
    }
}