package com.example.apidentalclinic;


import java.sql.Connection;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.example.apidentalclinic.util.DatabaseConnection;


@Component 
public class TesteConexao implements CommandLineRunner {

    @Override
    public void run(String... args) throws Exception {
        System.out.println("------------------------------------------------");
        System.out.println("TESTE: Iniciando teste de conexão com Banco de Dados...");
        
        try {
            // Tenta pegar a conexão usando a sua classe utilitária
            Connection conn = DatabaseConnection.getConexao();
            
            if (conn != null && !conn.isClosed()) {
                System.out.println("✅ SUCESSO! O Spring leu o properties e conectou ao MySQL.");
                System.out.println("Catalog: " + conn.getCatalog()); // Mostra o nome do banco
                
                // Fecha para testar o método de fechar
                DatabaseConnection.fecharConexao();
                System.out.println("✅ Conexão fechada com sucesso.");
            } else {
                System.err.println("❌ ERRO: A conexão veio nula.");
            }
            
        } catch (Exception e) {
            System.err.println("❌ FALHA CRÍTICA NO TESTE:");
            e.printStackTrace();
        }
        System.out.println("------------------------------------------------");
    }
}