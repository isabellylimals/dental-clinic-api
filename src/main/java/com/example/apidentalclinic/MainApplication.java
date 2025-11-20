package com.example.apidentalclinic; // Deve corresponder à pasta onde o arquivo está
// SEM O .model
// ...
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MainApplication {
    public static void main(String[] args) {
        SpringApplication.run(MainApplication.class, args);
    }
}