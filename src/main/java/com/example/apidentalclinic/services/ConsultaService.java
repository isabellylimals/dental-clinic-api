package com.example.apidentalclinic.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.apidentalclinic.models.Consulta;
import com.example.apidentalclinic.repositories.ConsultaRepository;

@Service
public class ConsultaService {

    @Autowired
    private ConsultaRepository consultaRepository;

    // Buscar consultas pelo CPF do paciente
    public List<Consulta> buscarConsultasPorPaciente(String cpf) {
        return consultaRepository.findByPacienteCpf(cpf);
    }

    // Cadastrar (solicitar) uma nova consulta
    // A anotação abaixo desativa o aviso amarelo do VS Code
    @SuppressWarnings("null")
    public Consulta solicitar(Consulta consulta) {
        // O Spring Data garante que o retorno não é nulo, então podemos retornar direto
        return consultaRepository.save(consulta);
    }
    
}