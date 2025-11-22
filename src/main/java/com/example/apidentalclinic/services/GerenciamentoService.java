package com.example.apidentalclinic.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.apidentalclinic.repositories.ConsultaRepository;
import com.example.apidentalclinic.repositories.MedicoRepository;
import com.example.apidentalclinic.repositories.PacienteRepository;

@Service
public class GerenciamentoService {
  @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private ConsultaRepository consultaRepository;

    
}
