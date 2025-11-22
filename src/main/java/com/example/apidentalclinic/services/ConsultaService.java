package com.example.apidentalclinic.services;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.apidentalclinic.enums.StatusConsulta;
import com.example.apidentalclinic.models.Consulta;
import com.example.apidentalclinic.repositories.ConsultaRepository;

@Service
public class ConsultaService {

    @Autowired
    private ConsultaRepository consultaRepository;


    public List<Consulta> buscarConsultasPorPaciente(String cpf) {
        return consultaRepository.findByPacienteCpf(cpf);
    }
    @SuppressWarnings("null")
    public Consulta solicitar(Consulta consulta) {
        return consultaRepository.save(consulta);
    }

    public ResponseEntity<?> atualizarStatus(Map<String, String> body) {

        try {
            String idStr = body.get("idConsulta");
            String statusStr = body.get("status");

            if (idStr == null || statusStr == null) {
                return ResponseEntity.badRequest()
                        .body("Campos obrigatórios: idConsulta e status");
            }

            int idConsulta = Integer.parseInt(idStr);

            Consulta consulta = consultaRepository.findById(idConsulta)
                    .orElse(null);

            if (consulta == null) {
                return ResponseEntity.status(404).body("Consulta não encontrada");
            }

            StatusConsulta novoStatus = StatusConsulta.valueOf(statusStr.toUpperCase());

            consulta.setStatus(novoStatus);
            consultaRepository.save(consulta);

            return ResponseEntity.ok("Status atualizado para: " + novoStatus);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Erro ao atualizar consulta: " + e.getMessage());
        }
    }

}