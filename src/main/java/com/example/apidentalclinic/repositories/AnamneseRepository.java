package com.example.apidentalclinic.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.apidentalclinic.models.Anamnese;

@Repository
public interface AnamneseRepository extends JpaRepository<Anamnese, Integer> {
}