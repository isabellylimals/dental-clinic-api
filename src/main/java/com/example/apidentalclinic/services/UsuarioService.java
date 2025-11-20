package com.example.apidentalclinic.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import com.example.apidentalclinic.models.Usuario;
import com.example.apidentalclinic.repositories.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario cadastrarUsuario(Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("Email já cadastrado!");
        }
        usuario.setStats(true);
        return usuarioRepository.save(usuario);
    }

    public Usuario autenticar(String email, String senha) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        if (usuarioOpt.isPresent()) {
            Usuario u = usuarioOpt.get();
            if (u.getSenha().equals(senha) && u.isStats()) return u;
        }
        return null;
    }

    public Usuario editarUsuario(Usuario usuario) {
        if (usuarioRepository.existsById(usuario.getIdUsuario())) {
            return usuarioRepository.save(usuario);
        }
        throw new RuntimeException("Usuário não encontrado.");
    }

    public void desativarConta(int id) {
        Optional<Usuario> u = usuarioRepository.findById(id);
        if (u.isPresent()) {
            Usuario user = u.get();
            user.setStats(false);
            usuarioRepository.save(user);
        }
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    // REATIVAR CONTA (Muda status para true)
    public void ativarConta(int id) {
        Optional<Usuario> u = usuarioRepository.findById(id);
        if (u.isPresent()) {
            Usuario user = u.get();
            user.setStats(true); // Volta a ser ativo
            usuarioRepository.save(user);
        }
    }
}