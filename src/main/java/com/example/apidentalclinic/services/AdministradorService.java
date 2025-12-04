package com.example.apidentalclinic.services;

import com.example.apidentalclinic.dtos.RelatorioGraficoDTO;
import com.example.apidentalclinic.dtos.RelatorioGraficoDTO.DadoGrafico;
import com.example.apidentalclinic.enums.StatusConsulta;
import com.example.apidentalclinic.models.Consulta;
import com.example.apidentalclinic.repositories.ConsultaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdministradorService {

    @Autowired
    private ConsultaRepository consultaRepository;

    public RelatorioGraficoDTO gerarRelatorioGrafico(LocalDateTime inicio, LocalDateTime fim, Integer idMedico, String statusString) {
        
        // 1. Tratar Enum (Filtro opcional)
        StatusConsulta statusEnum = null;
        if (statusString != null && !statusString.isEmpty()) {
            try { statusEnum = StatusConsulta.valueOf(statusString.toUpperCase()); } catch (Exception e) {}
        }

        // 2. Buscar Dados Brutos
        List<Consulta> consultas = consultaRepository.findByFiltros(inicio, fim, idMedico, statusEnum);

        // --- PROCESSAMENTO PARA GRÁFICO 1: POR STATUS (PIZZA) ---
        Map<String, Long> mapStatus = consultas.stream()
            .collect(Collectors.groupingBy(c -> c.getStatus().toString(), Collectors.counting()));
        
        List<DadoGrafico> listaStatus = mapStatus.entrySet().stream()
            .map(e -> new DadoGrafico(e.getKey(), e.getValue()))
            .collect(Collectors.toList());

        // --- PROCESSAMENTO PARA GRÁFICO 2: POR MÉDICO (BARRAS) ---
        Map<String, Long> mapMedico = consultas.stream()
            .collect(Collectors.groupingBy(c -> c.getMedico() != null ? c.getMedico().getNome() : "Sem Médico", Collectors.counting()));

        List<DadoGrafico> listaMedicos = mapMedico.entrySet().stream()
            .map(e -> new DadoGrafico(e.getKey(), e.getValue()))
            .collect(Collectors.toList());

        // --- PROCESSAMENTO PARA GRÁFICO 3: POR MÊS (LINHA) ---
        DateTimeFormatter fmtMes = DateTimeFormatter.ofPattern("MM/yyyy");
        Map<String, Long> mapMes = consultas.stream()
            .collect(Collectors.groupingBy(c -> c.getDataHora().format(fmtMes), Collectors.counting()));

        List<DadoGrafico> listaMes = mapMes.entrySet().stream()
            .map(e -> new DadoGrafico(e.getKey(), e.getValue()))
            .collect(Collectors.toList());

        // Retorna o objeto pronto para o Front
        return new RelatorioGraficoDTO(listaStatus, listaMedicos, listaMes);
    }
}