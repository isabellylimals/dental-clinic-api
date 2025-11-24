package com.example.apidentalclinic.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.apidentalclinic.models.Anamnese;
import java.util.Optional;

@Repository
public interface AnamneseRepository extends JpaRepository<Anamnese, Integer> {
    Optional<Anamnese> findTopByPacienteCpfOrderByDataPreenchimentoDesc(String cpf);
}