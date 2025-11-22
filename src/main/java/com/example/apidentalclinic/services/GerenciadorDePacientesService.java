package com.example.apidentalclinic.services;

import com.example.apidentalclinic.models.Paciente;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;


@Service
public class GerenciadorDePacientesService {


    @Autowired
    private PacienteRepository repository;


    //+ visualizarPacientesCadastrados(): List<Paciente>
    public List<Paciente> visualizarPacientesCadastrados() {
        return repository.findAll();
    }


    // + buscarPaciente(filtroBusca: String): List<Paciente>
    public List<Paciente> buscarPacientePorCpf(String cpf) {
        return repository.findByCpfContainingIgnoreCase(cpf);
    }


    // Visualizar Ficha (Por ID)
    public Paciente visualizarFichaPaciente(int idPaciente) {
        Optional<Paciente> paciente = repository.findById(idPaciente);
       
        if (paciente.isPresent()) {
            return paciente.get();
        }
        throw new RuntimeException("Paciente não encontrado com ID: " + idPaciente);
    }
}