import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./LoginSignUps.css";
import signinImg from "../../assets/images/signin_img.png";
import signupImg from "../../assets/images/signup_img.png";
import logo from "../../assets//images/logo.svg";
import LoginFetch from "../../api/LoginFetch.js";
import SignUpFetch from "../../api/SignUpFetch.js";

export default function LoginSignup() {
  const [view, setView] = useState("signin");
  const [showPasswordSignIn, setShowPasswordSignIn] = useState(false);
  const [showPasswordSignUp, setShowPasswordSignUp] = useState(false);

  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");
  const [erroLogin, setErroLogin] = useState("");
  
  const [signupNome, setSignupNome] = useState(""); 
  const [signupEmail, setSignupEmail] = useState(""); 
  const [signupSenha, setSignupSenha] = useState(""); 
  const [signupCpf, setSignupCpf] = useState("");
  
  const [erroCadastro, setErroCadastro] = useState("");
  const [cadastroSucesso, setCadastroSucesso] = useState(false);

    async function handleLogin(e) {
      e.preventDefault();
      setErroLogin(""); 

      try {
        // 1. Chama a API e aguarda o objeto Usuario (ou um objeto de erro)
        const response = await LoginFetch(loginEmail, loginSenha); 

        // 2. Verifica se a resposta contém um erro
        if (response && response.error) {
          setErroLogin("Credenciais inválidas. Verifique seu e-mail e senha.");
          return;
        }
        
        // 3. Se não houver erro, a 'response' é o objeto Usuario
        if (response && response.idUsuario) { // Verifica se é um objeto Usuario válido (ex: tem 'idUsuario')
          const user = response;
          
          // 4. Salvar token (se fosse usar) ou dados do usuário
          // É recomendável salvar o tipo de usuário ou o objeto completo em um Context/Redux ou localStorage
          // Exemplo:
          localStorage.setItem('userData', JSON.stringify(user)); 
          
          // 5. Acessa o tipo de usuário (tipicamente snake_case se for do banco, ou camelCase no JSON do Spring)
          // O back-end Java tende a serializar como 'tipoUsuario' ou 'tipo_usuario'
          const tipoUser = user.tipoUsuario || user.tipo_usuario;
          
          // 6. Direcionar por tipo
          if (tipoUser) {
            // Converte o valor do Enum (ex: 'PACIENTE') para minúsculas (ex: 'paciente')
            const tipo = tipoUser.toLowerCase(); 

            if (tipo === "paciente") navigate("/menupaciente");
            else if (tipo === "medico") navigate("/menumedico");
            else if (tipo === "administrador") navigate("/menuadmin"); // AJUSTE: seu Enum é 'ADMINISTRADOR'
            else navigate("/"); 
          } else {
              setErroLogin("Tipo de usuário não reconhecido.");
          }
        } else {
          // Tratar falha de login, caso a API tenha retornado um 401
          setErroLogin("Credenciais inválidas. Verifique seu e-mail e senha.");
        }
      } catch (error) {
        console.error("Erro ao fazer login:", error);
        // Se a requisição falhar completamente (ex: problema de rede, CORS)
        setErroLogin("Erro ao fazer login. Por favor, tente novamente.");
      }
    }

    async function handleSignUp(e) {
      e.preventDefault();
      setErroCadastro("");
      setCadastroSucesso(false);

      if (!signupCpf || signupCpf.length !== 11 || !/^\d+$/.test(signupCpf)) {
        setErroCadastro("CPF inválido. Deve conter 11 dígitos numéricos.");
        return;
      }

    // 1. Cria o objeto de dados a ser enviado para a API
    const novoUsuario = {
        nome: signupNome,
        email: signupEmail,
        senha: signupSenha,
        cpf: signupCpf,
        // O tipo_usuario pode será PACIENTE por padrão
        tipoUsuario: "PACIENTE", 
    };

    try {
      const response = await SignUpFetch(novoUsuario);

      // 2. Verifica se a resposta contém um erro
      if (response && response.error) {
        setErroCadastro(`Erro no cadastro: ${response.error}`);
        return;
      }

      // 3. Sucesso!
      setCadastroSucesso(true);
      setErroCadastro("");
      
      // Limpa os campos após o sucesso
      setSignupNome("");
      setSignupEmail("");
      setSignupSenha("");
      setSignupCpf(""); 

      // Opcional: Redireciona para o login
      setTimeout(() => {
        setView("signin");
        setCadastroSucesso(false);
      }, 2000);

    } catch (error) {
      setErroCadastro("Erro de rede. Tente novamente.");
      console.error(error);
    }
  }

  return (
    <div className="card">
      {/* NAV */}
      <ul className="card-nav">
        <li>
          <img src={logo} alt="Logo" />
          <span className="active-bar" style={{
            top: view === "signin" ? "33.33%" : "66.66%"
          }}></span>
        </li>

        <li>
          <button
            type="button"
            className={`signin ${view === "signin" ? "active" : ""}`}
            onClick={() => setView("signin")}
          >
            <i className="ai-person-check"></i>
            <span>Logar</span>
          </button>
        </li>

        <li>
          <button
            type="button"
            className={`signup ${view === "signup" ? "active" : ""}`}
            onClick={() => setView("signup")}
          >
            <i className="ai-person-add"></i>
            <span>Cadastrar</span>
          </button>
        </li>
      </ul>

      {/* HERO */}
      <div className="card-hero">
        <div
          className="card-hero-inner"
          style={{ top: view === "signin" ? "0" : "-100%" }}
        >
          <div className="card-hero-content signin">
            <h2>Bem-vindo(a).</h2>
            <h3>Por favor, insira suas credenciais.</h3>
            <img src={signinImg} alt="signin" />
          </div>

          <br /><br />

          <div className="card-hero-content signup">
            <h2>Cadastre-se agora.</h2>
            <h3>Junte-se ao nosso sistema.</h3>
            <img src={signupImg} alt="signup" />
          </div>
        </div>
      </div>

      {/* FORMULÁRIOS */}
      <div className="card-form">
        <div
          className="forms"
          style={{ top: view === "signin" ? "0" : "-100%" }}
        >
          {/* LOGIN */}
          <form 
            className={view === "signin" ? "active" : ""} 
            onSubmit={handleLogin}
          >
            <p className="signup-text">
              Ainda não possui uma conta?{" "}
              <a onClick={() => setView("signup")}>Cadastrar-se</a>.
            </p>

            <label>Email</label>
            <div className="control">
              <input 
                type="email" 
                placeholder="seu_email@gmail.com" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <i className="ai-envelope"></i>
            </div>

            <label>Senha</label>
            <div className="control">
              <input
                type={showPasswordSignIn ? "text" : "password"}
                className="password-input"
                placeholder="•••••••••••••••••"
                value={loginSenha}
                onChange={(e) => setLoginSenha(e.target.value)}
              />
              <i
                className={`bx ${showPasswordSignIn ? "bx-hide" : "bx-show"} toggle-password`}
                onClick={() => setShowPasswordSignIn(!showPasswordSignIn)}
              ></i>
            </div>

            <button type="submit">ENTRAR</button> 
            {erroLogin && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                {erroLogin}
              </p>
            )}

            <p className="policy-footer">
              Ao clicar em Entrar, você concorda com nossos termos e condições
              e com nossa política de privacidade.
            </p>
          </form>

          {/* SIGN UP */}
          <form 
            className={view === "signup" ? "active" : ""}
            onSubmit={handleSignUp}
          >
            <p className="signin-text">
              Já possui uma conta?{" "}
              <a onClick={() => setView("signin")}>Logar</a>.
            </p>

            <label>Usuário</label>
            <div className="control">
              <input 
                type="text" 
                placeholder="Seu Nome"
                value={signupNome} 
                onChange={(e) => setSignupNome(e.target.value)}
                required
              />
              <i className="ai-person"></i>
            </div>

            <label>CPF</label>
            <div className="control">
              <input 
                type="text" 
                placeholder="000.000.000-00"
                value={signupCpf}
                onChange={(e) => {
                  // Formata o CPF enquanto o usuário digita
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 11) {
                    setSignupCpf(value);
                  }
                }}
                required
              />
              <i className="ai-id-card"></i>
            </div>

            <label>Email</label>
            <div className="control">
              <input 
                type="email" 
                placeholder="seuemail@gmail.com"
                value={signupEmail} 
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
              <i className="ai-envelope"></i>
            </div>

            <label>Senha</label>
            <div className="control">
              <input
                type={showPasswordSignUp ? "text" : "password"}
                className="password-input"
                placeholder="•••••••••••••••••"
                value={signupSenha}
                onChange={(e) => setSignupSenha(e.target.value)}
                required
              />
              <i
                className={`bx ${showPasswordSignUp ? "bx-hide" : "bx-show"} toggle-password`}
                onClick={() => setShowPasswordSignUp(!showPasswordSignUp)}
              ></i>
            </div>

            <button type="submit">CADASTRAR</button>

            {erroCadastro && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                {erroCadastro}
              </p>
            )}
            {cadastroSucesso && (
              <p style={{ color: "green", fontSize: "12px", marginTop: "4px" }}>
                Cadastro realizado com sucesso!
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}