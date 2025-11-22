package com.example.apidentalclinic.repositories;

import java.time.LocalDateTime; 
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.apidentalclinic.enums.StatusConsulta;
import com.example.apidentalclinic.models.Consulta;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Integer> {

    List<Consulta> findByPacienteCpf(String cpf);

    boolean existsByDataHora(LocalDateTime dataHora);

    boolean existsByMedicoIdUsuarioAndDataHora(int idUsuario, LocalDateTime dataHora);

    List<Consulta> findByPacienteCpfOrderByDataHoraDesc(String cpf);

    List<Consulta> findByMedicoIdUsuarioAndDataHoraBetween(int idMedico, LocalDateTime inicio, LocalDateTime fim);

    boolean existsByMedicoIdUsuarioAndDataHoraAndIdConsultaNot(int idUsuario, LocalDateTime dataHora, int idConsultaIgnorada);

    List<Consulta> findByStatus(StatusConsulta status);
}