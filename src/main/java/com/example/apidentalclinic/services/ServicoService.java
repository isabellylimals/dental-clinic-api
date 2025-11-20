package com.example.apidentalclinic.services;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull; // <--- IMPORTANTE: Importar isso
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

    public List<Servico> listarTodosServicos() {
        return servicoRepository.findAll();
    }

    public List<Servico> buscarServicoPorNome(String nome) {
        return servicoRepository.findByNomeServicoContainingIgnoreCase(nome);
    }
    
    // Adicione @NonNull aqui para sumir com o aviso
    public Servico salvar(@NonNull Servico servico) {
        return servicoRepository.save(servico);
    }
}