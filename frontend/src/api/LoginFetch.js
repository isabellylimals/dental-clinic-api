import axios from "axios";

const API_URL = "http://localhost:8080/api" // AJUSTE: O endpoint correto no controller é /api/usuarios

export default async function LoginFetch(email, senha){
  try {
    // AJUSTE: A URL completa é ${API_URL}/usuarios/login
    const response = await axios.post(`${API_URL}/usuarios/login`, {
      email: email,
      senha: senha
    })
    
    // RETORNA O OBJETO USUARIO COMPLETO (response.data)
    return response.data;
    
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    
    // Melhora o tratamento de erro para retornar o erro da requisição
    if (error.response && error.response.data) {
        return { error: error.response.data }; // Retorna o corpo do erro (ex: "Erro no login")
    }
    return { error: error.message }; // Erro de rede/outros
  }
}