package com.example.apidentalclinic.interfaces;

import java.util.List;

import com.example.apidentalclinic.models.Paciente;


public interface IGerenciadorDePacientes {

    // Busca pacientes por nome, CPF ou email (filtro)
    List<Paciente> buscarPaciente(String filtroBusca);

    // Pega os detalhes completos de um paciente específico
    Paciente visualizarFichaPaciente(int idPaciente);

    // Lista todos os pacientes do sistema
    List<Paciente> visualizarPacientesCadastrados();
}