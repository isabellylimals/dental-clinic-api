package com.example.apidentalclinic.interfaces;

import com.example.apidentalclinic.models.Anamnese;
import com.example.apidentalclinic.models.Prontuario;

public interface IConsultadorDeProntuario {

    Prontuario consultarProntuario(int idPaciente);

    Anamnese consultarAnamnese(int idPaciente);
}