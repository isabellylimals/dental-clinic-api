package com.example.apidentalclinic.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.apidentalclinic.models.RegistroAtendimento;

public interface RegistroAtendimentoRepository 
        extends JpaRepository<RegistroAtendimento, Integer> {

}

