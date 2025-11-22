package com.example.apidentalclinic.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.apidentalclinic.models.Paciente;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Integer> {

    List<Paciente> findByCpfContainingIgnoreCase(String cpf);

    Optional<Paciente> findByCpf(String cpf);
}