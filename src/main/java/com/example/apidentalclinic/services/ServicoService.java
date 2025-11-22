package com.example.apidentalclinic.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import java.util.List;
import com.example.apidentalclinic.models.Servico;
import com.example.apidentalclinic.repositories.ServicoRepository;

@Service
public class ServicoService {

    private final ServicoRepository servicoRepository;

    @Autowired
    public ServicoService(ServicoRepository servicoRepository) {
        this.servicoRepository = servicoRepository;
    }
    
    // + listarTodosServicos(): List<Servico>
    public List<Servico> listarTodosServicos() {
        return servicoRepository.findAll();
    }

    // + buscarServicoPorNome(nome: String): List<Servico>
    public List<Servico> buscarServicoPorNome(String nome) {
        return servicoRepository.findByNomeServicoContainingIgnoreCase(nome);
    }
    
    // + salvar(servico: Servico): Servico (Novo)
    public Servico salvar(@NonNull Servico servico) {
        return servicoRepository.save(servico);
    }
}