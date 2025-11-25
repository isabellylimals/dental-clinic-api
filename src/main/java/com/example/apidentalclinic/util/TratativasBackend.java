package com.example.apidentalclinic.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class TratativasBackend {

    // -------------------------------
    // CPF
    // -------------------------------
    public static boolean cpfValido(String cpf) {
        if (cpf == null) return false;

        cpf = cpf.replaceAll("[.\\- ]", "");

        if (cpf.length() != 11 || !cpf.matches("\\d+")) return false;
        if (cpf.matches("(\\d)\\1{10}")) return false;

        try {
            String cpfSemDigitos = cpf.substring(0, 9);
            int digito1 = Character.getNumericValue(cpf.charAt(9));
            int digito2 = Character.getNumericValue(cpf.charAt(10));

            int soma1 = 0;
            int peso1 = 10;
            for (int i = 0; i < 9; i++) {
                soma1 += Character.getNumericValue(cpfSemDigitos.charAt(i)) * peso1;
                peso1--;
            }
            int dv1 = (soma1 * 10) % 11;
            if (dv1 > 9) dv1 = 0;

            int soma2 = 0;
            int peso2 = 11;
            for (int i = 0; i < 10; i++) {
                soma2 += Character.getNumericValue(cpf.charAt(i)) * peso2;
                peso2--;
            }
            int dv2 = (soma2 * 10) % 11;
            if (dv2 > 9) dv2 = 0;

            return dv1 == digito1 && dv2 == digito2;

        } catch (Exception e) {
            return false;
        }
    }


    // -------------------------------
    // SENHA
    // -------------------------------
    public static boolean senhaValida(String senha) {
        return senha != null && senha.length() >= 8 && !senha.contains(" ");
    }


    // -------------------------------
    // TELEFONE
    // -------------------------------
    public static boolean telefoneValido(String telefone) {
        if (telefone == null) return false;
        telefone = telefone.replaceAll("[^0-9]", "");
        return telefone.length() == 10 || telefone.length() == 11;
    }


    // -------------------------------
    // EMAIL (gmail/hotmail)
    // -------------------------------
    public static boolean emailValido(String email) {
        if (email == null) return false;

        return email.matches("^[\\w](\\.?[\\w-])*@(gmail|hotmail)\\.com(\\.br)?$");
    }


    // -------------------------------
    // CRM
    // -------------------------------
    public static boolean crmValido(String crm) {
        if (crm == null) return false;

        crm = crm.toUpperCase().replace("/", "").trim();

        if (crm.length() < 4) return false;
        if (crm.contains(" ")) return false;
        if (!crm.matches(".*\\d+.*")) return false;   // tem número
        if (!crm.matches(".*[A-Z]+.*")) return false; // tem letras

        return true;
    }


    // -------------------------------
    // STRING DE TEXTO (apenas letras)
    // -------------------------------
    public static boolean stringValida(String texto) {
        if (texto == null) return false;

        return texto.matches("[A-Za-zÀ-ÿ ]+") &&
               texto.replaceAll("[^A-Za-zÀ-ÿ]", "").length() >= 2;
    }


    // -------------------------------
    // TIPO DE USUÁRIO
    // -------------------------------
    public static boolean tipoUsuarioValido(String tipo) {
        if (tipo == null) return false;

        tipo = tipo.toUpperCase();

        return tipo.equals("PACIENTE") ||
               tipo.equals("MEDICO") ||
               tipo.equals("ADMINISTRADOR");
    }


    // -------------------------------
    // STATUS DE CONSULTA
    // -------------------------------
    public static boolean statusConsultaValido(String status) {
        if (status == null) return false;
        status = status.toUpperCase();

        return switch (status) {
            case "SOLICITADA", "CONFIRMADA", "REALIZADA", "CANCELADA" -> true;
            default -> false;
        };
    }


    // -------------------------------
    // DATA NO FORMATO dd/MM/yyyy
    // -------------------------------
    public static LocalDate converterData(String dataTexto) {
        if (dataTexto == null) return null;

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        try {
            return LocalDate.parse(dataTexto, fmt);
        } catch (DateTimeParseException ex) {
            return null;
        }
    }


    public static boolean dataValida(String dataTexto) {
        return converterData(dataTexto) != null;
    }


    // -------------------------------
    // FORMATAÇÃO DE DATA
    // -------------------------------
    public static String formatarData(LocalDate data) {
        if (data == null) return null;
        return data.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }


    // -------------------------------
    // VALIDAR INTEIRO
    // -------------------------------
    public static boolean inteiroValido(String valor) {
        try {
            Integer.parseInt(valor);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
