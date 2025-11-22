package com.example.apidentalclinic.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import com.example.apidentalclinic.enums.TipoUsuario;
import com.example.apidentalclinic.models.Paciente;
import com.example.apidentalclinic.models.Usuario;
import com.example.apidentalclinic.repositories.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProntuarioService prontuarioService;

    // + cadastrarUsuario(): Usuario
    public Usuario cadastrarUsuario(Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("Email já cadastrado!");
        }

        usuario.setStats(true);

        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        if (usuarioSalvo.getTipoUsuario() == TipoUsuario.PACIENTE) {
            if (usuarioSalvo instanceof Paciente) {
                prontuarioService.criarProntuario((Paciente) usuarioSalvo);
            }
        }

        return usuarioSalvo;
    }

    // + autenticar(email: String, senha: String): boolean
    public Usuario autenticar(String email, String senha) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        if (usuarioOpt.isPresent()) {
            Usuario u = usuarioOpt.get();
            if (u.getSenha().equals(senha) && u.isStats()) return u;
        }
        return null;
    }

    // + editarDados(): boolean
    public Usuario editarUsuario(Usuario usuario) {
        if (usuarioRepository.existsById(usuario.getIdUsuario())) {
            return usuarioRepository.save(usuario);
        }
        throw new RuntimeException("Usuário não encontrado.");
    }

    // + desativarConta(): void (Muda status para false)
    public void desativarConta(int id) {
        Optional<Usuario> u = usuarioRepository.findById(id);
        if (u.isPresent()) {
            Usuario user = u.get();
            user.setStats(false);
            usuarioRepository.save(user);
        }
    }

    // + listarTodos(): List<Usuario> (novo)
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    // + ativarConta(): void (Muda status para true) (novo)
    public void ativarConta(int id) {
        Optional<Usuario> u = usuarioRepository.findById(id);
        if (u.isPresent()) {
            Usuario user = u.get();
            user.setStats(true); 
            usuarioRepository.save(user);
        }
    }
}