package com.example.apidentalclinic.repositories;

// Local: src/main/java/.../repositories/ServicoRepository.java



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import com.example.apidentalclinic.models.Servico;

@Repository
public interface ServicoRepository extends JpaRepository<Servico, Integer> {

    // O método findByNomeServicoContainingIgnoreCase é necessário para buscarServico(nome)
    List<Servico> findByNomeServicoContainingIgnoreCase(String nome);
}