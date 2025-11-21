package com.example.apidentalclinic.repositories;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.apidentalclinic.models.Consulta;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Integer> {
    List<Consulta> findByPacienteCpf(String cpf);

    public boolean existsByDataHora(Date dataHora);

    public boolean existsByMedicoIdAndDataHora(int idUsuario, Date dataHora);

    Object findByPacienteCpfOrderByDataHoraDesc(String cpf);
}
