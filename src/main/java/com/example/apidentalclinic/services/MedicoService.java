package com.example.apidentalclinic.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.apidentalclinic.enums.TipoUsuario;
import com.example.apidentalclinic.models.Medico;
import com.example.apidentalclinic.models.Paciente;
import com.example.apidentalclinic.repositories.MedicoRepository;
import com.example.apidentalclinic.repositories.PacienteRepository;

@Service
public class MedicoService {

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

   
    public Medico cadastrarMedico(Medico medico) {
        medico.setTipoUsuario(TipoUsuario.MEDICO);
        medico.setStats(true);
        return medicoRepository.save(medico);
    }

    // Buscar paciente pelo CPF
    public List<Paciente> buscarPaciente(String cpf) {
        return pacienteRepository.findByCpfContainingIgnoreCase(cpf);
    }

    // Listar todos pacientes
    public List<Paciente> visualizarPacientesCadastrados() {
        return pacienteRepository.findAll();
    }
}
