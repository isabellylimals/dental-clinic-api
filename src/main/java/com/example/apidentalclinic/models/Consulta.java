package com.example.apidentalclinic.models;

import jakarta.persistence.*;

import java.util.Date;

import com.example.apidentalclinic.enums.StatusConsulta;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


@Entity
@Table(name = "consulta")
public class Consulta {
    @Transient
    private Integer idPaciente;

    @Transient
    private Integer idMedico;

    @Transient
    private Integer idServico;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idConsulta;

    @Column(name = "dataHora", nullable = false)
    private Date dataHora;

    // RELACIONAMENTOS (Chaves Estrangeiras)
    
   @ManyToOne
@JsonIgnoreProperties({"consultas"})
@JoinColumn(name = "idMedico", nullable = false)
private Medico medico;

@ManyToOne
@JsonIgnoreProperties({"consultas"})
@JoinColumn(name = "idPaciente", nullable = false)
private Paciente paciente;

@ManyToOne
@JsonIgnoreProperties({"consultas"})
@JoinColumn(name = "idServico", nullable = false)
private Servico servico;

    // ENUM mapeado para a coluna 'stats' do banco
    @Enumerated(EnumType.STRING)
    @Column(name = "stats") 
    private StatusConsulta status;

    // --- CONSTRUTOR VAZIO ---
    public Consulta() {
    }
        public Integer getIdPaciente() { return idPaciente; }
        public void setIdPaciente(Integer idPaciente) { this.idPaciente = idPaciente; }

        public Integer getIdMedico() { return idMedico; }
        public void setIdMedico(Integer idMedico) { this.idMedico = idMedico; }

        public Integer getIdServico() { return idServico; }
        public void setIdServico(Integer idServico) { this.idServico = idServico; }


    public Consulta(int idConsulta, Date dataHora, Medico medico,
            Paciente paciente, Servico servico, StatusConsulta status) {
        this.idConsulta = idConsulta;
        this.dataHora = dataHora;
        this.medico = medico;
        this.paciente = paciente;
        this.servico = servico;
        this.status = status;
    }

    // --- GETTERS E SETTERS ---

    public int getIdConsulta() {
        return idConsulta;
    }

    public void setIdConsulta(int idConsulta) {
        this.idConsulta = idConsulta;
    }

    public Date getDataHora() {
        return dataHora;
    }

    public void setDataHora(Date dataHora) {
        this.dataHora = dataHora;
    }

    public Medico getMedico() {
        return medico;
    }

    public void setMedico(Medico medico) {
        this.medico = medico;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

    public Servico getServico() {
        return servico;
    }

    public void setServico(Servico servico) {
        this.servico = servico;
    }

    public StatusConsulta getStatus() {
        return status;
    }

    public void setStatus(StatusConsulta status) {
        this.status = status;
    }

  @Override
public String toString() {
    return "Consulta{" +
            "idConsulta=" + idConsulta +
            ", dataHora=" + dataHora +
            ", idPaciente=" + idPaciente +
            ", idMedico=" + idMedico +
            ", idServico=" + idServico +
            ", status=" + status +
            '}';
}

}