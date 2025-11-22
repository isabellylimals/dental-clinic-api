package com.example.apidentalclinic.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.apidentalclinic.enums.TipoUsuario;
import com.example.apidentalclinic.models.Administrador;
import com.example.apidentalclinic.models.Medico;
import com.example.apidentalclinic.models.Paciente;
import com.example.apidentalclinic.services.AdministradorService;

@RestController
@RequestMapping("/api/administrador")
public class AdministradorController {

    @Autowired
    private AdministradorService administradorService;
    
    @Autowired
    private AdministradorRepository administradorRepository;
 
    /*@GetMapping("/buscar-pacientes")
    public List<Paciente> buscar(@RequestParam String cpf) {
        return medicoService.buscarPaciente(cpf);
    }
     @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrarMedico(@RequestBody Medico medico) {
        try {
            medico.setTipoUsuario(TipoUsuario.MEDICO);
            medico.setStats(true);

            Medico salvo = medicoService.cadastrarMedico(medico);
            return ResponseEntity.status(201).body(salvo);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao salvar: " + e.getMessage());
        }
    }*/

    @GetMapping("/listar-todos")
    public List<Paciente> listarTodos() {
        return administradorService.visualizarPacientesCadastrados();
    }
   @GetMapping
    public List<Medico> listarMedicos() {
        return administradorRepository.findAll();
    }
    @Autowired
    private ConsultaService consultaService;
    @PostMapping("/atualizar-status-consulta")
public ResponseEntity<?> gerenciarStatusConsulta(@RequestBody Map<String, String> body) {
    return consultaService.atualizarStatus(body);
}


}
