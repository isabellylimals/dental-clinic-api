package com.example.apidentalclinic.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import com.example.apidentalclinic.models.Medico;

@Repository
public interface MedicoRepository extends JpaRepository<Medico, Integer> {

    List<Medico> findByEspecialidadeContainingIgnoreCase(String especialidade);

}
