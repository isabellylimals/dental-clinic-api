import { useState, useEffect } from "react";
import axios from "axios";
import "./MenuAdmin.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUserDoctor, 
  faUserInjured, 
  faPlus, 
  faEdit, 
  faTrash, 
  faCheckCircle, 
  faSearch,
  faList,
  faSave,
  faTooth // Ícone para Serviços
} from "@fortawesome/free-solid-svg-icons";

const MenuAdmin = () => {
  // --- 1. ESTADOS ---
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [telaAtiva, setTelaAtiva] = useState("dashboard");

  // Estados de Dados (Usuários)
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  
  // Estados de Dados (Serviços) - NOVO
  const [listaServicos, setListaServicos] = useState([]);
  const [formServico, setFormServico] = useState({ nomeServico: "", descricao: "" });

  // Estado do Formulário (Usuários)
  const [formData, setFormData] = useState({
    idUsuario: "", nome: "", email: "", senha: "", telefone: "",
    tipoUsuario: "MEDICO", crm: "", especialidade: "", cpf: "",
    dataNascimento: "", endereco: ""
  });

  // Feedback
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const API_URL = "http://localhost:8080/api/usuarios";
  const API_SERVICOS = "http://localhost:8080/api/servicos"; // Nova URL

  // --- 2. GERENCIAMENTO DE TELAS E LIMPEZA ---
  const toggleSubmenu = (menuName) => {
    setActiveSubmenu(activeSubmenu === menuName ? null : menuName);
  };

  const trocarTela = (nomeTela) => {
    setTelaAtiva(nomeTela);
    // Limpa estados ao trocar de tela
    setListaUsuarios([]);
    setListaServicos([]); // Limpa lista de serviços
    setUsuarioSelecionado(null);
    setErro("");
    setSucesso("");
    setLoading(false);
    limparFormulario();
  };

  const limparFormulario = () => {
    setFormData({
      idUsuario: "", nome: "", email: "", senha: "", telefone: "",
      tipoUsuario: "MEDICO", crm: "", especialidade: "", cpf: "",
      dataNascimento: "", endereco: ""
    });
    setFormServico({ nomeServico: "", descricao: "" }); // Limpa form de serviço
  };

  // --- 3. FUNÇÕES DE API (USUÁRIOS) ---
  const listarPorTipo = async (tipo) => { 
    setLoading(true); setErro("");
    try {
      const res = await axios.get(`${API_URL}/${tipo}`);
      setListaUsuarios(res.data);
    } catch (error) { setErro("Erro ao carregar lista de usuários."); } finally { setLoading(false); }
  };

  const cadastrarUsuario = async () => {
    setLoading(true); setErro(""); setSucesso("");
    try {
      await axios.post(`${API_URL}/cadastro`, formData);
      setSucesso("Usuário cadastrado com sucesso!");
      limparFormulario();
    } catch (error) { setErro(error.response?.data || "Erro ao cadastrar usuário."); } finally { setLoading(false); }
  };

  const editarUsuario = async () => {
    setLoading(true); setErro(""); setSucesso("");
    try {
      await axios.put(`${API_URL}/editar`, formData);
      setSucesso("Usuário atualizado com sucesso!");
      setUsuarioSelecionado(null); 
      limparFormulario();
    } catch (error) { setErro("Erro ao editar usuário."); } finally { setLoading(false); }
  };

  const desativarUsuario = async (id) => {
    if (!window.confirm("Tem certeza que deseja desativar este usuário?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("Usuário desativado.");
      setListaUsuarios(listaUsuarios.map(u => u.idUsuario === id ? {...u, stats: false} : u));
    } catch (error) { alert("Erro ao desativar."); }
  };

  const reativarUsuario = async (id) => {
    if (!window.confirm("Deseja reativar esta conta?")) return;
    try {
      await axios.put(`${API_URL}/${id}/ativar`);
      alert("Conta reativada com sucesso!");
      setListaUsuarios(listaUsuarios.map(u => u.idUsuario === id ? {...u, stats: true} : u));
    } catch (error) { alert("Erro ao reativar."); }
  };

  const prepararEdicao = (usuario) => {
    setUsuarioSelecionado(usuario);
    setFormData({
      ...usuario,
      crm: usuario.crm || "", especialidade: usuario.especialidade || "",
      cpf: usuario.cpf || "", endereco: usuario.endereco || "", senha: usuario.senha || ""
    });
  };

  // --- 4. FUNÇÕES DE API (SERVIÇOS - NOVO) ---

  // Cadastrar Serviço
  const cadastrarServico = async () => {
    if (!formServico.nomeServico) return setErro("O nome do serviço é obrigatório.");
    
    setLoading(true); setErro(""); setSucesso("");
    try {
        await axios.post(API_SERVICOS, formServico);
        setSucesso("Serviço cadastrado com sucesso!");
        setFormServico({ nomeServico: "", descricao: "" });
    } catch (error) {
        setErro("Erro ao cadastrar serviço.");
    } finally {
        setLoading(false);
    }
  };

  // Listar Serviços
  const listarServicos = async () => {
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

  // --- EFEITOS ---
  useEffect(() => {
    if (telaAtiva === "listar-medicos") listarPorTipo("medicos");
    if (telaAtiva === "listar-pacientes") listarPorTipo("pacientes");
    
    // Novo: Carregar serviços se a tela for a de listar
    if (telaAtiva === "listar-servicos") listarServicos();

    if (telaAtiva === "desativar-usuario" || telaAtiva === "reativar-conta" || telaAtiva === "editar-usuario") {
        const carregarTodos = async () => {
            try { const res = await axios.get(API_URL); setListaUsuarios(res.data); } 
            catch (e) { setErro("Erro ao carregar lista completa."); }
        };
        carregarTodos();
    }
  }, [telaAtiva]);


  // --- 5. MENU LATERAL ---
  const menuItems = [
    {
      name: "dashboard",
      icon: "ai-dashboard",
      label: "Dashboard",
      submenu: [{ label: "Visão Geral", view: "dashboard" }],
    },
    {
      name: "usuarios",
      icon: "ai-people-group",
      label: "Usuários",
      submenu: [
        { label: "Cadastrar Usuário", view: "cadastrar-usuario" },
        { label: "Editar Usuário", view: "editar-usuario" },
        { label: "Desativar Usuário", view: "desativar-usuario" },
        { label: "Reativar Conta", view: "reativar-conta" },
        { label: "Listar Médicos", view: "listar-medicos" },
        { label: "Listar Pacientes", view: "listar-pacientes" },
      ],
    },
    { 
      name: "servicos", 
      icon: "ai-shipping-box-v1", 
      label: "Serviços", 
      submenu: [
        { label: "Cadastrar Serviço", view: "cadastrar-servico" }, // Novo
        { label: "Listar Serviços", view: "listar-servicos" }      // Novo
      ] 
    },
    { name: "relatorio", icon: "ai-folder", label: "Relatório", submenu: [{ label: "Gerar Relatório" }] },
    { name: "perfil", icon: "ai-person", label: "Meu Perfil", submenu: [{ label: "Meus dados" }, { label: "Encerrar conta" }] },
    { name: "config", icon: "ai-gear", label: "Configurações", submenu: [{ label: "Informações da Clínica" }] },
  ];

  return (
    <div className="menu-admin-container">
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
                  {item.icon === "fa-user-doctor" ? <FontAwesomeIcon icon={faUserDoctor} className="fa-icon" /> : <i className={item.icon}></i>}
                  <p>{item.label}</p>
                  <i className="ai-chevron-down-small"></i>
                </button>
                <div className={`sub-menu ${activeSubmenu === item.name ? "open" : ""}`}>
                  <ul>
                    {item.submenu.map((subItem, index) => (
                      <li key={index}>
                        <button className="sub-menu-item" onClick={() => trocarTela(subItem.view)}>{subItem.label}</button>
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
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Painel Administrador</h1>
        </header>

        <div className="dashboard-content" style={{padding: '20px'}}>
          
          {/* DASHBOARD */}
          {telaAtiva === "dashboard" && (
            <div className="welcome-card">
              <h2>Bem-vindo, Administrador!</h2>
              <p>Utilize o menu lateral para gerenciar usuários, serviços e relatórios.</p>
            </div>
          )}

          {/* 1. CADASTRAR USUÁRIO */}
          {telaAtiva === "cadastrar-usuario" && (
            <div className="form-card">
              <h2><FontAwesomeIcon icon={faPlus} /> Cadastrar Novo Usuário</h2>
              
              <div className="form-group">
                <label>Tipo de Usuário:</label>
                <select 
                    value={formData.tipoUsuario} 
                    onChange={(e) => setFormData({...formData, tipoUsuario: e.target.value})}
                    className="input-field"
                >
                    <option value="MEDICO">Médico</option>
                    <option value="PACIENTE">Paciente</option>
                    <option value="ADMINISTRADOR">Administrador</option>
                </select>
              </div>

              {/* CAMPOS COMUNS */}
              <div className="form-grid">
                  <input type="text" placeholder="Nome Completo" className="input-field" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
                  <input type="email" placeholder="Email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  <input type="password" placeholder="Senha" className="input-field" value={formData.senha} onChange={e => setFormData({...formData, senha: e.target.value})} />
                  <input type="text" placeholder="Telefone" className="input-field" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} />
              </div>

              {/* CAMPOS ESPECÍFICOS */}
              {formData.tipoUsuario === "MEDICO" && (
                  <div className="form-grid" style={{marginTop: 15}}>
                      <input type="text" placeholder="CRM" className="input-field" value={formData.crm} onChange={e => setFormData({...formData, crm: e.target.value})} />
                      <input type="text" placeholder="Especialidade" className="input-field" value={formData.especialidade} onChange={e => setFormData({...formData, especialidade: e.target.value})} />
                  </div>
              )}
              {formData.tipoUsuario === "PACIENTE" && (
                  <div className="form-grid" style={{marginTop: 15}}>
                      <input type="text" placeholder="CPF" className="input-field" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} />
                      <input type="text" placeholder="Endereço" className="input-field" value={formData.endereco} onChange={e => setFormData({...formData, endereco: e.target.value})} />
                      <div>
                        <label style={{fontSize: 12}}>Data de Nascimento:</label>
                        <input type="date" className="input-field" value={formData.dataNascimento} onChange={e => setFormData({...formData, dataNascimento: e.target.value})} />
                      </div>
                  </div>
              )}

              <button className="btn-green" onClick={cadastrarUsuario} disabled={loading}>{loading ? "Cadastrando..." : "Cadastrar"}</button>
              {sucesso && <div className="success-msg">{sucesso}</div>}
              {erro && <div className="error-msg">{erro}</div>}
            </div>
          )}

          {/* 2. EDITAR USUÁRIO */}
          {telaAtiva === "editar-usuario" && (
            <div className="list-card">
              <h2><FontAwesomeIcon icon={faEdit} /> Editar Usuário</h2>
              <p style={{marginBottom: 20}}>Selecione um usuário da lista abaixo para editar.</p>
              
              {usuarioSelecionado ? (
                  <div className="form-card" style={{border: '1px solid #ccc'}}>
                      <h3>Editando: {usuarioSelecionado.nome}</h3>
                      <div className="form-grid">
                          <input type="text" placeholder="Nome" className="input-field" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
                          <input type="text" placeholder="Telefone" className="input-field" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} />
                          <input type="password" placeholder="Nova Senha (opcional)" className="input-field" value={formData.senha} onChange={e => setFormData({...formData, senha: e.target.value})} />
                      </div>
                      {formData.tipoUsuario === "MEDICO" && (<div className="form-grid" style={{marginTop: 10}}><input type="text" placeholder="Especialidade" className="input-field" value={formData.especialidade} onChange={e => setFormData({...formData, especialidade: e.target.value})} /></div>)}
                      {formData.tipoUsuario === "PACIENTE" && (<div className="form-grid" style={{marginTop: 10}}><input type="text" placeholder="Endereço" className="input-field" value={formData.endereco} onChange={e => setFormData({...formData, endereco: e.target.value})} /></div>)}

                      <div style={{marginTop: 20, display:'flex', gap: 10}}>
                        <button className="btn-green" onClick={editarUsuario}>Salvar Alterações</button>
                        <button className="btn-small" style={{background:'#ccc'}} onClick={() => setUsuarioSelecionado(null)}>Cancelar</button>
                      </div>
                  </div>
              ) : (
                  <div className="table-responsive">
                    <table className="custom-table">
                        <thead><tr><th>ID</th><th>Nome</th><th>Tipo</th><th>Ação</th></tr></thead>
                        <tbody>{listaUsuarios.map(u => (<tr key={u.idUsuario}><td>{u.idUsuario}</td><td>{u.nome}</td><td>{u.tipoUsuario}</td><td><button className="btn-small" onClick={() => prepararEdicao(u)}>Editar</button></td></tr>))}</tbody>
                    </table>
                  </div>
              )}
              {sucesso && <div className="success-msg">{sucesso}</div>}
            </div>
          )}

          {/* 3 & 4. DESATIVAR / REATIVAR */}
          {(telaAtiva === "desativar-usuario" || telaAtiva === "reativar-conta") && (
            <div className="list-card">
                <h2>Gerenciar Status da Conta</h2>
                <p>{telaAtiva === "desativar-usuario" ? "Desativar usuários ativos." : "Reativar usuários inativos."}</p>
                <div className="table-responsive">
                    <table className="custom-table">
                        <thead><tr><th>Nome</th><th>Email</th><th>Tipo</th><th>Status</th><th>Ação</th></tr></thead>
                        <tbody>
                            {listaUsuarios
                                .filter(u => telaAtiva === "desativar-usuario" ? u.stats === true : u.stats === false) 
                                .map(u => (
                                <tr key={u.idUsuario}>
                                    <td>{u.nome}</td>
                                    <td>{u.email}</td>
                                    <td>{u.tipoUsuario}</td>
                                    <td><span style={{padding:'4px 8px', borderRadius:'12px', fontSize:'0.8rem', backgroundColor: u.stats ? '#dcfce7' : '#fee2e2', color: u.stats ? '#166534' : '#991b1b'}}>{u.stats ? "ATIVO" : "INATIVO"}</span></td>
                                    <td>
                                        {u.stats ? (<button className="btn-small" style={{backgroundColor: '#fee2e2', color:'#991b1b'}} onClick={() => desativarUsuario(u.idUsuario)}><FontAwesomeIcon icon={faTrash} /> Desativar</button>) : (<button className="btn-small" style={{backgroundColor: '#dcfce7', color:'#166534'}} onClick={() => reativarUsuario(u.idUsuario)}><FontAwesomeIcon icon={faCheckCircle} /> Reativar</button>)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          )}

          {/* 5. LISTAR MÉDICOS */}
          {telaAtiva === "listar-medicos" && (
            <div className="list-card">
                <h2><FontAwesomeIcon icon={faUserDoctor} /> Lista de Médicos</h2>
                <table className="custom-table">
                    <thead><tr><th>Nome</th><th>CRM</th><th>Especialidade</th><th>Email</th><th>Status</th></tr></thead>
                    <tbody>{listaUsuarios.map(m => (<tr key={m.idUsuario}><td>{m.nome}</td><td>{m.crm}</td><td>{m.especialidade}</td><td>{m.email}</td><td>{m.stats ? "Ativo" : "Inativo"}</td></tr>))}</tbody>
                </table>
            </div>
          )}

          {/* 6. LISTAR PACIENTES */}
          {telaAtiva === "listar-pacientes" && (
            <div className="list-card">
                <h2><FontAwesomeIcon icon={faUserInjured} /> Lista de Pacientes</h2>
                <table className="custom-table">
                    <thead><tr><th>Nome</th><th>CPF</th><th>Telefone</th><th>Email</th><th>Status</th></tr></thead>
                    <tbody>{listaUsuarios.map(p => (<tr key={p.idUsuario}><td>{p.nome}</td><td>{p.cpf}</td><td>{p.telefone}</td><td>{p.email}</td><td>{p.stats ? "Ativo" : "Inativo"}</td></tr>))}</tbody>
                </table>
            </div>
          )}

          {/* --- NOVAS TELAS: SERVIÇOS --- */}

          {/* 7. CADASTRAR SERVIÇO */}
          {telaAtiva === "cadastrar-servico" && (
            <div className="form-card">
                <h2><FontAwesomeIcon icon={faPlus} /> Cadastrar Novo Serviço</h2>
                
                <div className="form-group">
                    <label>Nome do Serviço:</label>
                    <input type="text" className="input-field" placeholder="Ex: Clareamento, Limpeza..." 
                        value={formServico.nomeServico} onChange={(e) => setFormServico({...formServico, nomeServico: e.target.value})} 
                    />
                </div>
                <div className="form-group" style={{marginTop: 15}}>
                    <label>Descrição:</label>
                    <textarea rows="4" className="input-field" style={{resize:'vertical'}} placeholder="Descreva o serviço..." 
                        value={formServico.descricao} onChange={(e) => setFormServico({...formServico, descricao: e.target.value})} 
                    />
                </div>

                <button className="btn-green" onClick={cadastrarServico} disabled={loading} style={{marginTop: 20}}>
                    {loading ? "Salvando..." : "Salvar Serviço"}
                </button>

                {sucesso && <div className="success-msg">{sucesso}</div>}
                {erro && <div className="error-msg">{erro}</div>}
            </div>
          )}

          {/* 8. LISTAR SERVIÇOS */}
          {telaAtiva === "listar-servicos" && (
            <div className="list-card">
                <h2><FontAwesomeIcon icon={faTooth} /> Catálogo de Serviços</h2>
                {listaServicos.length > 0 ? (
                    <table className="custom-table">
                        <thead><tr><th>ID</th><th>Nome</th><th>Descrição</th></tr></thead>
                        <tbody>
                            {listaServicos.map(s => (
                                <tr key={s.idServico}>
                                    <td style={{fontWeight:'bold'}}>#{s.idServico}</td>
                                    <td>{s.nomeServico}</td>
                                    <td>{s.descricao || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{padding: 20, textAlign:'center'}}>Nenhum serviço cadastrado.</p>
                )}
            </div>
          )}

        </div>
      </div>

      {/* CSS INLINE */}
      <style>{`
        .dashboard-content { background-color: #f4f7f6; min-height: 100vh; }
        .form-card, .list-card, .welcome-card {
            background: white; padding: 30px; border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin-bottom: 20px;
        }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
        .input-field {
            width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;
            font-size: 16px; outline: none;
        }
        .input-field:focus { border-color: #007bff; }
        .btn-green {
            padding: 10px 20px; background: #28a745; color: white; border: none;
            border-radius: 6px; cursor: pointer; font-weight: bold;
        }
        .btn-green:hover { background: #218838; }
        .btn-small {
            padding: 6px 12px; background: #e0f2fe; color: #007bff; border: none;
            border-radius: 6px; cursor: pointer; font-size: 0.9rem; font-weight: 600;
        }
        .custom-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .custom-table th { text-align: left; padding: 12px; background: #f8f9fa; color: #555; }
        .custom-table td { padding: 12px; border-bottom: 1px solid #eee; color: #333; }
        .success-msg { color: #155724; background: #d4edda; padding: 10px; border-radius: 5px; margin-top: 15px; }
        .error-msg { color: #721c24; background: #f8d7da; padding: 10px; border-radius: 5px; margin-top: 15px; }
      `}</style>
    </div>
  );
};

export default MenuAdmin;