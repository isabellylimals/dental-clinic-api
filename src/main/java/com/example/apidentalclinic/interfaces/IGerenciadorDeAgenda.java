package com.example.apidentalclinic.interfaces;

import java.util.Date;
import java.util.List;

import com.example.apidentalclinic.enums.StatusConsulta;
import com.example.apidentalclinic.models.Consulta;
import com.example.apidentalclinic.models.Medico;
import com.example.apidentalclinic.models.Paciente;
import com.example.apidentalclinic.models.Servico;



public interface IGerenciadorDeAgenda {

    Consulta agendarConsulta(Paciente paciente, Medico medico, Servico servico, Date dataHora);

    List<Consulta> visualizarAgenda(Medico medico, Date data);

    boolean gerenciarStatusConsulta(int idConsulta, StatusConsulta novoStatus);
}