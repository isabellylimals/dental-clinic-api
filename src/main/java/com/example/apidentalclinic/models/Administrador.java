package com.example.apidentalclinic.models;

import com.example.apidentalclinic.enums.TipoUsuario;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@DiscriminatorValue("ADMINISTRADOR")
@Getter @Setter
public class Administrador extends Usuario {

    public Administrador() {
        this.setTipoUsuario(TipoUsuario.ADMINISTRADOR);
    }

    // --- SEU CONSTRUTOR ORIGINAL (Ajustado status -> stats) ---
    public Administrador(String nome, String email, String senha,
            String telefone, boolean stats) {
        super(nome, email, senha, TipoUsuario.ADMINISTRADOR, telefone, stats);
    }

    @Override
    public String toString() {
        return super.toString().replace("]", "") +
                ']';
    }

    //gerar relatorio agendamento
}