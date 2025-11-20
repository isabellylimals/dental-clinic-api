package com.example.apidentalclinic.controllers;

import com.example.apidentalclinic.models.Servico;
import com.example.apidentalclinic.services.ServicoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull; // <--- 1. IMPORTAR ISSO
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicos")
@CrossOrigin("*")
public class ServicoController {

    private final ServicoService servicoService;

    @Autowired
    public ServicoController(ServicoService servicoService) {
        this.servicoService = servicoService;
    }

    @GetMapping
    public ResponseEntity<List<Servico>> listarTodosServicos() {
        List<Servico> servicos = servicoService.listarTodosServicos();
        return ResponseEntity.ok(servicos);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Servico>> buscarServicoPorNome(@RequestParam String nome) {
        List<Servico> servicos = servicoService.buscarServicoPorNome(nome);
        return ResponseEntity.ok(servicos);
    }
    
    @PostMapping
    public ResponseEntity<Servico> adicionarServico(@RequestBody @NonNull Servico servico) {
        Servico novoServico = servicoService.salvar(servico);
        return new ResponseEntity<>(novoServico, HttpStatus.CREATED);
    }
}