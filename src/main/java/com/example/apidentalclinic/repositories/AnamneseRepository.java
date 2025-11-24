package com.example.apidentalclinic.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.apidentalclinic.models.Anamnese;

@Repository
public interface AnamneseRepository extends JpaRepository<Anamnese, Integer> {
    Optional<Anamnese> findTopByPacienteCpfOrderByDataPreenchimentoDesc(String cpf);
    List<Anamnese> findAllByPacienteIdUsuarioOrderByDataPreenchimentoDesc(int idUsuario);

}