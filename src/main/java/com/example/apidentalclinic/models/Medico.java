package com.example.apidentalclinic.models;
import com.example.apidentalclinic.enums.TipoUsuario;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@DiscriminatorValue("MEDICO")
@Getter @Setter
public class Medico extends Usuario {

    @Column(unique = true)
    private String crm;

    private String especialidade;

    public Medico() {
        this.setTipoUsuario(TipoUsuario.MEDICO);
    }

    // --- SEU CONSTRUTOR ORIGINAL (Ajustado status -> stats) ---
    public Medico(String nome, String email, String senha,
            String telefone, boolean stats, String crm, String especialidade) {

        super(nome, email, senha, TipoUsuario.MEDICO, telefone, stats);
        this.crm = crm;
        this.especialidade = especialidade;
    }

    // --- GETTERS E SETTERS ---

    public String getCrm() {
        return crm;
    }

    public void setCrm(String crm) {
        this.crm = crm;
    }

    public String getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(String especialidade) {
        this.especialidade = especialidade;
    }

    @Override
    public String toString() {
        return super.toString().replace("]", "") +
                ", Crm: '" + this.crm + '\'' +
                ", Especialidade: '" + this.especialidade + '\'' +
                ']';
    }
}