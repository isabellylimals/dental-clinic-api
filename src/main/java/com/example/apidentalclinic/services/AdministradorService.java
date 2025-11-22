package com.example.apidentalclinic.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.apidentalclinic.enums.TipoUsuario;
import com.example.apidentalclinic.models.Administrador;
import com.example.apidentalclinic.models.Paciente;

import com.example.apidentalclinic.repositories.AdministradorRepository;
import com.example.apidentalclinic.repositories.MedicoRepository;
import com.example.apidentalclinic.repositories.PacienteRepository;

@Service
public class AdministradorService {

    @Autowired
     private AdministradorRepository administradorRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    public Administrador cadastrarAdministrador(Administrador administrador){
        administrador.setTipoUsuario(TipoUsuario.ADMINISTRADOR);
        administrador.setStats(true);

        return administradorRepository.save(administrador);
    }

     // Buscar paciente pelo CPF
    public List<Paciente> buscarPaciente(String cpf) {
        return pacienteRepository.findByCpfContainingIgnoreCase(cpf);
    }

    //Visualizar Ficha Paciente
    public List<Paciente> visualizarFichPacientes (int idPaciente){
        return pacienteRepository.findAll();
    } 

    // Listar todos pacientes
    public List<Paciente> visualizarPacientesCadastrados() {
        return pacienteRepository.findAll();
    }
}
