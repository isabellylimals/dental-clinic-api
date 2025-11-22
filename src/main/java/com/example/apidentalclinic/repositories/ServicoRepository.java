package com.example.apidentalclinic.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

import com.example.apidentalclinic.models.Servico;

@Repository
public interface ServicoRepository extends JpaRepository<Servico, Integer> {

    List<Servico> findByNomeServicoContainingIgnoreCase(String nome);

    Optional<Servico> findByNomeServico(String nomeServico);
}