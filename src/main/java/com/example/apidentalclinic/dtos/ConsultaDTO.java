package com.example.apidentalclinic.dtos;

import java.time.LocalDateTime;

public record ConsultaDTO(
        Integer idConsulta,
        String nomePaciente,
        LocalDateTime dataHora,
        String status
) {}
