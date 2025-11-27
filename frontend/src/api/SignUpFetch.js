import axios from "axios";

const API_URL = "http://localhost:8080/api";

/**
 * Envia os dados do novo usuário para o endpoint de cadastro.
 * @param {object} userData - Objeto contendo nome, email, senha, etc.
 */
export default async function SignUpFetch(userData) {
  try {
    const response = await axios.post(`${API_URL}/usuarios/cadastro`, userData);
    
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar:", error.response?.data || error.message);
    
    let errorMessage = "Erro desconhecido ao tentar cadastrar.";

    // Se houver uma resposta do servidor (erro 4xx ou 5xx)
    if (error.response) {
        // O Spring Boot geralmente retorna a mensagem no corpo do erro, que pode ser uma string simples ou um objeto JSON.
        
        // Se o corpo do erro for uma string simples (como a que seu controller retorna: e.getMessage())
        if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
        } 
        // Se for um objeto (padrão do Spring para erros mais complexos), procuramos pela propriedade 'message'.
        else if (error.response.data && error.response.data.message) {
             errorMessage = error.response.data.message;
        } 
        // Caso não encontre a mensagem específica, usamos o status.
        else {
             errorMessage = `Erro ${error.response.status}: Falha na requisição.`;
        }
    } else if (error.request) {
        // O erro é na rede (servidor não respondeu)
        errorMessage = "Erro de rede. Verifique se o back-end está rodando.";
    }

    // Retorna a mensagem de erro (string) dentro da propriedade 'error'
    return { error: errorMessage };
  }
}