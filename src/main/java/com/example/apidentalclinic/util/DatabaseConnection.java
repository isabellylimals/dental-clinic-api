package com.example.apidentalclinic.util;


import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.springframework.beans.factory.annotation.Value; // Necessário para inicializar os valores
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component // 1. Transforma a classe em um componente gerenciado pelo Spring
public class DatabaseConnection {

    // Variáveis estáticas que serão usadas no getConexao()
    private static String url;
    private static String usuario;
    private static String senha;
    private static String driverClass;

    // Variável estática para a conexão
    private static Connection connection = null;

    // 2. Injeção de Dependência (Lendo do application.properties)
    // O Spring injeta o valor nestas variáveis de instância primeiro
    
    @Value("${spring.datasource.url}")
    private String urlInjected;

    @Value("${spring.datasource.username}")
    private String usuarioInjected;

    @Value("${spring.datasource.password}")
    private String senhaInjected;
    
    @Value("${spring.datasource.driver-class-name}")
    private String driverClassInjected;

    // 3. Método que roda logo após o Spring iniciar
    // Ele copia os valores injetados para as variáveis estáticas
    @PostConstruct
    public void init() {
        url = this.urlInjected;
        usuario = this.usuarioInjected;
        senha = this.senhaInjected;
        driverClass = this.driverClassInjected;
    }

    /**
     * Obtém a conexão usando os dados lidos do application.properties.
     */
    public static Connection getConexao() {
        try {
            if (connection == null || connection.isClosed()) {
                try {
                    // Usa a classe do driver lida do properties
                    Class.forName(driverClass);
                } catch (ClassNotFoundException e) {
                    System.err.println("ERRO: Driver MySQL não encontrado: " + driverClass);
                    e.printStackTrace();
                    throw new RuntimeException("Driver MySQL não encontrado", e);
                }

                // Usa as credenciais lidas do properties
                connection = DriverManager.getConnection(url, usuario, senha);
                System.out.println("\u001B[92mConexão com MySQL estabelecida (Via Properties).\u001B[m");
            }
        } catch (SQLException e) {
            System.err.println("ERRO ao conectar ao MySQL:");
            e.printStackTrace();
            throw new RuntimeException("Falha ao obter conexão com o banco de dados", e);
        }
        return connection;
    }

    public static void fecharConexao() {
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
                System.out.println("Conexão fechada.");
            }
        } catch (SQLException e) {
            System.err.println("Erro ao fechar a conexão com o MySQL:");
            e.printStackTrace();
        }
    }

    public static void close(PreparedStatement stmt, ResultSet rs) {
        if (rs != null) {
            try { rs.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
        close(stmt);
    }

    public static void close(Statement stmt) {
        if (stmt != null) {
            try { stmt.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
    }
}