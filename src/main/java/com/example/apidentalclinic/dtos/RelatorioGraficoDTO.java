package com.example.apidentalclinic.dtos;

import java.util.List;

public class RelatorioGraficoDTO {
    // Gráfico 1: Status
    private List<DadoGrafico> consultasPorStatus;
    // Gráfico 2: Médicos
    private List<DadoGrafico> consultasPorMedico;
    // Gráfico 3: Linha do Tempo
    private List<DadoGrafico> consultasPorMes;

    // Construtor
    public RelatorioGraficoDTO(List<DadoGrafico> consultasPorStatus, List<DadoGrafico> consultasPorMedico, List<DadoGrafico> consultasPorMes) {
        this.consultasPorStatus = consultasPorStatus;
        this.consultasPorMedico = consultasPorMedico;
        this.consultasPorMes = consultasPorMes;
    }

    // Getters
    public List<DadoGrafico> getConsultasPorStatus() { return consultasPorStatus; }
    public List<DadoGrafico> getConsultasPorMedico() { return consultasPorMedico; }
    public List<DadoGrafico> getConsultasPorMes() { return consultasPorMes; }

    // Classe interna auxiliar para representar { nome: "X", valor: 10 }
    public static class DadoGrafico {
        private String nome;
        private Long valor;

        public DadoGrafico(String nome, Long valor) {
            this.nome = nome;
            this.valor = valor;
        }

        public String getNome() { return nome; }
        public Long getValor() { return valor; }
    }
}