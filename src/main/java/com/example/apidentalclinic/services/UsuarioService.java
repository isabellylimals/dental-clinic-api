package com.example.apidentalclinic.services;

import com.example.apidentalclinic.enums.TipoUsuario;
import com.example.apidentalclinic.models.Medico;
import com.example.apidentalclinic.models.Paciente;
import com.example.apidentalclinic.models.Usuario;
import com.example.apidentalclinic.repositories.UsuarioRepository;
import com.example.apidentalclinic.util.TratativasBackend;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProntuarioService prontuarioService;

    // -----------------------------------------
    // Cadastrar Usuário (Paciente, Médico, Admin)
    // -----------------------------------------
    public Usuario cadastrarUsuario(Usuario usuario) {

        // -----------------------
        // 1) EMAIL
        // -----------------------
        if (!TratativasBackend.emailValido(usuario.getEmail())) {
            throw new RuntimeException("Email inválido.");
        }
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("Email já cadastrado!");
        }

        // -----------------------
        // 2) SENHA
        // -----------------------
        if (!TratativasBackend.senhaValida(usuario.getSenha())) {
            throw new RuntimeException("Senha inválida (mínimo 8 caracteres e sem espaços).");
        }

        // -----------------------
        // 3) TELEFONE (opcional)
        // -----------------------
        if (usuario.getTelefone() != null &&
                !usuario.getTelefone().isBlank() &&
                !TratativasBackend.telefoneValido(usuario.getTelefone())) {

            throw new RuntimeException("Telefone inválido. Use 10 ou 11 dígitos.");
        }

        // -----------------------
        // 4) TIPO DE USUÁRIO
        // -----------------------
        if (usuario.getTipoUsuario() == null) {
            throw new RuntimeException("Tipo de usuário obrigatório.");
        }

        // -----------------------
        // 5) VALIDAÇÕES ESPECÍFICAS POR TIPO
        // -----------------------
        if (usuario instanceof Paciente paciente) {

            if (!TratativasBackend.cpfValido(paciente.getCpf())) {
                throw new RuntimeException("CPF inválido.");
            }

        } else if (usuario instanceof Medico medico) {

            if (!TratativasBackend.crmValido(medico.getCrm())) {
                throw new RuntimeException("CRM inválido.");
            }

            if (!TratativasBackend.stringValida(medico.getEspecialidade())) {
                throw new RuntimeException("Especialidade inválida.");
            }
        }

        // -----------------------
        // 6) Salvar Usuário
        // -----------------------
        usuario.setStats(true);
        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        // -----------------------
        // 7) Criar prontuário apenas para PACIENTE
        // -----------------------
        if (usuarioSalvo instanceof Paciente pacienteSalvo) {
            prontuarioService.criarProntuario(pacienteSalvo);
        }

        return usuarioSalvo;
    }

    // Autenticar
    public Usuario autenticar(String email, String senha) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        if (usuarioOpt.isPresent()) {
            Usuario u = usuarioOpt.get();
            if (u.getSenha().equals(senha) && u.isStats()) return u;
        }
        return null;
    }

    // Editar
   public Usuario editarUsuario(Usuario usuario) {
        // 1. Busca o usuário que já existe no banco
        Usuario existente = usuarioRepository.findById(usuario.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        // 2. Atualiza apenas os dados básicos
        existente.setNome(usuario.getNome());
        existente.setTelefone(usuario.getTelefone());
        
        // Só atualiza a senha se vier alguma coisa nova
        if (usuario.getSenha() != null && !usuario.getSenha().isEmpty()) {
            existente.setSenha(usuario.getSenha()); 
        }

        // 3. Atualiza dados específicos (Cast seguro)
        if (existente instanceof Medico && usuario instanceof Medico) {
            ((Medico) existente).setEspecialidade(((Medico) usuario).getEspecialidade());
            // CRM geralmente não se muda, mas se quiser:
            // ((Medico) existente).setCrm(((Medico) usuario).getCrm());
        } else if (existente instanceof Paciente && usuario instanceof Paciente) {
            ((Paciente) existente).setEndereco(((Paciente) usuario).getEndereco());
        }

        // 4. Salva o objeto EXISTENTE atualizado
        return usuarioRepository.save(existente);
    }

    // Desativar
    public void desativarConta(int id) {
        usuarioRepository.findById(id).ifPresent(u -> {
            u.setStats(false);
            usuarioRepository.save(u);
        });
    }

    // Ativar
    public void ativarConta(int id) {
        usuarioRepository.findById(id).ifPresent(u -> {
            u.setStats(true);
            usuarioRepository.save(u);
        });
    }

    // Listar
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public List<Usuario> listarPorTipo(TipoUsuario tipo) {
        return usuarioRepository.findByTipoUsuario(tipo);
    }
}
