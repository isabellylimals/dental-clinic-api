package com.example.apidentalclinic.services;

import com.example.apidentalclinic.models.Consulta;
import com.example.apidentalclinic.enums.StatusConsulta; // Importe o Enum
import com.example.apidentalclinic.repositories.ConsultaRepository;
import com.example.apidentalclinic.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdministradorService {

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public String gerarRelatorio(LocalDateTime inicio, LocalDateTime fim, Integer idMedico, String statusString) {
        
        // 1. Converter String para Enum (se foi passado)
        StatusConsulta statusEnum = null;
        if (statusString != null && !statusString.isEmpty()) {
            try {
                statusEnum = StatusConsulta.valueOf(statusString.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Se mandarem um status invalido, ignoramos ou tratamos
                System.out.println("Status inválido: " + statusString);
            }
        }

        // 2. Buscar dados no banco (Passando o Enum agora)
        List<Consulta> consultas = consultaRepository.findByFiltros(inicio, fim, idMedico, statusEnum);
        
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        StringBuilder sb = new StringBuilder();
        
        // --- CABEÇALHO ---
        sb.append("===================================================================\n");
        sb.append("               RELATÓRIO GERENCIAL DE AGENDAMENTOS                 \n");
        sb.append("===================================================================\n");
        sb.append("Gerado em: ").append(LocalDateTime.now().format(fmt)).append("\n");
        sb.append("Filtro Período: ").append(inicio != null ? inicio.format(fmt) : "Início").append(" até ").append(fim != null ? fim.format(fmt) : "Hoje").append("\n");
        
        if (idMedico != null) {
            usuarioRepository.findById(idMedico).ifPresent(m -> sb.append("Filtro Médico: Dr(a). ").append(m.getNome()).append("\n"));
        }
        
        sb.append("\n-------------------------------------------------------------------\n");
        sb.append(String.format("%-18s | %-20s | %-20s | %-15s | %-12s\n", "DATA/HORA", "PACIENTE", "MÉDICO", "SERVIÇO", "STATUS"));
        sb.append("-------------------------------------------------------------------\n");

        if (consultas.isEmpty()) {
            sb.append("              NENHUM REGISTRO ENCONTRADO NESTE PERÍODO             \n");
        }

        for (Consulta c : consultas) {
            // Verifica nulos para não quebrar
            String paciente = c.getPaciente() != null ? c.getPaciente().getNome() : "N/A";
            String medico = c.getMedico() != null ? c.getMedico().getNome() : "N/A";
            String servico = c.getServico() != null ? c.getServico().getNomeServico() : "N/A";

            sb.append(String.format("%-18s | %-20s | %-20s | %-15s | %-12s\n",
                    c.getDataHora().format(fmt),
                    limitString(paciente, 20),
                    limitString(medico, 20),
                    limitString(servico, 15),
                    c.getStatus() // <--- Sua classe usa getStatus() e retorna Enum
            ));
        }
        
        sb.append("-------------------------------------------------------------------\n\n");

        // --- ESTATÍSTICAS ---
        sb.append("--- RESUMO ESTATÍSTICO ---\n");
        sb.append("Total de Agendamentos: ").append(consultas.size()).append("\n");

        // Agrupando pelo Enum StatusConsulta
        Map<StatusConsulta, Long> porStatus = consultas.stream()
                .collect(Collectors.groupingBy(Consulta::getStatus, Collectors.counting()));

        porStatus.forEach((st, qtd) -> {
            sb.append(" > ").append(st).append(": ").append(qtd).append("\n");
        });

        sb.append("\n===================================================================\n");

        return sb.toString();
    }

    private String limitString(String str, int max) {
        if (str == null) return "-";
        if (str.length() > max) return str.substring(0, max - 3) + "...";
        return str;
    }
}