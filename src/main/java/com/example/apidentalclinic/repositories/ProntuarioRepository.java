package com.example.apidentalclinic.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.example.apidentalclinic.models.Prontuario;

public interface ProntuarioRepository extends JpaRepository<Prontuario, Integer> {

    Optional<Prontuario> findByPacienteIdUsuario(int idUsuario);
}
