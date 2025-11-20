package com.example.apidentalclinic.interfaces;

import com.example.apidentalclinic.models.Anamnese;
import com.example.apidentalclinic.models.Prontuario;



public interface IConsultadorDeProntuario {

    // Busca o prontuário completo pelo ID do paciente
    Prontuario consultarProntuario(int idPaciente);

    // Busca apenas a anamnese pelo ID do paciente
    Anamnese consultarAnamnese(int idPaciente);
}