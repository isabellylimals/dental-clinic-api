package com.example.apidentalclinic.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.apidentalclinic.enums.TipoUsuario;
import com.example.apidentalclinic.models.Paciente;
import com.example.apidentalclinic.repositories.PacienteRepository;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    public Paciente cadastrarPaciente(Paciente paciente) {
        paciente.setTipoUsuario(TipoUsuario.PACIENTE); // <-- CORRETO
        paciente.setStats(true);
        return pacienteRepository.save(paciente);
    }

    public List<Paciente> visualizarPacientesCadastrados() {
        return pacienteRepository.findAll();
    }

    public List<Paciente> buscarPorCpf(String cpf) {
        return pacienteRepository.findByCpfContainingIgnoreCase(cpf);
    }

    public Paciente atualizarPaciente(Integer id, Paciente novosDados) {
        return pacienteRepository.findById(id)
                .map(p -> {
                    p.setNome(novosDados.getNome());
                    p.setEmail(novosDados.getEmail());
                    p.setTelefone(novosDados.getTelefone());
                    p.setCpf(novosDados.getCpf());
                    p.setEndereco(novosDados.getEndereco());
                    p.setDataNascimento(novosDados.getDataNascimento());
                    return pacienteRepository.save(p);
                })
                .orElse(null);
    }

    public boolean desativarPaciente(Integer id) {
        return pacienteRepository.findById(id)
                .map(p -> {
                    p.setStats(false);
                    pacienteRepository.save(p);
                    return true;
                })
                .orElse(false);
    }
}
