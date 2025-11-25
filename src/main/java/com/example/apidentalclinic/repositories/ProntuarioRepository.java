package com.example.apidentalclinic.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

import com.example.apidentalclinic.models.Prontuario;


public interface ProntuarioRepository extends JpaRepository<Prontuario, Integer> {

    Optional<Prontuario> findByPacienteIdUsuario(int idUsuario);

    //Optional<Prontuario> findByPacienteCpf(String cpf);

    @Query("SELECT p FROM Prontuario p JOIN p.paciente pa WHERE pa.cpf = :cpf")
    Optional<Prontuario> findByPacienteCpf(@Param("cpf") String cpf);
}
