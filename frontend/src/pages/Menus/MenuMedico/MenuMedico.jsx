import { useState, useEffect } from "react";
import axios from "axios";
import "./MenuMedico.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCommentMedical, 
  faUserInjured, 
  faFileMedicalAlt, 
  faNotesMedical, 
  faHistory,
  faEnvelope,
  faCalendarAlt,
  faUserMd,
  faList,       
  faSearch,     
  faIdCard,     
  faMapMarkerAlt, 
  faPhone,
  faSave,
  faPen,
  faCalendarCheck,
  faClock,
  faEdit,
  faTooth,      // Novo ícone para Serviços
  faInfoCircle, // Novo ícone para Informações
  faStethoscope
} from "@fortawesome/free-solid-svg-icons";

const MenuMedico = () => {
  // --- 1. ESTADOS ---
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [viewAtual, setViewAtual] = useState("dashboard");
  
  // Dados API Gerais
  const [cpfBusca, setCpfBusca] = useState("");
  const [dados, setDados] = useState(null);
  const [listaPacientes, setListaPacientes] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [consultasMedico, setConsultasMedico] = useState([]);



  // Estados para Consultas
  const [listaConsultas, setListaConsultas] = useState([]);
  const [formConsulta, setFormConsulta] = useState({
    cpfPacienteInput: "",
    nomeServicoInput: "",
    data: "",
    hora: "",
    especialidadeInput: ""
  });

  // Estados para Serviços (NOVO)
  const [listaServicos, setListaServicos] = useState([]);
  const [buscaServico, setBuscaServico] = useState("");

  // Estados de Formulário
  const [textoForm, setTextoForm] = useState(""); 
  const [msgSucesso, setMsgSucesso] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
// PERFIL DO MÉDICO
const [medico, setMedico] = useState(null);
const [editMode, setEditMode] = useState(false);
const [salvando, setSalvando] = useState(false);

  // URLs da API
  const API_PRONTUARIOS = "http://localhost:8080/api/prontuarios";
  const API_PACIENTES = "http://localhost:8080/api/gerenciador-pacientes";
  const API_ANAMNESES = "http://localhost:8080/api/anamneses"; 
  const API_CONSULTAS = "http://localhost:8080/api/consultas";
  const API_SERVICOS = "http://localhost:8080/api/servicos";

  

  useEffect(() => {
  if (viewAtual === "agenda-medico" && medico) {
    carregarAgendamentos();
  }
}, [viewAtual, medico]);
  // --- EFEITO: CARREGAR LISTAS AUTOMATICAMENTE ---

const carregarAgendamentos = async () => {
    // 1. Segurança: Se não tiver médico ou ID, não faz nada
    if (!medico || !medico.idUsuario) return; 

    setLoading(true);

    try {
      // 2. AQUI ESTÁ A MÁGICA:
      // Substitua a URL fixa pela URL com o ID dinâmico.
      // Ajuste "http://localhost:8080/medicos" conforme o seu @RequestMapping no Java
      // Substitua a linha do fetch por esta fixa:
// Estamos forçando o ID 7 (que só tem 3 consultas no banco)
const response = await fetch(`http://localhost:8080/api/consultas/7/consultas`);
      
      if (!response.ok) {
        throw new Error("Erro ao buscar agendamentos");
      }

      const data = await response.json();
      setConsultasMedico(data); // Atualiza a lista na tela

    } catch (error) {
      console.error("Erro:", error);
      // Opcional: mostrar um alerta para o usuário
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {

    if (viewAtual === "listar-pacientes") {
        listarTodosPacientes();
    }

    if (viewAtual === "listar-servicos") {
        listarTodosServicos();
    }

    // 👇 ESTA LINHA É A QUE FALTAVA!
    if (viewAtual === "agendar-consulta") {
        listarTodosServicos();
    }

}, [viewAtual]);

useEffect(() => {
  const dadosLocal = localStorage.getItem("userData");
  if (dadosLocal) {
    const medicoLogado = JSON.parse(dadosLocal);
    setMedico(medicoLogado);
  }
}, []);

  // --- 2. LÓGICA DE NAVEGAÇÃO ---
  const toggleSubmenu = (menuName) => {
    setActiveSubmenu(activeSubmenu === menuName ? null : menuName);
  };
const salvarEdicao = async () => {
  if (!medico) return;

  setSalvando(true);
  try {
    const payload = {
      idUsuario: medico.idUsuario,
      nome: medico.nome,
      email: medico.email,
      telefone: medico.telefone,
      crm: medico.crm,
      especialidade: medico.especialidade,
      senha: medico.senha,          // se não quiser trocar, pode deixar como está
    };

    const response = await axios.put(
      "http://localhost:8080/api/medicos/editar",
      payload
    );

    // Atualiza o estado e o localStorage com o que veio do back
    localStorage.setItem("userData", JSON.stringify(response.data));
    setMedico(response.data);
    setEditMode(false);
    alert("Dados atualizados com sucesso!");
  } catch (e) {
    console.error(e);
    alert("Erro ao salvar alterações.");
  }
  setSalvando(false);
};
const encerrarConta = async () => {
  if (!medico || !medico.idUsuario) {
    alert("Usuário inválido.");
    return;
  }

  const confirmar = confirm(
    "Tem certeza que deseja encerrar sua conta?\nEsta ação vai desativar seu acesso."
  );

  if (!confirmar) return;

  try {
    await axios.delete(`http://localhost:8080/api/usuarios/${medico.idUsuario}`);

    // Limpa dados locais
    localStorage.removeItem("userData");

    alert("Conta encerrada com sucesso!");

    // Redireciona para login
    window.location.href = "/login";

  } catch (error) {
    console.error(error);
    alert("Erro ao encerrar conta.");
  }
};
const confirmarConsulta = async (idConsulta) => {
  setErro("");
  setMsgSucesso("");

  try {
    setLoading(true);

    // 🔥 Atualiza imediatamente a lista no front
    setConsultasMedico(prev =>
      prev.map(cons =>
        cons.idConsulta === idConsulta
          ? { ...cons, status: "CONFIRMADA" }
          : cons
      )
    );

    // 🔥 Envia para o backend
    await axios.post("http://localhost:8080/api/consultas/agendar", {
      idConsulta,
    });

    setMsgSucesso("Consulta confirmada com sucesso!");

    await buscarConsultasDoMedico();

  } catch (error) {
    console.error(error);
    setErro("Erro ao confirmar consulta.");
  } finally {
    setLoading(false);
  }
};




  const trocarTela = (viewName) => {
    if (!viewName) return;
    setViewAtual(viewName);
    // Limpeza Geral
    setDados(null);
    setErro("");
    setMsgSucesso("");
    setTextoForm("");
    setCpfBusca("");
    setListaPacientes([]);
    setListaConsultas([]);
    setListaServicos([]);
    setBuscaServico("");  
    setPacienteSelecionado(null);
    setFormConsulta({ cpfPacienteInput: "", nomeServicoInput: "", data: "", hora: "", especialidadeInput: "" });
  };

  // --- 3. FUNCIONALIDADES ANTERIORES ---
  const buscarProntuario = async () => {
    if (!cpfBusca) return setErro("Digite o CPF.");
    setLoading(true); setErro(""); setDados(null);
    try {
      const res = await axios.get(`${API_PRONTUARIOS}/consulta/${cpfBusca}`);
      setDados(res.data);
    } catch (error) { setErro("Prontuário não encontrado."); } finally { setLoading(false); }
  };

  const buscarAnamnese = async () => {
    if (!cpfBusca) return setErro("Digite o CPF.");
    setLoading(true); setErro(""); setDados(null); setMsgSucesso("");
    try {
      const res = await axios.get(`${API_PRONTUARIOS}/anamnese/${cpfBusca}`);
      setDados(res.data);
      return res.data;
    } catch (error) { setErro("Anamnese não encontrada."); return null; } finally { setLoading(false); }
  };

  const listarTodosPacientes = async () => {
    setLoading(true); setErro("");
    try {
      const res = await axios.get(API_PACIENTES);
      setListaPacientes(res.data);
    } catch (error) { setErro("Erro ao listar pacientes."); } finally { setLoading(false); }
  };


  
  const filtrarPacientes = async () => {
    // Limpa qualquer erro anterior
    setErro(""); 
    setListaPacientes([]);

    // 1. Remove pontos e traços, deixa só números
    const cpfLimpo = cpfBusca.replace(/\D/g, "");

    // 2. Validações Locais (Antes de ir no Java)
    if (!cpfLimpo) {
        return setErro("O campo CPF não pode ficar vazio.");
    }
    if (cpfLimpo.length !== 11) {
        return setErro("CPF inválido! O CPF deve conter exatamente 11 números.");
    }

    setLoading(true);
    
    try {
      const res = await axios.get(`${API_PACIENTES}/buscar-cpf?cpf=${cpfLimpo}`);
      
      if (res.data.length === 0) {
          setErro("Nenhum paciente encontrado com este CPF.");
      } else {
          setListaPacientes(res.data);
      }
    } catch (error) {
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const verFichaPaciente = async (id) => {
    setLoading(true); setErro("");
    try {
      const res = await axios.get(`${API_PACIENTES}/${id}`);
      setPacienteSelecionado(res.data);
      setViewAtual("ficha-detalhe");
    } catch (error) { setErro("Erro ao carregar ficha."); } finally { setLoading(false); }
  };

  const carregarParaEdicao = async () => {
    const res = await buscarAnamnese();
    if(res) { setTextoForm(res.respostas || ""); setMsgSucesso("Ficha carregada. Pode editar."); }
    else { setMsgSucesso("Criando nova anamnese."); }
  };

  const salvarNovaAnamnese = async () => {
    if (!cpfBusca || !textoForm) return setErro("Preencha CPF e respostas.");
    setLoading(true); setErro(""); setMsgSucesso("");
    try {
      await axios.post(`${API_ANAMNESES}/preencher`, { cpf: cpfBusca, respostas: textoForm });
      setMsgSucesso("Salvo com sucesso!");
    } catch (error) { setErro("Erro ao salvar."); } finally { setLoading(false); }
  };

  const salvarObservacao = async () => {
    if (!dados || !dados.idAnamnese) return setErro("Busque a anamnese.");
    setLoading(true); setErro(""); setMsgSucesso("");
    try {
      await axios.post(`${API_ANAMNESES}/observacao`, { idAnamnese: dados.idAnamnese, observacao: textoForm });
      setMsgSucesso("Observação adicionada!");
      setTextoForm(""); buscarAnamnese();
    } catch (error) { setErro("Erro ao salvar."); } finally { setLoading(false); }
  };

const agendarConsulta = async () => {
  const medicoLogado = JSON.parse(localStorage.getItem("userData"));

  if (!medicoLogado || !medicoLogado.idUsuario) {
      return setErro("Erro: Médico não identificado. Refaça o login.");
  }

  const { cpfPacienteInput, nomeServicoInput, data, hora, especialidadeInput } = formConsulta;

  if (!cpfPacienteInput || !nomeServicoInput || !data || !hora)
      return setErro("Preencha todos os campos obrigatórios.");

  setLoading(true);
  setErro("");
  setMsgSucesso("");

  try {
      const dataHoraFormatada = `${data}T${hora}:00`;

      await axios.post(`http://localhost:8080/api/consultas/solicitar`, {
          cpfPacienteInput,
          nomeServicoInput,
          especialidadeInput,
          dataHora: dataHoraFormatada,
          medicoId: medicoLogado.idUsuario
      });

      setMsgSucesso("Consulta agendada!");
      setFormConsulta({
          cpfPacienteInput: "",
          nomeServicoInput: "",
          data: "",
          hora: "",
          especialidadeInput: ""
      });

  } catch (error) {
      setErro("Erro ao agendar.");
  } finally {
      setLoading(false);
  }
};

  const buscarConsultas = async () => {
    if (!cpfBusca) return setErro("Digite o CPF.");
    setLoading(true); setErro(""); setListaConsultas([]);
    try {
        const res = await axios.get(`${API_CONSULTAS}/buscar-por-cpf?cpf=${cpfBusca}`);
        setListaConsultas(res.data);
        if(res.data.length === 0) setErro("Nenhuma consulta encontrada.");
    } catch (error) { setErro("Erro ao buscar."); } finally { setLoading(false); }
  };

  const atualizarStatusConsulta = async (idConsulta, novoStatus) => {
    if (!novoStatus || !window.confirm(`Mudar para ${novoStatus}?`)) return;
    try {
        await axios.put(`${API_CONSULTAS}/status/${idConsulta}`, { novoStatus });
        const listaAtualizada = listaConsultas.map(c => c.idConsulta === idConsulta ? { ...c, status: novoStatus } : c);
        setListaConsultas(listaAtualizada);
        alert("Status atualizado!");
    } catch (error) { alert("Erro ao atualizar status."); }
  };

  // --- 4. NOVAS FUNÇÕES (SERVIÇOS) ---
  // 1. Listar Todos (Corrige o bug da listagem)
  const listarTodosServicos = async () => {
    setLoading(true); setErro("");
    try {
        const res = await axios.get(API_SERVICOS);
        setListaServicos(res.data);
    } catch (error) {
        setErro("Erro ao carregar serviços.");
    } finally {
        setLoading(false);
    }
  };

  // 2. Buscar por Nome (Faz a busca funcionar)
  const filtrarServicos = async () => {
    if (!buscaServico) return setErro("Digite o nome do serviço.");
    setLoading(true); setErro(""); setListaServicos([]);
    try {
        const res = await axios.get(`${API_SERVICOS}/buscar?nome=${buscaServico}`);
        setListaServicos(res.data);
        if (res.data.length === 0) setErro("Nenhum serviço encontrado.");
    } catch (error) {
        setErro("Erro ao buscar serviço.");
    } finally {
        setLoading(false);
    }
  };

  // --- 5. MENU LATERAL ---
  const menuItems = [
    {
      name: "dashboard",
      icon: "ai-dashboard",
      label: "Dashboard",
      submenu: [{ label: "Visão Geral", view: "dashboard" }],
    },
      {
  name: "agenda",
  icon: "ai-calendar",
  label: "Agenda",
  submenu: [
    { label: "Agendamentos", view: "agenda-medico" }
  ],
},

    {
      name: "pacientes",
      icon: "ai-people-group",
      label: "Pacientes",
      submenu: [
        { label: "Buscar paciente", view: "buscar-paciente" },
        { label: "Listar pacientes", view: "listar-pacientes" },
        { label: "Consultar Prontuário", view: "prontuario" },
        { label: "Consultar Anamnese", view: "anamnese" },
      ],
    },
    { 
      name: "anamnese", icon: "ai-folder-add", label: "Anamnese", 
      submenu: [ { label: "Registrar anamnese", view: "registrar-anamnese" }, { label: "Registrar Observação", view: "registrar-observacao" } ] 
    },
    { 
      name: "consulta", icon: "fa-comment-medical", label: "Consultas", 
      submenu: [ { label: "Gerenciar consultas", view: "buscar-consulta" }, { label: "Agendar consulta", view: "agendar-consulta" } ] 
    },
    
    { 
      name: "servicos", icon: "ai-shipping-box-v1", label: "Serviços", 
      submenu: [
        { label: "Listar serviços", view: "listar-servicos" },
        // ADICIONE O VIEW AQUI EMBAIXO:
        { label: "Buscar serviços", view: "buscar-servicos" }, 
      ],
    },
    {
  name: "perfil",
  icon: "ai-person",
  label: "Meu Perfil",
  submenu: [
    { label: "Meus dados", view: "perfil" },
    { label: "Encerrar conta", view: "encerrar-conta" }
  ]
},

    { 
      name: "info", icon: "ai-info", label: "Informações da Clínica", 
      submenu: [{ label: "Localização e contatos", view: "info-clinica" }], // Adicionado View
    },
  ];

  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", backgroundColor: ""}}>
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <header>
          <button type="button" className="sidebar-burger"><i className="ai-three-line-horizontal"></i></button>
          <img src="logo.svg" alt="Logo" />
        </header>
        <div className="sidebar-content">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                <button type="button" className={activeSubmenu === item.name ? "active" : ""} onClick={() => toggleSubmenu(item.name)}>
                  {item.icon.startsWith("fa-") ? <FontAwesomeIcon icon={faCommentMedical} className="fa-icon" /> : <i className={item.icon}></i>}
                  <p>{item.label}</p>
                  <i className="ai-chevron-down-small"></i>
                </button>
                <div className={`sub-menu ${activeSubmenu === item.name ? "open" : ""}`}>
                  <ul>
                    {item.submenu.map((subItem, index) => (
                      <li key={index}>
                        <button className="sub-menu-item" onClick={() => trocarTela(subItem.view)}>
                          {subItem.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main style={{ flex: 1, marginLeft: "280px", padding: "40px" }}>
        
       {viewAtual === "dashboard" && (
  <div 
    style={{
      width: "100%",
      maxWidth: "950px",
      margin: "0 auto",
      paddingTop: "60px",
      animation: "fadeIn 0.6s ease"
    }}
  >
    <div
      style={{
        background: "white",
        padding: "60px 50px",
        borderRadius: "22px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
        border: "1px solid #e5e7eb",
        textAlign: "center"
      }}
    >

      {/* Título elegante */}
      <h1
        style={{
          fontSize: "2.7rem",
          color: "#1e293b",
          fontWeight: "800",
          letterSpacing: "-1px",
          marginBottom: "12px"
        }}
      >
        Painel do Médico
      </h1>

      {/* Linha decorativa */}
      <div
        style={{
          width: "75px",
          height: "4px",
          background: "#3b82f6",
          margin: "15px auto 30px auto",
          borderRadius: "4px"
        }}
      ></div>

      {/* Subtítulo */}
      <p
        style={{
          fontSize: "1.25rem",
          color: "#6b7280",
          maxWidth: "85%",
          margin: "0 auto",
          lineHeight: "1.7"
        }}
      >
        Bem-vindo ao seu ambiente de gestão clínica.  
        Utilize o menu lateral para acessar pacientes, consultas, prontuários e configurações.
      </p>

      {/* Caixa informativa com Icone profissional */}
      <div
        style={{
          marginTop: "50px",
          background: "#f8fafc",
          padding: "38px",
          borderRadius: "18px",
          border: "1px dashed #d0d7e1",
          color: "#475569",
          fontSize: "1.15rem",
          fontWeight: "500",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px"
        }}
      >
        <FontAwesomeIcon icon={faStethoscope} size="xl" color="#3b82f6" />
        <span>
          <strong>Dica:</strong> Acesse <strong>Meu Perfil</strong> para atualizar ou ajustar seus dados.
        </span>
      </div>

    </div>
  </div>
)}

{viewAtual === "perfil" && medico && (
  <div className="content-container fade-in">
    <h2 className="page-title"><FontAwesomeIcon icon={faUserMd}/> Meu Perfil</h2>

    <div className="result-card">
      <div className="info-grid">

        <div className="clean-box">
          <strong>Nome</strong>
          {editMode ? (
            <input value={medico.nome} onChange={(e)=>setMedico({...medico, nome:e.target.value})}/>
          ) : (
            <p>{medico.nome}</p>
          )}
        </div>

        <div className="clean-box">
          <strong>Email</strong>
          {editMode ? (
            <input value={medico.email} onChange={(e)=>setMedico({...medico, email:e.target.value})}/>
          ) : (
            <p>{medico.email}</p>
          )}
        </div>

        <div className="clean-box">
          <strong>Telefone</strong>
          {editMode ? (
            <input value={medico.telefone || ""} onChange={(e)=>setMedico({...medico, telefone:e.target.value})}/>
          ) : (
            <p>{medico.telefone || "-"}</p>
          )}
        </div>

        <div className="clean-box">
          <strong>CRM</strong>
          {editMode ? (
            <input value={medico.crm || ""} onChange={(e)=>setMedico({...medico, crm:e.target.value})}/>
          ) : (
            <p>{medico.crm}</p>
          )}
        </div>

        <div className="clean-box">
          <strong>Especialidade</strong>
          {editMode ? (
            <input value={medico.especialidade || ""} onChange={(e)=>setMedico({...medico, especialidade:e.target.value})}/>
          ) : (
            <p>{medico.especialidade}</p>
          )}
        </div>

        <div className="clean-box">
          <strong>Senha</strong>
          {editMode ? (
            <input type="password" value={medico.senha} onChange={(e)=>setMedico({...medico, senha:e.target.value})}/>
          ) : (
            <p>********</p>
          )}
        </div>

      </div>

      {/* Botões */}
      <div style={{marginTop:"20px", display:"flex", justifyContent:"end", gap:"15px"}}>
        {!editMode && (
          <button className="btn-green" onClick={()=>setEditMode(true)}>
            Editar
          </button>
        )}
        {editMode && (
          <>
            <button className="btn-back" onClick={()=>setEditMode(false)}>Cancelar</button>
            <button className="btn-green" onClick={salvarEdicao} disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar"}
            </button>
          </>
        )}
      </div>

    </div>

  </div>
)}

        {/* --- PRONTUÁRIOS E ANAMNESES --- */}
        {viewAtual === "prontuario" && (
          <div className="content-container">
            <h2 className="page-title"><FontAwesomeIcon icon={faFileMedicalAlt} /> Consultar Prontuário</h2>
            <div className="search-bar">
              <input type="text" placeholder="Digite o CPF..." value={cpfBusca} onChange={(e) => setCpfBusca(e.target.value)} />
              <button onClick={buscarProntuario} disabled={loading}>{loading ? "..." : "Pesquisar"}</button>
            </div>
            {erro && <div className="error-msg">{erro}</div>}
            {dados && (
              <div className="result-card fade-in">
                <div className="patient-header">
                  <div className="avatar-icon"><FontAwesomeIcon icon={faUserInjured} /></div>
                  <div className="patient-info">
                    <h3>{dados.paciente?.nome}</h3>
                    <p><FontAwesomeIcon icon={faEnvelope} /> {dados.paciente?.email}</p>
                    <p className="data-info"><FontAwesomeIcon icon={faCalendarAlt} /> Aberto em: {new Date(dados.dataCriacao).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="prontuario-id">#{dados.idProntuario}</div>
                </div>
                <hr />
                <h4 className="section-title"><FontAwesomeIcon icon={faHistory} /> Histórico de Evolução</h4>
                {dados.registros && dados.registros.length > 0 ? (
                  <div className="timeline">
                    {dados.registros.map((reg, idx) => (
                      <div key={idx} className="timeline-item">
                        <div className="timeline-date">{new Date(reg.dataHora).toLocaleDateString('pt-BR')}<br/><small>{new Date(reg.dataHora).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</small></div>
                        <div className="timeline-content">
                          <div className="medico-badge"><FontAwesomeIcon icon={faUserMd} /> Resp: Dr(a). {reg.medico ? reg.medico.nome : "Não informado"}</div>
                          <div className="obs-content"><strong>Evolução:</strong><p>{reg.observacoes}</p></div>
                          {reg.diagnostico && (<div className="diag-box"><strong>Diagnóstico:</strong> {reg.diagnostico}</div>)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="empty-state">Nenhum registro encontrado.</p>}
              </div>
            )}
          </div>
        )}

        {viewAtual === "anamnese" && (
          <div className="content-container">
            <h2 className="page-title green-theme"><FontAwesomeIcon icon={faNotesMedical} /> Consultar Anamnese</h2>
            <div className="search-bar">
              <input type="text" placeholder="Digite o CPF..." value={cpfBusca} onChange={(e) => setCpfBusca(e.target.value)} />
              <button onClick={buscarAnamnese} disabled={loading} className="btn-green">{loading ? "..." : "Pesquisar"}</button>
            </div>
            {erro && <div className="error-msg">{erro}</div>}
            {dados && (
              <div className="result-card fade-in">
                <div className="anamnese-header">
                  <div><h3>Ficha de Anamnese</h3><p style={{marginTop:8, color:'#444'}}><FontAwesomeIcon icon={faUserInjured} /> Paciente: <strong>{dados.paciente ? dados.paciente.nome : "Paciente"}</strong></p></div>
                  <span className="data-badge">Data: {new Date(dados.dataPreenchimento).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="anamnese-grid">
                  <div className="anamnese-box clean-box"><strong>🗣️ Respostas</strong><p>{dados.respostas}</p></div>
                  <div className="anamnese-box clean-box"><strong>👨‍⚕️ Observações</strong><p>{dados.informacoes || "Nenhuma."}</p></div>
                </div>
              </div>
            )}
          </div>
        )}

        {viewAtual === "listar-pacientes" && (
          <div className="content-container">
            <h2 className="page-title"><FontAwesomeIcon icon={faList} /> Lista de Pacientes</h2>
            {loading && <p style={{textAlign:'center'}}>Carregando...</p>}
            {erro && <div className="error-msg">{erro}</div>}
            {listaPacientes.length > 0 && (
              <div className="result-card fade-in" style={{padding: 0, overflow: 'hidden'}}>
                <table className="custom-table">
                  <thead><tr><th>ID</th><th>Nome</th><th>Telefone</th><th>Nascimento</th><th>Endereço</th><th>Ação</th></tr></thead>
                  <tbody>{listaPacientes.map(p => (<tr key={p.idUsuario}><td>#{p.idUsuario}</td><td>{p.nome}</td><td>{p.telefone || "-"}</td><td>{p.dataNascimento ? new Date(p.dataNascimento).toLocaleDateString('pt-BR') : "-"}</td><td>{p.endereco || "-"}</td><td><button className="btn-small" onClick={() => verFichaPaciente(p.idUsuario)}>Ver Ficha</button></td></tr>))}</tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {viewAtual === "buscar-paciente" && (
          <div className="content-container">
            <h2 className="page-title"><FontAwesomeIcon icon={faSearch} /> Buscar Paciente</h2>
            
            {/* BARRA DE BUSCA COM BORDA VERMELHA SE TIVER ERRO */}
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Digite o CPF..." 
                value={cpfBusca} 
                onChange={(e) => {
                    setCpfBusca(e.target.value);
                    setErro(""); // Limpa o erro assim que digitar algo novo
                }} 
                // AQUI OCORRE A MÁGICA DA BORDA VERMELHA
                style={erro ? { border: "2px solid #dc2626", background: "#fff5f5" } : {}}
              />
              <button onClick={filtrarPacientes} disabled={loading}>
                {loading ? "..." : "Buscar"}
              </button>
            </div>

            {/* MENSAGEM DE ERRO EMBAIXO DO CAMPO */}
            {erro && <div className="error-msg" style={{marginTop: '10px'}}>⚠️ {erro}</div>}

            {listaPacientes.length > 0 && (
              <div className="result-card fade-in" style={{padding: 0, overflow: 'hidden'}}>
                <table className="custom-table">
                  <thead><tr><th>Nome</th><th>Telefone</th><th>Nascimento</th><th>Endereço</th><th>Ação</th></tr></thead>
                  <tbody>
                    {listaPacientes.map(p => (
                      <tr key={p.idUsuario}>
                        <td>{p.nome}</td>
                        <td>{p.telefone || "-"}</td>
                        <td>{p.dataNascimento ? new Date(p.dataNascimento).toLocaleDateString('pt-BR') : "-"}</td>
                        <td>{p.endereco || "-"}</td>
                        <td><button className="btn-small" onClick={() => verFichaPaciente(p.idUsuario)}>Ver Ficha</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {viewAtual === "ficha-detalhe" && pacienteSelecionado && (
          <div className="content-container fade-in">
            <button className="btn-back" onClick={() => trocarTela("listar-pacientes")}>⬅ Voltar</button>
            <div className="result-card">
              <div className="patient-header"><div className="avatar-icon"><FontAwesomeIcon icon={faIdCard} /></div><div className="patient-info"><h3>{pacienteSelecionado.nome}</h3><p className="data-info">Status: Ativo</p></div></div><hr/>
              <div className="anamnese-grid"><div className="clean-box"><strong>Email:</strong> {pacienteSelecionado.email}</div><div className="clean-box"><strong>Telefone:</strong> {pacienteSelecionado.telefone || "-"}</div><div className="clean-box"><strong>Nascimento:</strong> {pacienteSelecionado.dataNascimento ? new Date(pacienteSelecionado.dataNascimento).toLocaleDateString('pt-BR') : "-"}</div><div className="clean-box" style={{gridColumn: 'span 2'}}><strong>Endereço:</strong> {pacienteSelecionado.endereco || "-"}</div></div>
              <div style={{marginTop: 30, textAlign: 'right'}}><button className="btn-green" onClick={() => { setCpfBusca(pacienteSelecionado.cpf); trocarTela("prontuario"); buscarProntuario(); }}>Ir para Prontuário</button></div>
            </div>
          </div>
        )}

        {viewAtual === "registrar-anamnese" && (
          <div className="content-container">
            <h2 className="page-title"><FontAwesomeIcon icon={faPen} /> Nova / Editar Anamnese</h2>
            <div className="search-bar" style={{marginBottom: 20}}><input type="text" placeholder="CPF..." value={cpfBusca} onChange={(e) => setCpfBusca(e.target.value)} /><button onClick={carregarParaEdicao}>Buscar Dados</button></div>
            <div className="result-card fade-in">
                {msgSucesso && <div className="success-msg" style={{marginTop:0, marginBottom:20}}>{msgSucesso}</div>}
                <div style={{marginBottom: 20}}><label style={{fontWeight: 'bold', display:'block', marginBottom: 8}}>Respostas:</label><textarea rows="8" className="textarea-field" placeholder="Ex: Paciente relata..." value={textoForm} onChange={(e) => setTextoForm(e.target.value)}></textarea></div>
                <button onClick={salvarNovaAnamnese} disabled={loading} className="btn-green"><FontAwesomeIcon icon={faSave} /> {loading ? "Salvando..." : "Salvar"}</button>
                {erro && <div className="error-msg">{erro}</div>}
            </div>
          </div>
        )}

        {viewAtual === "registrar-observacao" && (
          <div className="content-container">
            <h2 className="page-title"><FontAwesomeIcon icon={faCommentMedical} /> Registrar Observação</h2>
            <div className="search-bar"><input type="text" placeholder="Buscar Anamnese por CPF..." value={cpfBusca} onChange={(e) => setCpfBusca(e.target.value)} /><button onClick={buscarAnamnese} className="btn-green">Buscar</button></div>
            {erro && <div className="error-msg">{erro}</div>}
            {dados && (<div className="result-card fade-in"><div style={{marginBottom: 20}}><strong style={{display:'block', marginBottom:10}}>Atual:</strong><div className="clean-box" style={{background: '#3d3a3aff', fontSize: '0.9rem'}}>{dados.informacoes || "Sem observações."}</div></div><div style={{marginBottom: 20}}><label style={{fontWeight: 'bold', display:'block', marginBottom: 8}}>Nova Observação:</label><textarea rows="4" className="textarea-field" value={textoForm} onChange={(e) => setTextoForm(e.target.value)}></textarea></div><button onClick={salvarObservacao} disabled={loading} className="btn-green"><FontAwesomeIcon icon={faSave} /> Adicionar</button>{msgSucesso && <div className="success-msg">{msgSucesso}</div>}</div>)}
          </div>
        )}

        {/* --- CONSULTAS --- */}
        {viewAtual === "agendar-consulta" && (
          <div className="content-container">
            <h2 className="page-title"><FontAwesomeIcon icon={faCalendarCheck} /> Agendar Consulta</h2>
            <div className="result-card fade-in">
                <div className="form-grid">
                    <div className="form-group"><label>CPF do Paciente:</label><input type="text" className="input-field" placeholder="Apenas números" value={formConsulta.cpfPacienteInput} onChange={(e) => setFormConsulta({...formConsulta, cpfPacienteInput: e.target.value})} /></div>
                    <div className="form-group"><label>Serviço:</label>
                    <select
                      className="input-field"
                      value={formConsulta.nomeServicoInput}
                      onChange={(e) =>
                        setFormConsulta({
                          ...formConsulta,
                          nomeServicoInput: e.target.value
                        })
                      }
                    >
                      <option value="">Selecione...</option>

                      {listaServicos.map((s) => (
                        <option key={s.idServico} value={s.nomeServico}>
                          {s.nomeServico}
                        </option>
                      ))}
                    </select>
                    </div>
                    <div className="form-group"><label>Especialidade:</label><input type="text" className="input-field" placeholder="Ex: Ortodontia" value={formConsulta.especialidadeInput} onChange={(e) => setFormConsulta({...formConsulta, especialidadeInput: e.target.value})} /></div>
                    <div className="form-group"><label>Data:</label><input type="date" className="input-field" value={formConsulta.data} onChange={(e) => setFormConsulta({...formConsulta, data: e.target.value})} /></div>
                    <div className="form-group"><label>Hora:</label><input type="time" className="input-field" value={formConsulta.hora} onChange={(e) => setFormConsulta({...formConsulta, hora: e.target.value})} /></div>
                </div>
                <button onClick={agendarConsulta} disabled={loading} className="btn-green" style={{marginTop: 20, width: '100%'}}><FontAwesomeIcon icon={faSave} /> {loading ? "Agendando..." : "Confirmar Agendamento"}</button>
                {msgSucesso && <div className="success-msg">{msgSucesso}</div>}
                {erro && <div className="error-msg">{erro}</div>}
            </div>
          </div>
        )}

        {viewAtual === "buscar-consulta" && (
          <div className="content-container">
            <h2 className="page-title"><FontAwesomeIcon icon={faCalendarAlt} /> Gerenciar Consultas</h2>
            <div className="search-bar"><input type="text" placeholder="Digite o CPF..." value={cpfBusca} onChange={(e) => setCpfBusca(e.target.value)} /><button onClick={buscarConsultas} disabled={loading}>{loading ? "..." : "Buscar"}</button></div>
            {erro && <div className="error-msg">{erro}</div>}
            {listaConsultas.length > 0 && (
                <div className="result-card fade-in" style={{padding: 0, overflow: 'hidden'}}>
                    <table className="custom-table">
                        <thead><tr><th>Data/Hora</th><th>Serviço</th><th>Médico</th><th>Status Atual</th><th>Ação (Mudar Status)</th></tr></thead>
                        <tbody>{listaConsultas.map((c) => (
                                <tr key={c.idConsulta}>
                                    <td>{new Date(c.dataHora).toLocaleDateString('pt-BR')} <br/><small><FontAwesomeIcon icon={faClock}/> {new Date(c.dataHora).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</small></td>
                                    <td>{c.servico ? c.servico.nomeServico : "-"}</td>
                                    <td>{c.medico ? c.medico.nome : "A definir"}</td>
                                    <td><span className={`status-badge status-${c.status?.toLowerCase()}`}>{c.status}</span></td>
                                    <td>
                                        <select className="status-select" onChange={(e) => atualizarStatusConsulta(c.idConsulta, e.target.value)} defaultValue="">
                                            <option value="" disabled>Alterar para...</option><option value="CONFIRMADA">Confirmada</option><option value="REALIZADA">Realizada</option><option value="CANCELADA">Cancelada</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}</tbody>
                    </table>
                </div>
            )}
          </div>
        )}

        {/* --- 5. NOVAS TELAS: LISTAR SERVIÇOS --- */}
        {viewAtual === "listar-servicos" && (
          <div className="content-container">
            <h2 className="page-title"><FontAwesomeIcon icon={faTooth} /> Serviços Disponíveis</h2>
            
            {/* O useEffect carrega automaticamente, mas deixamos msg de loading */}
            {loading && <p style={{textAlign:'center', color: '#666'}}>Carregando catálogo...</p>}
            {erro && <div className="error-msg">{erro}</div>}

            {listaServicos.length > 0 && (
              <div className="result-card fade-in" style={{padding: 0, overflow: 'hidden'}}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th style={{width: '10%'}}>ID</th>
                      <th style={{width: '30%'}}>Nome do Serviço</th>
                      <th>Descrição Detalhada</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listaServicos.map((s) => (
                      <tr key={s.idServico}>
                        <td style={{fontWeight: 'bold'}}>#{s.idServico}</td>
                        <td style={{color: '#003153', fontWeight: 'bold'}}>{s.nomeServico}</td>
                        <td>{s.descricao || "Sem descrição disponível."}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TELA: BUSCAR SERVIÇOS */}
        {viewAtual === "buscar-servicos" && (
          <div className="content-container">
            <h2 className="page-title"><FontAwesomeIcon icon={faSearch} /> Buscar Serviço</h2>
            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder="Digite o nome (ex: Canal)..." 
                    value={buscaServico} 
                    onChange={(e) => setBuscaServico(e.target.value)} 
                />
                <button onClick={filtrarServicos} disabled={loading}>Buscar</button>
            </div>
            {erro && <div className="error-msg">{erro}</div>}
            
            {/* Reutiliza a mesma tabela para mostrar o resultado */}
            {listaServicos.length > 0 && (
              <div className="result-card fade-in" style={{padding: 0, overflow: 'hidden'}}>
                <table className="custom-table">
                  <thead><tr><th>ID</th><th>Serviço</th><th>Descrição</th></tr></thead>
                  <tbody>
                    {listaServicos.map((s) => (
                      <tr key={s.idServico}>
                        <td>#{s.idServico}</td>
                        <td>{s.nomeServico}</td>
                        <td>{s.descricao}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
{viewAtual === "encerrar-conta" && (
  <div 
    className="content-container fade-in" 
    style={{ maxWidth: "650px", margin: "0 auto" }}
  >
    <div
      style={{
        background: "white",
        padding: "45px",
        borderRadius: "18px",
        boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
        border: "1px solid #e5e7eb",
        textAlign: "center",
        animation: "fadeIn 0.3s ease"
      }}
    >
      {/* TÍTULO */}
      <h2
        style={{
          color: "#d32f2f",
          fontSize: "2.2rem",
          marginBottom: "18px",
          fontWeight: "800"
        }}
      >
        Encerrar Conta
      </h2>

      {/* EXPLICAÇÃO DO QUE É A AÇÃO */}
      <p
        style={{
          fontSize: "17px",
          lineHeight: "1.7",
          color: "#4b5563",
          marginBottom: "25px"
        }}
      >
        Esta opção permite <strong>desativar sua conta</strong> no sistema.  
        Após encerrar, você não poderá mais acessar sua área médica.
      </p>

      {/* ALERTA GRANDE */}
      <div
        style={{
          background: "#fff5f5",
          border: "1px solid #f8bcbc",
          padding: "20px",
          borderRadius: "12px",
          color: "#b71c1c",
          fontWeight: "600",
          marginBottom: "35px",
          fontSize: "15.5px"
        }}
      >
        ⚠️ Atenção: Esta ação é permanente.  
        Somente um administrador poderá reativar sua conta no futuro.
      </div>

      {/* BOTÃO CENTRALIZADO */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => encerrarConta()}
          style={{
            backgroundColor: "#d32f2f",
            color: "white",
            border: "none",
            padding: "15px 40px",
            borderRadius: "12px",
            fontSize: "18px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "0.2s",
            boxShadow: "0 4px 12px rgba(211,47,47,0.35)"
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#b71c1c")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#d32f2f")}
        >
          Encerrar Minha Conta
        </button>
      </div>
    </div>
  </div>
)}
{viewAtual === "agenda-medico" && (
  <div className="content-container fade-in">
    <h2 className="page-title">
      <FontAwesomeIcon icon={faCalendarAlt} /> Meus Agendamentos
    </h2>

    {loading && <p>Carregando agenda...</p>}

    {!loading && consultasMedico.length === 0 && (
      <div className="empty-state">
        Nenhuma consulta encontrada.
      </div>
    )}

    {!loading && consultasMedico.length > 0 && (
      <div className="result-card fade-in">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Paciente</th>
              <th>Data</th>
              <th>Hora</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {consultasMedico.map(c => (
              <tr key={c.idConsulta}>
                <td>#{c.idConsulta}</td>
                <td>{c.nomePaciente}</td>
                <td>{new Date(c.dataHora).toLocaleDateString("pt-BR")}</td>
                <td>{new Date(c.dataHora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</td>
                
                {/* --- AQUI FOI A ALTERAÇÃO --- */}
                {/* Removi o display:flex/gap pois agora só tem o badge */}
                <td> 
                  <span className="status-badge" style={{
                    background: 
                      c.status === "CONFIRMADA" ? "#c8f7c5" :
                      c.status === "CANCELADA" ? "#f8d7da" :
                      "#fff3cd",
                    color:
                      c.status === "CONFIRMADA" ? "#2e7d32" :
                      c.status === "CANCELADA" ? "#c62828" :
                      "#856404",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    display: "inline-block" // Garante que o badge fique bonito
                  }}>
                    {c.status}
                  </span>
                  {/* O botão de confirmar foi removido daqui */}
                </td>
                {/* --------------------------- */}

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}

        {/* --- 6. NOVA TELA: INFORMAÇÕES DA CLÍNICA --- */}
        {viewAtual === "info-clinica" && (
          <div className="content-container fade-in">
            <h2 className="page-title"><FontAwesomeIcon icon={faInfoCircle} /> Informações da Clínica</h2>
            
            <div className="result-card">
                {/* Logo e Nome */}
                <div style={{
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: 30
}}>
  <img src="logo.svg" alt="DentalClinic" style={{height: 80, marginBottom: 15}} />
  <h3 style={{color: '#003153', fontSize: '1.5rem', margin: 0}}>DentalClinic Advanced</h3>
  <p style={{color: '#666', marginTop: 5}}>Excelência em Odontologia Digital</p>
</div>

                
                <hr style={{margin: '25px 0', border: 0, borderTop: '1px solid #eee'}} />

                <div className="form-grid">
                    <div className="clean-box">
                        <strong style={{color: '#0063ccff', fontSize: '1.1rem', display:'flex', alignItems:'center', gap: 10}}>
                            <FontAwesomeIcon icon={faMapMarkerAlt} /> Endereço
                        </strong>
                        <p style={{marginTop: 15, lineHeight: 1.6}}>
                            Av. Paulista, 1000 - Bela Vista<br/>
                            Edifício Medical Center, 5º Andar<br/>
                            São Paulo - SP, 01310-100
                        </p>
                    </div>

                    <div className="clean-box">
                        <strong style={{color: '#012254', fontSize: '1.1rem', display:'flex', alignItems:'center', gap: 10}}>
                            <FontAwesomeIcon icon={faPhone} /> Contatos
                        </strong>
                        <p style={{marginTop: 15, lineHeight: 1.6}}>
                            <strong>Recepção:</strong> (11) 3333-4444<br/>
                            <strong>WhatsApp:</strong> (11) 99999-8888<br/>
                            <strong>Email:</strong> contato@dentalclinic.com
                        </p>
                    </div>

                    <div className="clean-box">
                        <strong style={{color: '#012254', fontSize: '1.1rem', display:'flex', alignItems:'center', gap: 10}}>
                            <FontAwesomeIcon icon={faClock} /> Horário de Atendimento
                        </strong>
                        <p style={{marginTop: 15, lineHeight: 1.6}}>
                            <strong>Segunda a Sexta:</strong> 08:00 às 19:00<br/>
                            <strong>Sábado:</strong> 08:00 às 13:00<br/>
                            <strong>Domingo:</strong> Fechado
                        </p>
                    </div>

                    
                </div>
            </div>
          </div>
        )}

      </main>

      {/* --- ESTILOS CSS --- */}
      <style>{`
        .content-container { width: 100%; max-width: 1100px; margin: 0 auto; }
        .page-title { color: #003153; margin-bottom: 25px; font-size: 1.8rem; display: flex; align-items: center; gap: 12px; }
        .page-title.green-theme { color: #003153; }
        .search-bar { display: flex; gap: 10px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .search-bar input { flex: 1; padding: 12px 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; outline: none; }
        .search-bar input:focus { border-color: #012254; }
        .search-bar button { padding: 0 30px; background: #012254; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; }
        .search-bar button.btn-green { background: #012254; }
        .result-card { background: white; border-radius: 16px; padding: 40px; margin-top: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #f0f0f0; }
        .error-msg { background: #fee2e2; color: #dc2626; padding: 15px; border-radius: 8px; margin-top: 20px; font-weight: 500; }
        .success-msg { background: #dcfce7; color: #166534; padding: 15px; border-radius: 8px; margin-top: 20px; font-weight: 600; border-left: 5px solid #166534; }
        
        .patient-header { display: flex; align-items: center; gap: 25px; margin-bottom: 30px; }
        .avatar-icon { width: 70px; height: 70px; background: #f0f7ff; color: #012254; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; }
        .patient-info h3 { margin: 0; color: #1e293b; font-size: 1.6rem; }
        .patient-info p { margin: 5px 0 0; color: #64748b; font-size: 1rem; }
        .prontuario-id { margin-left: auto; background: #f8fafc; padding: 8px 20px; border-radius: 30px; color: #64748b; font-weight: bold; border: 1px solid #e2e8f0; }
        .section-title { color: #334155; margin-top: 40px; margin-bottom: 25px; font-size: 1.3rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; }
        .timeline { border-left: 3px solid #e2e8f0; padding-left: 30px; margin-left: 15px; }
        .timeline-item { position: relative; margin-bottom: 35px; }
        .timeline-item::before { content: ''; position: absolute; left: -38px; top: 6px; width: 14px; height: 14px; background: #012254; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 0 2px #e2e8f0; }
        .timeline-date { font-size: 0.95rem; color: #64748b; font-weight: 600; margin-bottom: 8px; }
        .timeline-content { background: #ffffff; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
        .medico-badge { display:inline-flex; align-items:center; gap:6px; background: #f1f5f9; color: #334155; padding: 5px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; margin-bottom: 12px; }
        .obs-content p { color: #334155; line-height: 1.6; font-size: 1rem; }
        .diag-box { margin-top: 15px; background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; color: #334155; }
        .anamnese-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
        .data-badge { background: #f8fafc; padding: 8px 16px; border-radius: 8px; font-weight: bold; color: #475569; border: 1px solid #e2e8f0; }
        .anamnese-grid { display: grid; gap: 25px; grid-template-columns: 1fr 1fr; }
        .clean-box { background: #ffffff; border: 1px solid #e2e8f0; padding: 25px; border-radius: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
        .clean-box strong { display: block; margin-bottom: 12px; font-size: 1.1rem; color: #1e293b; }
        .clean-box p { color: #475569; line-height: 1.6; }
        
        /* TABLE CSS */
        .custom-table { width: 100%; border-collapse: collapse; }
        .custom-table th { background: #f8fafc; color: #475569; font-weight: 600; text-align: left; padding: 15px 20px; border-bottom: 1px solid #e2e8f0; }
        .custom-table td { padding: 15px 20px; border-bottom: 1px solid #f1f5f9; color: #334155; }
        .custom-table tr:hover { background: #f8fafc; }
        .btn-green { background: #012254; color: white; padding: 10px 20px; border-radius: 8px; border:none; cursor: pointer; font-weight: 600; }
        .btn-small { padding: 6px 12px; background: #e0f2fe; color: #012254; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; font-weight: 600; }
        .btn-back { background: transparent; border: none; color: #64748b; font-size: 1rem; cursor: pointer; margin-bottom: 10px; font-weight: 600; }
        
        /* INPUTS E TEXTAREAS */
        .input-field { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; outline: none; }
        .input-field:focus { border-color: #012254; }
        .textarea-field { width: 100%; padding: 15px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; font-family: inherit; resize: vertical; outline: none; }
        .textarea-field:focus { border-color: #012254; }

        /* FORMULÁRIO GRID */
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-group { display: flex; flex-direction: column; }
        .form-group label { margin-bottom: 5px; font-weight: 600; color: #333; }

        /* STATUS BADGES */
        .status-badge { padding: 5px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: bold; }
        .status-solicitada { background: #fef9c3; color: #854d0e; }
        .status-confirmada { background: #dbeafe; color: #1e40af; }
        .status-realizada { background: #dcfce7; color: #166534; }
        .status-cancelada { background: #fee2e2; color: #991b1b; }
        .status-select { padding: 8px; border-radius: 6px; border: 1px solid #ddd; cursor: pointer; }

        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .empty-state { text-align: center; padding: 50px; color: #94a3b8; font-style: italic; }
        .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 20px; }
      `}</style>
    </div>
  );
};

export default MenuMedico;