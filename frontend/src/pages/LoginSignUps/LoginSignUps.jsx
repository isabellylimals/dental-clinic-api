import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSignUps.css";
import signinImg from "../../assets/images/signin_img.png";
import signupImg from "../../assets/images/signup_img.png";
import logo from "../../assets//images/logo.svg";
import LoginFetch from "../../api/LoginFetch.js";
import SignUpFetch from "../../api/SignUpFetch.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faIdCard, faLock } from "@fortawesome/free-solid-svg-icons";

export default function LoginSignup() {
  const [view, setView] = useState("signin");
  const [showPasswordSignIn, setShowPasswordSignIn] = useState(false);
  const [showPasswordSignUp, setShowPasswordSignUp] = useState(false);

  const navigate = useNavigate();

  // LOGIN
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");
  const [erroLogin, setErroLogin] = useState("");

  // CADASTRO
  const [signupNome, setSignupNome] = useState(""); 
  const [signupEmail, setSignupEmail] = useState(""); 
  const [signupSenha, setSignupSenha] = useState(""); 
  const [signupCpf, setSignupCpf] = useState("");  

  const [erroCadastro, setErroCadastro] = useState("");
  const [cadastroSucesso, setCadastroSucesso] = useState(false);

  // ---------------- LOGIN ----------------
  async function handleLogin(e) {
    e.preventDefault();
    setErroLogin(""); 

    try {
      const response = await LoginFetch(loginEmail, loginSenha);

      if (response && response.error) {
        setErroLogin("❌ Credenciais inválidas. Verifique seu e-mail e senha.");
        return;
      }
      
      if (response && response.idUsuario) {
        const user = response;

        localStorage.setItem("userData", JSON.stringify(user)); 

        const tipoUser = user.tipoUsuario || user.tipo_usuario;
        const tipo = tipoUser?.toLowerCase();

        if (tipo === "paciente") navigate("/menupaciente");
        else if (tipo === "medico") navigate("/menumedico");
        else if (tipo === "administrador") navigate("/menuadmin");
        else navigate("/");
      } else {
        setErroLogin("❌ Credenciais inválidas.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErroLogin("❌ Erro ao fazer login. Por favor, tente novamente.");
    }
  }

  // ---------------- CADASTRO ----------------
  async function handleSignUp(e) {
    e.preventDefault();
    setErroCadastro("");
    setCadastroSucesso(false);

    const novoUsuario = {
      nome: signupNome,
      email: signupEmail,
      senha: signupSenha,
      cpf: signupCpf,
      tipoUsuario: "PACIENTE"
    };

    try {
      const response = await SignUpFetch(novoUsuario);

      if (response && response.error) {
        setErroCadastro(`❌ Erro no cadastro: ${response.error}`);
        return;
      }

      setCadastroSucesso(true);
      setErroCadastro("");
      
      setSignupNome("");
      setSignupEmail("");
      setSignupSenha("");
      setSignupCpf("");

      setTimeout(() => {
        setView("signin");
        setCadastroSucesso(false);
      }, 2000);
    } catch (error) {
      setErroCadastro("❌ Erro de rede. Tente novamente.");
      console.error(error);
    }
  }

  return (
    <div className="login-page">
      <div className="card">
        {/* NAV */}
        <ul className="card-nav">
          <li>
            <img src={logo} alt="Logo" />
            <span
              className="active-bar"
              style={{ top: view === "signin" ? "33.33%" : "66.66%" }}
            ></span>
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

            <div className="card-hero-content signup">
             
  
              <img src={signupImg} alt="signup" />
            </div>
          </div>
        </div>

        {/* FORMULÁRIOS */}
        <div className="card-form">
          <div className="forms" style={{ top: view === "signin" ? "0" : "-100%" }}>
            
            {/* LOGIN */}
            <form className={view === "signin" ? "active" : ""} onSubmit={handleLogin}>
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
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
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
                <FontAwesomeIcon icon={faLock} className="input-icon" />
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
            </form>

            {/* CADASTRO */}
            <form className={view === "signup" ? "active" : ""} onSubmit={handleSignUp}>
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
                <FontAwesomeIcon icon={faUser} className="input-icon" />
              </div>

              <label>Email</label>
              <div className="control">
                <input 
                  type="email"
                  placeholder="seu_email@gmail.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              </div>

              <label>CPF</label>
              <div className="control">
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={signupCpf}
                  onChange={(e) => setSignupCpf(e.target.value)}
                  required
                />
                <FontAwesomeIcon icon={faIdCard} className="input-icon" />
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
                <FontAwesomeIcon icon={faLock} className="input-icon" />
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
                  ✅ Cadastro realizado com sucesso!
                </p>
              )}
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
