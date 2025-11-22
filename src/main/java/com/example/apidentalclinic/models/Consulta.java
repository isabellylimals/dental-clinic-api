package com.example.apidentalclinic.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.example.apidentalclinic.enums.StatusConsulta;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "consulta")
public class Consulta {

   
    @Transient
    private String cpfPacienteInput;

    @Transient
    private String especialidadeInput; 

    @Transient
    private String nomeServicoInput;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idConsulta;

    @Column(name = "dataHora", nullable = false)
    private LocalDateTime dataHora;

    @ManyToOne
    @JsonIgnoreProperties({ "consultas" })
    @JoinColumn(name = "idMedico", nullable = false)
    private Medico medico;

    @ManyToOne
    @JsonIgnoreProperties({ "consultas" })
    @JoinColumn(name = "idPaciente", nullable = false)
    private Paciente paciente;

    @ManyToOne
    @JsonIgnoreProperties({ "consultas" })
    @JoinColumn(name = "idServico", nullable = false)
    private Servico servico;

    @Enumerated(EnumType.STRING)
    @Column(name = "stats")
    private StatusConsulta status;

   
    public Consulta() {
    }

 
    public String getCpfPacienteInput() {
        return cpfPacienteInput;
    }

    public void setCpfPacienteInput(String cpfPacienteInput) {
        this.cpfPacienteInput = cpfPacienteInput;
    }

    public String getEspecialidadeInput() {
        return especialidadeInput;
    }

    public void setEspecialidadeInput(String especialidadeInput) {
        this.especialidadeInput = especialidadeInput;
    }

    public String getNomeServicoInput() {
        return nomeServicoInput;
    }

    public void setNomeServicoInput(String nomeServicoInput) {
        this.nomeServicoInput = nomeServicoInput;
    }


    public Consulta(int idConsulta, LocalDateTime dataHora, Medico medico,
            Paciente paciente, Servico servico, StatusConsulta status) {
        this.idConsulta = idConsulta;
        this.dataHora = dataHora;
        this.medico = medico;
        this.paciente = paciente;
        this.servico = servico;
        this.status = status;
    }



    public int getIdConsulta() {
        return idConsulta;
    }

    public void setIdConsulta(int idConsulta) {
        this.idConsulta = idConsulta;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
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
                ", cpfPacienteInput='" + cpfPacienteInput + '\'' +
                ", especialidadeInput='" + especialidadeInput + '\'' +
                ", nomeServicoInput='" + nomeServicoInput + '\'' +
                ", status=" + status +
                '}';
    }
}