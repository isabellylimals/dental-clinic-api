package com.example.apidentalclinic.interfaces;

import java.util.Date;
import java.util.List;

import com.example.apidentalclinic.enums.StatusConsulta;
import com.example.apidentalclinic.models.Consulta;
import com.example.apidentalclinic.models.Medico;
import com.example.apidentalclinic.models.Paciente;
import com.example.apidentalclinic.models.Servico;



public interface IGerenciadorDeAgenda {

    // Agenda uma nova consulta
    Consulta agendarConsulta(Paciente paciente, Medico medico, Servico servico, Date dataHora);

    // Visualiza a agenda de um médico em uma data específica
    List<Consulta> visualizarAgenda(Medico medico, Date data);

    // Altera o status (ex: de AGENDADA para CANCELADA ou REALIZADA)
    boolean gerenciarStatusConsulta(int idConsulta, StatusConsulta novoStatus);
}