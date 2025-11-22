package com.example.apidentalclinic.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import com.example.apidentalclinic.enums.TipoUsuario;
import com.example.apidentalclinic.models.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByEmail(String email);

    List<Usuario> findByTipoUsuario(TipoUsuario tipoUsuario);
}