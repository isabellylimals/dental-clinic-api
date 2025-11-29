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
  faPhone       
} from "@fortawesome/free-solid-svg-icons";

const MenuMedico = () => {
  // --- 1. ESTADOS ---
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [viewAtual, setViewAtual] = useState("dashboard");
  
  // Dados API
  const [cpfBusca, setCpfBusca] = useState("");
  const [dados, setDados] = useState(null);
  const [listaPacientes, setListaPacientes] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const API_PRONTUARIOS = "http://localhost:8080/api/prontuarios";
  const API_PACIENTES = "http://localhost:8080/api/gerenciador-pacientes";

  // --- EFEITO: CARREGAR LISTA AUTOMATICAMENTE ---
  useEffect(() => {
    if (viewAtual === "listar-pacientes") {
        listarTodosPacientes();
    }
  }, [viewAtual]);

  // --- 2. LÓGICA ---
  const toggleSubmenu = (menuName) => {
    setActiveSubmenu(activeSubmenu === menuName ? null : menuName);
  };

  const trocarTela = (viewName) => {
    if (!viewName) return;
    setViewAtual(viewName);
    setDados(null);
    setErro("");
    setCpfBusca("");
    setListaPacientes([]);
    setPacienteSelecionado(null);
  };

  // --- 3. BUSCAS (PRONTUÁRIO / ANAMNESE) ---
  const buscarProntuario = async () => {
    if (!cpfBusca) return setErro("Digite o CPF do paciente.");
    setLoading(true); setErro(""); setDados(null);
    try {
      const res = await axios.get(`${API_PRONTUARIOS}/consulta/${cpfBusca}`);
      setDados(res.data);
    } catch (error) {
      setErro("Prontuário não encontrado.");
    } finally {
      setLoading(false);
    }
  };

  const buscarAnamnese = async () => {
    if (!cpfBusca) return setErro("Digite o CPF do paciente.");
    setLoading(true); setErro(""); setDados(null);
    try {
      const res = await axios.get(`${API_PRONTUARIOS}/anamnese/${cpfBusca}`);
      setDados(res.data);
    } catch (error) {
      setErro("Anamnese não encontrada.");
    } finally {
      setLoading(false);
    }
  };

  // --- 4. GESTÃO DE PACIENTES ---
  const listarTodosPacientes = async () => {
    setLoading(true); setErro("");
    try {
      const res = await axios.get(API_PACIENTES);
      setListaPacientes(res.data);
    } catch (error) {
      setErro("Erro ao buscar lista de pacientes.");
    } finally {
      setLoading(false);
    }
  };

  const filtrarPacientes = async () => {
    if (!cpfBusca) return setErro("Digite um CPF para filtrar.");
    setLoading(true); setErro(""); setListaPacientes([]);
    try {
      const res = await axios.get(`${API_PACIENTES}/buscar-cpf?cpf=${cpfBusca}`);
      setListaPacientes(res.data);
    } catch (error) {
      setErro("Nenhum paciente encontrado.");
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
    } catch (error) {
      setErro("Erro ao carregar ficha.");
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
      submenu: [{ label: "Agendamentos" }],
    },
    {
      name: "pacientes",
      icon: "ai-people-group",
      label: "Pacientes",
      submenu: [
        { label: "Buscar paciente", view: "buscar-paciente" },
        { label: "Listar pacientes", view: "listar-pacientes" },
        // REMOVIDO: { label: "Ficha do Paciente" } - Agora só acessa via tabela
        { label: "Consultar Prontuário", view: "prontuario" },
        { label: "Consultar Anamnese", view: "anamnese" },
      ],
    },
    { name: "anamnese", icon: "ai-folder-add", label: "Anamnese", submenu: [{ label: "Registrar anamnese" }, { label: "Registrar Observação" }] },
    { name: "consulta", icon: "fa-comment-medical", label: "Consultas", submenu: [{ label: "Buscar consulta" }, { label: "Agendar" }] },
    { name: "servicos", icon: "ai-shipping-box-v1", label: "Serviços", submenu: [{ label: "Listar" }] },
    { name: "perfil", icon: "ai-person", label: "Meu Perfil", submenu: [{ label: "Meus dados" }] },
    { name: "info", icon: "ai-info", label: "Info", submenu: [{ label: "Contatos" }] },
  ];

  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      
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
        
        {/* VIEW 1: DASHBOARD */}
        {viewAtual === "dashboard" && (
          <div className="card-welcome">
            <h1>👨‍⚕️ Painel Médico</h1>
            <p>Selecione uma opção no menu lateral para começar.</p>
          </div>
        )}

        {/* VIEW 2: PRONTUÁRIO */}
        {viewAtual === "prontuario" && (
          <div className="content-container">
            <h2 className="page-title"><FontAwesomeIcon icon={faFileMedicalAlt} /> Consultar Prontuário</h2>
            <div className="search-bar">
              <input type="text" placeholder="Digite o CPF do Paciente..." value={cpfBusca} onChange={(e) => setCpfBusca(e.target.value)} />
              <button onClick={buscarProntuario} disabled={loading}>{loading ? "..." : "Pesquisar"}</button>
            </div>
            {erro && <div className="error-msg">{erro}</div>}
            {dados && (
              <div className="result-card fade-in">
                <div className="patient-header">
                  <div className="avatar-icon"><FontAwesomeIcon icon={faUserInjured} /></div>
                  <div className="patient-info">
                    <h3>{dados.paciente?.nome || "Nome não informado"}</h3>
                    <p><FontAwesomeIcon icon={faEnvelope} /> {dados.paciente?.email}</p>
                    <p className="data-info"><FontAwesomeIcon icon={faCalendarAlt} /> Aberto em: {new Date(dados.dataCriacao).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="prontuario-id">Prontuário #{dados.idProntuario}</div>
                </div>
                <hr />
                <h4 className="section-title"><FontAwesomeIcon icon={faHistory} /> Histórico de Evolução Clínica</h4>
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

        {/* VIEW 3: ANAMNESE */}
        {viewAtual === "anamnese" && (
          <div className="content-container">
            <h2 className="page-title green-theme"><FontAwesomeIcon icon={faNotesMedical} /> Consultar Anamnese</h2>
            <div className="search-bar">
              <input type="text" placeholder="Digite o CPF do Paciente..." value={cpfBusca} onChange={(e) => setCpfBusca(e.target.value)} />
              <button onClick={buscarAnamnese} disabled={loading} className="btn-green">{loading ? "..." : "Pesquisar"}</button>
            </div>
            {erro && <div className="error-msg">{erro}</div>}
            {dados && (
              <div className="result-card fade-in">
                <div className="anamnese-header">
                  <div>
                    <h3>Ficha de Anamnese</h3>
                    <p style={{marginTop: '8px', fontSize: '1.1rem', color: '#444'}}><FontAwesomeIcon icon={faUserInjured} /> Paciente: <strong>{dados.paciente ? dados.paciente.nome : "Paciente"}</strong></p>
                  </div>
                  <span className="data-badge">Data: {new Date(dados.dataPreenchimento).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="anamnese-grid">
                  <div className="anamnese-box clean-box"><strong>🗣️ Respostas do Paciente</strong><p>{dados.respostas}</p></div>
                  <div className="anamnese-box clean-box"><strong>👨‍⚕️ Observações Médicas</strong><p>{dados.informacoes || "Nenhuma observação."}</p></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: LISTAR PACIENTES */}
        {viewAtual === "listar-pacientes" && (
          <div className="content-container">
            <h2 className="page-title"><FontAwesomeIcon icon={faList} /> Lista de Pacientes</h2>
            
            {loading && <p style={{textAlign:'center', color: '#666'}}>Carregando lista...</p>}
            {erro && <div className="error-msg">{erro}</div>}

            {listaPacientes.length > 0 && (
              <div className="result-card fade-in" style={{padding: 0, overflow: 'hidden'}}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Telefone</th>
                      <th>Data Nascimento</th>
                      <th>Endereço</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listaPacientes.map((p) => (
                      <tr key={p.idUsuario}>
                        <td>#{p.idUsuario}</td>
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

        {/* VIEW 5: BUSCAR PACIENTE */}
        {viewAtual === "buscar-paciente" && (
          <div className="content-container">
            <h2 className="page-title"><FontAwesomeIcon icon={faSearch} /> Buscar Paciente</h2>
            <div className="search-bar">
              <input type="text" placeholder="Digite o CPF para filtrar..." value={cpfBusca} onChange={(e) => setCpfBusca(e.target.value)} />
              <button onClick={filtrarPacientes} disabled={loading}>{loading ? "..." : "Buscar"}</button>
            </div>
            {erro && <div className="error-msg">{erro}</div>}
            {listaPacientes.length > 0 && (
              <div className="result-card fade-in" style={{padding: 0, overflow: 'hidden'}}>
                <table className="custom-table">
                  <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Telefone</th>
                        <th>Data Nascimento.</th>
                        <th>Endereço</th>
                        <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listaPacientes.map((p) => (
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

        {/* VIEW 6: FICHA DETALHE (CPF REMOVIDO) */}
        {viewAtual === "ficha-detalhe" && pacienteSelecionado && (
          <div className="content-container fade-in">
            <button className="btn-back" onClick={() => trocarTela("listar-pacientes")}>⬅ Voltar</button>
            <div className="result-card">
              <div className="patient-header">
                <div className="avatar-icon"><FontAwesomeIcon icon={faIdCard} /></div>
                <div className="patient-info">
                  <h3>{pacienteSelecionado.nome}</h3>
                  <p className="data-info">Status: Ativo</p>
                </div>
              </div>
              <hr/>
              <div className="anamnese-grid">
                {/* CPF REMOVIDO DAQUI CONFORME PEDIDO */}
                <div className="clean-box"><strong>Email:</strong> {pacienteSelecionado.email}</div>
                <div className="clean-box"><strong>Telefone:</strong> {pacienteSelecionado.telefone || "-"}</div>
                <div className="clean-box"><strong>Data Nascimento:</strong> {pacienteSelecionado.dataNascimento ? new Date(pacienteSelecionado.dataNascimento).toLocaleDateString('pt-BR') : "-"}</div>
                <div className="clean-box" style={{gridColumn: 'span 2'}}><strong>Endereço:</strong> {pacienteSelecionado.endereco || "-"}</div>
              </div>
              <div style={{marginTop: 30, textAlign: 'right'}}>
                 
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
        .search-bar input:focus { border-color: #007bff; }
        .search-bar button { padding: 0 30px; background: #007bff; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; }
        .search-bar button.btn-green { background: #007bff; }
        .result-card { background: white; border-radius: 16px; padding: 40px; margin-top: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #f0f0f0; }
        .error-msg { background: #fee2e2; color: #dc2626; padding: 15px; border-radius: 8px; margin-top: 20px; font-weight: 500; }
        .patient-header { display: flex; align-items: center; gap: 25px; margin-bottom: 30px; }
        .avatar-icon { width: 70px; height: 70px; background: #f0f7ff; color: #007bff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; }
        .patient-info h3 { margin: 0; color: #1e293b; font-size: 1.6rem; }
        .patient-info p { margin: 5px 0 0; color: #64748b; font-size: 1rem; }
        .prontuario-id { margin-left: auto; background: #f8fafc; padding: 8px 20px; border-radius: 30px; color: #64748b; font-weight: bold; border: 1px solid #e2e8f0; }
        .section-title { color: #334155; margin-top: 40px; margin-bottom: 25px; font-size: 1.3rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; }
        .timeline { border-left: 3px solid #e2e8f0; padding-left: 30px; margin-left: 15px; }
        .timeline-item { position: relative; margin-bottom: 35px; }
        .timeline-item::before { content: ''; position: absolute; left: -38px; top: 6px; width: 14px; height: 14px; background: #007bff; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 0 2px #e2e8f0; }
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
        .btn-green { background: #007bff; color: white; padding: 10px 20px; border-radius: 8px; border:none; cursor: pointer; font-weight: 600; }
        .btn-small { padding: 6px 12px; background: #e0f2fe; color: #007bff; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; font-weight: 600; }
        .btn-back { background: transparent; border: none; color: #64748b; font-size: 1rem; cursor: pointer; margin-bottom: 10px; font-weight: 600; }
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .empty-state { text-align: center; padding: 50px; color: #94a3b8; font-style: italic; }
        .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 20px; }
      `}</style>
    </div>
  );
};

export default MenuMedico;