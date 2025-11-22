package com.example.apidentalclinic.interfaces;

import java.util.List;
import com.example.apidentalclinic.models.Paciente;

public interface IGerenciadorDePacientes {
 
    List<Paciente> buscarPaciente(String cpf);

    Paciente visualizarFichaPaciente(int idPaciente);

    List<Paciente> visualizarPacientesCadastrados();
}