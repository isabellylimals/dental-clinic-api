package com.example.apidentalclinic.repositories;

import java.time.LocalDateTime; 
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.apidentalclinic.enums.StatusConsulta;
import com.example.apidentalclinic.models.Consulta;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Integer> {

    List<Consulta> findByPacienteCpf(String cpf);

    boolean existsByDataHora(LocalDateTime dataHora);

    boolean existsByMedicoIdUsuarioAndDataHora(int idUsuario, LocalDateTime dataHora);

    List<Consulta> findByPacienteCpfOrderByDataHoraDesc(String cpf);

    List<Consulta> findByMedicoIdUsuarioAndDataHoraBetween(int idMedico, LocalDateTime inicio, LocalDateTime fim);

    boolean existsByMedicoIdUsuarioAndDataHoraAndIdConsultaNot(int idUsuario, LocalDateTime dataHora, int idConsultaIgnorada);

    List<Consulta> findByStatus(StatusConsulta status);


    
   @Query("SELECT c FROM Consulta c WHERE " +
           "(:inicio IS NULL OR c.dataHora >= :inicio) AND " +
           "(:fim IS NULL OR c.dataHora <= :fim) AND " +
           "(:idMedico IS NULL OR c.medico.idUsuario = :idMedico) AND " +
           "(:status IS NULL OR c.status = :status) " + 
           "ORDER BY c.dataHora DESC")
    List<Consulta> findByFiltros(
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim,
            @Param("idMedico") Integer idMedico,
            @Param("status") StatusConsulta status 
    );

   List<Consulta> findByMedicoIdUsuario(Integer idMedico);



}