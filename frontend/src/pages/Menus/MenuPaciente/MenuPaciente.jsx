import { useState, useEffect } from 'react';
import './MenuPaciente.css';

const MenuPaciente = () => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [activeContent, setActiveContent] = useState(null);
  const [error, setError] = useState(null);
  const [consultas, setConsultas] = useState([]);
  const [solicitacoesPendentes, setSolicitacoesPendentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cpfPaciente, setCpfPaciente] = useState('');
  const [prontuario, setProntuario] = useState(null);
const [anamnese, setAnamnese] = useState(null);
  const [idPaciente, setIdPaciente] = useState(null);
  const [userData, setUserData] = useState(null);
  const [dadosCarregados, setDadosCarregados] = useState(false);
  const [servicos, setServicos] = useState([]);
  const [servicosFiltrados, setServicosFiltrados] = useState([]);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [loadingServicos, setLoadingServicos] = useState(false);
  const API_URL = 'http://localhost:8080/api';
const [editMode, setEditMode] = useState(false);
 const [formData, setFormData] = useState({
  nome: "",
  cpf: "",
  email: "",
  telefone: "",
  dataNascimento: "",
  endereco: ""
});
const renderContent = (menuName, label) => {
  switch (menuName) {
    case 'consultas':
      return renderConsultaContent(label);
    case 'servicos':
      return renderServicosContent(label);
    case 'anamnese':
      return renderAnamneseContent(label);
    case 'prontuario':
      return renderProntuarioContent(label);
    case 'perfil':
      return renderPerfilContent(label);
    case 'info':
      return renderInfoContent(label);
    default:
      return <div>Conteúdo em desenvolvimento.</div>;
  }
};


const cardAviso = {
  background: "#fff7ed",
  border: "1px solid #fed7aa",
  padding: "35px",
  borderRadius: "18px",
  textAlign: "center",
  color: "#9a3412",
  boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
  maxWidth: "700px",
  margin: "0 auto"
};

const cardAvisoGrande = { ...cardAviso, maxWidth: "800px" };

const tituloAviso = {
  marginBottom: "10px",
  fontSize: "1.4rem",
  fontWeight: 700
};

const textoAviso = {
  maxWidth: "500px",
  margin: "0 auto 20px"
};

const btnPrimario = {
  padding: "10px 22px",
  fontSize: "1rem"
};

const cardPrincipal = {
  background: "white",
  padding: "25px 40px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
  width: "100%",
  maxWidth: "100%",     
  margin: "0 auto",
};


const cabecalhoCard = {
  marginBottom: "30px",
  paddingBottom: "20px",
  borderBottom: "2px solid #e2e8f0"
};

const tituloSessao = {
  fontSize: "1.5rem",
  fontWeight: 700,
  marginBottom: "12px",
  color: "#0f172a"
};

const subTitulo = {
  fontSize: "1.15rem",
  fontWeight: 700,
  
  marginBottom: "6px"
};

const cardConteudo = {
  background: "#f8fafc",
  padding: "30px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0"
};

const caixaConteudo = {
  background: "white",
  padding: "18px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  whiteSpace: "pre-wrap",
  fontSize: "0.95rem"
};

const salvarDadosExtras = async () => {
  try {
    const payload = {
      telefone: formData.telefone,
      endereco: formData.endereco,
      dataNascimento: formData.dataNascimento
    };

    const res = await fetch(`${API_URL}/usuarios/${idPaciente}/dados-extras`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      alert("Erro ao adicionar dados extras");
      return;
    }

    const atualizado = await res.json();

    localStorage.setItem("userData", JSON.stringify(atualizado));
    setUserData(atualizado);

    alert("Dados extras salvos com sucesso!");

  } catch (err) {
    console.error(err);
    alert("Erro ao salvar dados extras");
  }
};


  useEffect(() => {
    carregarDadosUsuario();
  }, []);

const atualizarCampo = (campo, valor) => {
  setFormData(prev => ({ ...prev, [campo]: valor }));
};

const salvarPerfil = async () => {
  try {
    const payload = {
      idUsuario: idPaciente,
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      senha: userData.senha, 
      tipoUsuario: userData.tipoUsuario,

      // CAMPOS EXCLUSIVOS DO PACIENTE
      cpf: formData.cpf,
      dataNascimento: formData.dataNascimento,
      endereco: formData.endereco
    };

    const res = await fetch(`${API_URL}/usuarios/editar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      alert("Erro ao atualizar perfil");
      return;
    }

    const atualizado = await res.json();

    localStorage.setItem("userData", JSON.stringify(atualizado));
    setUserData(atualizado);

    alert("Dados atualizados com sucesso!");
    setEditMode(false);
  } catch (err) {
    console.error(err);
    alert("Erro ao salvar alterações");
  }
};


  // NOVA FUNÇÃO: Carrega os dados do usuário do localStorage
 const carregarDadosUsuario = () => {
  try {
    const userDataString = localStorage.getItem('userData');

    if (!userDataString) {
      console.error('Dados do usuário não encontrados no localStorage');
      return;
    }

    const user = JSON.parse(userDataString);
    setUserData(user);

    // Preenche o formulário com TODOS os dados do paciente
    setFormData({
      nome: user.nome || "",
      cpf: user.cpf || "",
      email: user.email || "",
      telefone: user.telefone || "",
      dataNascimento: user.dataNascimento 
        ? user.dataNascimento.substring(0, 10) 
        : "",
      endereco: user.endereco || ""
    });

    // Define o CPF do usuário logado
    if (user.cpf) {
      setCpfPaciente(user.cpf);
    }

    // Define o ID do usuário logado
    if (user.idUsuario) {
      setIdPaciente(user.idUsuario);
      console.log('ID do usuário logado:', user.idUsuario);
      setDadosCarregados(true);
    } else {
      console.error('ID não encontrado nos dados do usuário');
    }

  } catch (error) {
    console.error('Erro ao carregar dados do usuário:', error);
  }
};

  useEffect(() => {
    if (dadosCarregados && idPaciente) {
      console.log('Carregando dados do paciente com ID:', idPaciente);
      carregarConsultasDoPaciente();
      carregarSolicitacoesPendentes();
      carregarProntuario();
      carregarTodosServicos();
    }
  }, [dadosCarregados, idPaciente]);

  const carregarTodosServicos = async () => {
    try {
      setLoadingServicos(true);
      console.log('Carregando serviços...');
      const res = await fetch(`${API_URL}/servicos`);
      
      if (res.ok) {
        const data = await res.json();
        console.log('Serviços carregados:', data);
        setServicos(data);
        setServicosFiltrados(data); // Inicialmente mostra todos
      } else {
        console.error('Erro ao carregar serviços:', res.status);
      }
    } catch (err) {
      console.error('Erro de conexão ao carregar serviços:', err);
    } finally {
      setLoadingServicos(false);
    }
  };

  // NOVA FUNÇÃO: Pesquisar serviços por nome
  const pesquisarServicos = async () => {
    if (!termoPesquisa.trim()) {
      // Se pesquisa vazia, mostra todos os serviços
      setServicosFiltrados(servicos);
      return;
    }

    try {
      setLoadingServicos(true);
      console.log('Pesquisando serviços por:', termoPesquisa);
      const res = await fetch(`${API_URL}/servicos/buscar?nome=${encodeURIComponent(termoPesquisa)}`);
      
      if (res.ok) {
        const data = await res.json();
        console.log('Serviços encontrados:', data);
        setServicosFiltrados(data);
      } else {
        console.error('Erro ao pesquisar serviços:', res.status);
        // Fallback: filtra localmente
        const filtrados = servicos.filter(servico =>
          servico.nomeServico.toLowerCase().includes(termoPesquisa.toLowerCase())
        );
        setServicosFiltrados(filtrados);
      }
    } catch (err) {
      console.error('Erro de conexão ao pesquisar serviços:', err);
      // Fallback: filtra localmente em caso de erro
      const filtrados = servicos.filter(servico =>
        servico.nomeServico.toLowerCase().includes(termoPesquisa.toLowerCase())
      );
      setServicosFiltrados(filtrados);
    } finally {
      setLoadingServicos(false);
    }
  };

  // Função para limpar pesquisa
  const limparPesquisa = () => {
    setTermoPesquisa('');
    setServicosFiltrados(servicos);
  };

  // Função para buscar consultas por ID do paciente
  const carregarConsultasDoPaciente = async () => {
    if (!idPaciente) {
      console.log('ID do paciente não disponível para carregar consultas');
      return;
    }

    try {
      console.log('Carregando consultas para ID:', idPaciente);
      setLoading(true);
      // CORREÇÃO: Busca por ID em vez de CPF
      const res = await fetch(`${API_URL}/consultas/paciente/${idPaciente}`);

      if (res.ok) {
        const data = await res.json();
        console.log('Consultas carregadas:', data);
        setConsultas(data);
      } else if (res.status === 404) {
        // Se o endpoint não existir, tenta buscar por CPF como fallback
        console.log('Endpoint por ID não encontrado, tentando por CPF...');
        await carregarConsultasPorCpf();
      } else {
        const errorText = await res.text();
        console.error('Erro ao carregar consultas:', errorText);
        setError('Erro ao carregar consultas: ' + errorText);
      }
    } catch (err) {
      console.error('Erro de conexão:', err);
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  // Fallback: carrega consultas por CPF
  const carregarConsultasPorCpf = async () => {
    if (!cpfPaciente) {
      console.log('CPF não disponível para fallback');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/consultas/buscar-por-cpf?cpf=${cpfPaciente}`);
      if (res.ok) {
        const data = await res.json();
        console.log('Consultas carregadas por CPF:', data);
        setConsultas(data);
      } else {
        console.log('Nenhuma consulta encontrada para este paciente');
        setConsultas([]);
      }
    } catch (err) {
      console.error('Erro ao carregar consultas por CPF:', err);
    }
  };

  const carregarSolicitacoesPendentes = async () => {
    if (!idPaciente && !cpfPaciente) {
      console.log('Dados do paciente não disponíveis para carregar solicitações pendentes');
      return;
    }

    try {
      console.log('Carregando todas as solicitações pendentes');
      const res = await fetch(`${API_URL}/consultas/pendentes`);
      if (res.ok) {
        const data = await res.json();
        console.log('Todas as solicitações pendentes:', data);
        
        // Filtra pelo ID do paciente (preferencialmente) ou pelo CPF
        const solicitacoesDoPaciente = data.filter(solicitacao => {
          // Tenta filtrar por ID primeiro
          if (solicitacao.paciente?.idUsuario && idPaciente) {
            return solicitacao.paciente.idUsuario === idPaciente;
          }
          // Fallback: filtra por CPF
          if (solicitacao.paciente?.cpf && cpfPaciente) {
            return solicitacao.paciente.cpf === cpfPaciente;
          }
          return false;
        });
        
        console.log('Solicitações do paciente:', solicitacoesDoPaciente);
        setSolicitacoesPendentes(solicitacoesDoPaciente);
      } else {
        const errorText = await res.text();
        console.error('Erro ao carregar solicitações pendentes:', errorText);
      }
    } catch (err) {
      console.error('Erro de conexão:', err);
    }
  };

  const solicitarConsulta = async () => {
    setError(null);

    // Usa o CPF do usuário logado como padrão
    const cpfInput = document.getElementById('solCpf').value || cpfPaciente;
    const payload = {
      cpfPacienteInput: cpfInput,
      especialidadeInput: document.getElementById('solEsp').value,
      nomeServicoInput: document.getElementById('solServ').value,
      dataHora: document.getElementById('solData').value
    };

    if (!payload.cpfPacienteInput || !payload.especialidadeInput || !payload.nomeServicoInput || !payload.dataHora) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/consultas/solicitar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        alert('Consulta solicitada com sucesso!');
        // Não limpa o CPF, só os outros campos
        document.getElementById('solEsp').value = '';
        document.getElementById('solServ').value = '';
        document.getElementById('solData').value = '';
        // Recarrega os dados
        setTimeout(() => {
          carregarSolicitacoesPendentes();
          carregarConsultasDoPaciente();
        }, 500); // Pequeno delay para o servidor processar
      } else {
        const errorText = await res.text();
        setError(errorText || 'Erro ao solicitar consulta');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
      console.error('Erro:', err);
    }
  };

  const cancelarSolicitacao = async (idConsulta) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta solicitação?')) {
      return;
    }

    const id = parseInt(idConsulta);
    
    if (isNaN(id) || !id) {
      alert('Erro: ID de solicitação inválido');
      return;
    }

    try {
      const payload = { idConsulta: id };

      const res = await fetch(`${API_URL}/consultas/cancelar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Solicitação cancelada com sucesso!');
        // Recarrega os dados
        carregarSolicitacoesPendentes();
        carregarConsultasDoPaciente();
      } else {
        const errorText = await res.text();
        alert(errorText || 'Erro ao cancelar solicitação');
      }
    } catch (err) {
      alert('Erro de conexão. Tente novamente.');
      console.error('Erro:', err);
    }
  };

  const cancelarConsulta = async (idConsulta) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta consulta?')) {
      return;
    }

    const id = parseInt(idConsulta);

    try {
      const res = await fetch(`${API_URL}/consultas/cancelar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idConsulta: id })
      });

      if (res.ok) {
        alert('Consulta cancelada com sucesso!');
        carregarConsultasDoPaciente();
      } else {
        const errorText = await res.text();
        alert(errorText || 'Erro ao cancelar consulta');
      }
    } catch (err) {
      alert('Erro de conexão. Tente novamente.');
      console.error('Erro:', err);
    }
  };

 const carregarProntuario = async () => {
  if (!idPaciente) return;

  try {
    setError(null);

    const res = await fetch(`${API_URL}/prontuarios/paciente/${idPaciente}`);

    if (!res.ok) {
      // Prontuário não existe ainda
      setProntuario(null);
      setAnamnese(null);
      return;
    }

    const data = await res.json();

    setProntuario(data);                 // pronto
    setAnamnese(data.anamnese || null); // pega a anamnese do prontuário

  } catch (err) {
    console.error("Erro ao carregar prontuário:", err);
    setProntuario(null);
    setAnamnese(null);
  }
};
const criarProntuario = async () => {
  if (!idPaciente) {
    setError("Não foi possível encontrar o ID do paciente");
    return;
  }

  try {
    setError(null);

    const res = await fetch(`${API_URL}/prontuarios/criar/${idPaciente}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) {
      const errorText = await res.text();

      // Se já existe, apenas carrega
      if (errorText.includes("já possui")) {
        await carregarProntuario();
        return;
      }

      setError("Erro ao criar prontuário: " + errorText);
      return;
    }

    const prontuario = await res.json();

    setProntuario(prontuario);
    setAnamnese(prontuario.anamnese || null);

    alert("Prontuário criado com sucesso!");

  } catch (err) {
    setError("Erro: " + err.message);
  }
};

  

  const preencherAnamnese = async (respostas) => {
  try {
    setError(null);

    // 1️⃣ CRIA A ANAMNESE
    const res = await fetch(`${API_URL}/anamneses/preencher`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cpf: cpfPaciente,
        respostas: JSON.stringify(respostas)
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      setError("Erro ao preencher anamnese: " + errorText);
      return null;
    }

    const novaAnamnese = await res.json();

    // 2️⃣ VINCULA AO PRONTUÁRIO
    await fetch(`${API_URL}/prontuarios/${idPaciente}/anamnese`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idAnamnese: novaAnamnese.idAnamnese })
    });

    // 3️⃣ CARREGA TUDO NOVAMENTE
    await carregarProntuario();

    alert("Anamnese preenchida e vinculada ao prontuário!");

    return novaAnamnese;

  } catch (err) {
    setError("Erro de conexão com o servidor");
    return null;
  }
};


  const toggleSubmenu = (menuName) => {
    setActiveSubmenu(activeSubmenu === menuName ? null : menuName);
  }

  const renderConsultaContent = (label) => {
    switch (label) {
      case 'Solicitar Consulta':
        return (
          <div className="content-section">
            <div className="card-solicitar-container">
              <div className="card-solicitar">
                <h2>1. Solicitar Consulta</h2>
                <small>Tenta criar consulta (Valida disponibilidade imediata)</small>

                {error && (
                  <div className="error-message">
                    <i className="ai-warning"></i>
                    {error}
                  </div>
                )}

                <div className="form-field-solicitar">
                  <label htmlFor="solCpf">CPF do Paciente:</label>
                  <input
                    type="text"
                    id="solCpf"
                    placeholder="Seu CPF será preenchido automaticamente"
                    value={cpfPaciente}
                    readOnly
                    style={{backgroundColor: '#f5f5f5', color: '#666'}}
                  />
                  <small style={{color: '#666', fontSize: '12px'}}>
                    CPF do usuário logado (preenchido automaticamente)
                  </small>
                </div>

                <div className="form-field-solicitar">
                  <label htmlFor="solEsp">Especialidade Médica:</label>
                  <input type="text" id="solEsp" placeholder="Ex: Ortodontia" />
                </div>

                <div className="form-field-solicitar">
                  <label htmlFor="solServ">Nome do Serviço:</label>
                  <input type="text" id="solServ" placeholder="Ex: Limpeza" />
                </div>

                <div className="form-field-solicitar">
                  <label htmlFor="solData">Data e Hora:</label>
                  <input type="datetime-local" id="solData" />
                </div>

                <button className="btn-solicitar" onClick={solicitarConsulta}>
                  Solicitar Consulta
                </button>
              </div>
            </div>
          </div>
        );

      case 'Visualizar Consultas':
        return (
          <div className="content-section">
            <h2>Minhas Consultas Agendadas</h2>

            {error && (
              <div className="error-message">
                <i className="ai-warning"></i>
                {error}
              </div>
            )}

            {loading ? (
              <div className="loading-state">Carregando consultas...</div>
            ) : consultas.length === 0 ? (
              <div className="empty-state">
                {idPaciente ? 'Nenhuma consulta agendada' : 'Carregando dados do paciente...'}
              </div>
            ) : (
              <div className="consultas-list">
                {consultas.map((consulta) => (
                  <div key={consulta.idConsulta} className="consulta-card">
                    <div className="consulta-info">
                      <h3>Consulta {consulta.especialidade ? `com ${consulta.especialidade}` : 'médica'}</h3>
                      <p><i className="ai-calendar"></i> {new Date(consulta.dataHora).toLocaleString('pt-BR')}</p>
                      {consulta.medico && (
                        <p><i className="ai-person"></i> {consulta.medico.nome}</p>
                      )}
                      {consulta.servico && (
                        <p><i className="ai-shipping-box-v1"></i> {consulta.servico.nomeServico}</p>
                      )}
                      <span className={`status ${consulta.status?.toLowerCase() || 'pending'}`}>
                        {consulta.status || 'PENDENTE'}
                      </span>
                      {(consulta.status === 'CONFIRMADA' || consulta.status === 'SOLICITADA') && (
                        <button
                          className="btn-danger btn-sm"
                          onClick={() => cancelarConsulta(consulta.idConsulta)}
                          style={{ marginTop: '10px' }}
                        >
                          Cancelar Consulta
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'Status das solicitações':
        return (
          <div className="content-section">
            <h2>Status das Solicitações</h2>

            {solicitacoesPendentes.length === 0 ? (
              <div className="empty-state">
                {idPaciente ? 'Nenhuma solicitação pendente' : 'Carregando dados do paciente...'}
              </div>
            ) : (
              <div className="status-list">
                {solicitacoesPendentes.map((solicitacao) => (
                  <div key={solicitacao.idConsulta} className="status-item">
                    <h3>Solicitação #{solicitacao.idConsulta}</h3>
                    <p><strong>ID:</strong> {solicitacao.idConsulta}</p>
                    <p><strong>Especialidade:</strong> {solicitacao.especialidade || 'Não definida'}</p>
                    {solicitacao.servico && (
                      <p><strong>Serviço:</strong> {solicitacao.servico.nomeServico}</p>
                    )}
                    <p><strong>Data Prevista:</strong> {new Date(solicitacao.dataHora).toLocaleString('pt-BR')}</p>
                    <span className={`status ${solicitacao.status?.toLowerCase() || 'pending'}`}>
                      {solicitacao.status || 'PENDENTE'}
                    </span>
                    {solicitacao.status === 'SOLICITADA' && (
                      <button
                        className="btn-danger btn-sm"
                        onClick={() => cancelarSolicitacao(solicitacao.idConsulta)}
                        style={{ marginTop: '10px' }}
                      >
                        Cancelar Solicitação
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'Cancelar solicitação':
        return (
          <div className="content-section">
            <h2>Cancelar Solicitação</h2>
            <div className="cancel-section">
              <p>Selecione a solicitação pendente que deseja cancelar:</p>

              {solicitacoesPendentes.length === 0 ? (
                <div className="empty-state">
                  {idPaciente ? 'Nenhuma solicitação pendente para cancelar' : 'Carregando dados do paciente...'}
                </div>
              ) : (
                <div className="solicitacoes-list">
                  {solicitacoesPendentes.map((solicitacao) => (
                    <div key={solicitacao.idConsulta} className="solicitacao-item">
                      <input
                        type="checkbox"
                        id={`solicitacao-${solicitacao.idConsulta}`}
                        value={solicitacao.idConsulta}
                      />
                      <label htmlFor={`solicitacao-${solicitacao.idConsulta}`}>
                        <strong>
                          {solicitacao.especialidade ? `Consulta de ${solicitacao.especialidade}` : 'Consulta médica'}
                        </strong>
                        <span>{new Date(solicitacao.dataHora).toLocaleString('pt-BR')}</span>
                        {solicitacao.servico && (
                          <span>Serviço: {solicitacao.servico.nomeServico}</span>
                        )}
                        <small>ID: {solicitacao.idConsulta}</small>
                      </label>
                    </div>
                  ))}
                  <button
                    className="btn-danger"
                    onClick={() => {
                      const checkboxes = document.querySelectorAll('.solicitacoes-list input[type="checkbox"]:checked');
                      if (checkboxes.length === 0) {
                        alert('Selecione pelo menos uma solicitação para cancelar');
                        return;
                      }

                      const ids = Array.from(checkboxes).map(cb => parseInt(cb.value));

                      if (window.confirm(`Cancelar ${ids.length} solicitação(ões)?`)) {
                        ids.forEach(id => cancelarSolicitacao(id));
                      }
                    }}
                  >
                    Cancelar Selecionadas ({solicitacoesPendentes.length} pendentes)
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return <div><h2>{label}</h2><p>Conteúdo em desenvolvimento.</p></div>;
    }
  };

  const renderServicosContent = (label) => {
    switch (label) {
      case 'Pesquisar serviços':
        return (
          <div className="content-section">
            <h2>Pesquisar Serviços</h2>
            <div className="search-section">
              <div className="search-bar">
                <input 
                  type="text" 
                  placeholder="Digite o nome do serviço..." 
                  className="search-input"
                  value={termoPesquisa}
                  onChange={(e) => setTermoPesquisa(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      pesquisarServicos();
                    }
                  }}
                />
                <button className="btn-primary" onClick={pesquisarServicos}>
                  <i className="ai-search"></i> Pesquisar
                </button>
                {termoPesquisa && (
                  <button className="btn-secondary" onClick={limparPesquisa} style={{marginLeft: '10px'}}>
                    <i className="ai-close"></i> Limpar
                  </button>
                )}
              </div>
              
              {loadingServicos ? (
                <div className="loading-state">Carregando serviços...</div>
              ) : (
                <div className="servicos-resultados">
                  <h3>Resultados da Pesquisa {termoPesquisa && `para "${termoPesquisa}"`}</h3>
                  
                  {servicosFiltrados.length === 0 ? (
                    <div className="empty-state">
                      {termoPesquisa 
                        ? `Nenhum serviço encontrado para "${termoPesquisa}"`
                        : 'Nenhum serviço disponível'}
                    </div>
                  ) : (
                    <div className="servicos-lista">
                      {servicosFiltrados.map((servico) => (
                        <div key={servico.idServico} className="servico-card">
                          <div className="servico-header">
                            <h3>{servico.nomeServico}</h3>
                            <span className="servico-id">ID: {servico.idServico}</span>
                          </div>
                          <div className="servico-body">
                            <p className="servico-descricao">
                              {servico.descricao || 'Sem descrição disponível'}
                            </p>
                            <div className="servico-actions">
                              <button 
                                className="btn-info btn-sm"
                                onClick={() => {
                                  alert(`Detalhes do Serviço:\n\nNome: ${servico.nomeServico}\nID: ${servico.idServico}\nDescrição: ${servico.descricao || 'Não disponível'}`);
                                }}
                              >
                                <i className="ai-info"></i> Detalhes
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'Todos os serviços':
        return (
          <div className="content-section">
            <h2>Todos os Serviços Disponíveis</h2>
            
            {loadingServicos ? (
              <div className="loading-state">Carregando serviços...</div>
            ) : servicos.length === 0 ? (
              <div className="empty-state">Nenhum serviço disponível no momento</div>
            ) : (
              <div className="servicos-grid">
                {servicos.map((servico) => (
                  <div key={servico.idServico} className="servico-card">
                    <div className="servico-header">
                      <h3>{servico.nomeServico}</h3>
                      <span className="servico-id">ID: {servico.idServico}</span>
                    </div>
                    <div className="servico-body">
                      <p className="servico-descricao">
                        {servico.descricao || 'Sem descrição disponível'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return <div><h2>{label}</h2><p>Conteúdo em desenvolvimento.</p></div>;
    }
  };

  const renderAnamneseContent = (label) => {
    switch (label) {
      case 'Preencher Anamnese':
        return (
          <div className="content-section">
            <h2>Preencher Questionário de Anamnese</h2>
            <div className="anamnese-form">
              <div className="form-section">
                <h3>Dados Pessoais de Saúde</h3>
                
                <div className="form-group">
                  <label>Possui alguma doença crônica? (Diabetes, Hipertensão, etc.)</label>
                  <div className="radio-group">
                    <input type="radio" id="doenca_sim" name="doenca_cronica" value="sim" />
                    <label htmlFor="doenca_sim">Sim</label>
                    <input type="radio" id="doenca_nao" name="doenca_cronica" value="nao" defaultChecked />
                    <label htmlFor="doenca_nao">Não</label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Faz uso de medicamentos contínuos?</label>
                  <div className="radio-group">
                    <input type="radio" id="medicamento_sim" name="uso_medicamento" value="sim" />
                    <label htmlFor="medicamento_sim">Sim</label>
                    <input type="radio" id="medicamento_nao" name="uso_medicamento" value="nao" defaultChecked />
                    <label htmlFor="medicamento_nao">Não</label>
                  </div>
                  <textarea 
                    id="medicamentos_lista" 
                    placeholder="Se sim, liste os medicamentos em uso..." 
                    className="form-textarea" 
                    style={{display: 'none'}}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Possui alergias?</label>
                  <div className="radio-group">
                    <input type="radio" id="alergia_sim" name="alergias" value="sim" />
                    <label htmlFor="alergia_sim">Sim</label>
                    <input type="radio" id="alergia_nao" name="alergias" value="nao" defaultChecked />
                    <label htmlFor="alergia_nao">Não</label>
                  </div>
                  <textarea 
                    id="alergias_lista" 
                    placeholder="Se sim, liste as alergias..." 
                    className="form-textarea" 
                    style={{display: 'none'}}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Já fez cirurgia anterior?</label>
                  <div className="radio-group">
                    <input type="radio" id="cirurgia_sim" name="cirurgia" value="sim" />
                    <label htmlFor="cirurgia_sim">Sim</label>
                    <input type="radio" id="cirurgia_nao" name="cirurgia" value="nao" defaultChecked />
                    <label htmlFor="cirurgia_nao">Não</label>
                  </div>
                  <textarea 
                    id="cirurgias_lista" 
                    placeholder="Se sim, descreva as cirurgias..." 
                    className="form-textarea" 
                    style={{display: 'none'}}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Fuma?</label>
                  <div className="radio-group">
                    <input type="radio" id="fuma_sim" name="fuma" value="sim" />
                    <label htmlFor="fuma_sim">Sim</label>
                    <input type="radio" id="fuma_nao" name="fuma" value="nao" defaultChecked />
                    <label htmlFor="fuma_nao">Não</label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Consome bebidas alcoólicas?</label>
                  <div className="radio-group">
                    <input type="radio" id="alcool_sim" name="alcool" value="sim" />
                    <label htmlFor="alcool_sim">Sim</label>
                    <input type="radio" id="alcool_nao" name="alcool" value="nao" defaultChecked />
                    <label htmlFor="alcool_nao">Não</label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Observações adicionais</label>
                  <textarea 
                    id="observacoes" 
                    placeholder="Alguma informação adicional que considere importante..." 
                    className="form-textarea"
                  ></textarea>
                </div>

                <button className="btn-primary" onClick={async () => {
                  const respostas = {
                    doenca_cronica: document.querySelector('input[name="doenca_cronica"]:checked')?.value,
                    uso_medicamento: document.querySelector('input[name="uso_medicamento"]:checked')?.value,
                    medicamentos: document.getElementById('medicamentos_lista').value,
                    alergias: document.querySelector('input[name="alergias"]:checked')?.value,
                    alergias_lista: document.getElementById('alergias_lista').value,
                    cirurgia: document.querySelector('input[name="cirurgia"]:checked')?.value,
                    cirurgias_lista: document.getElementById('cirurgias_lista').value,
                    fuma: document.querySelector('input[name="fuma"]:checked')?.value,
                    alcool: document.querySelector('input[name="alcool"]:checked')?.value,
                    observacoes: document.getElementById('observacoes').value
                  };
                  
                  await preencherAnamnese(respostas);
                }}>
                  Salvar Anamnese
                </button>
              </div>
            </div>
          </div>
        );
case "Consultar Anamnese":
  return (
    <div className="content-section" style={{ maxWidth: "1100px", margin: "0 auto", padding: "30px" }}>

      <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "25px", color: "#1e293b", textAlign: "center" }}>
        Consultar Anamnese
      </h2>

      {/* SE NÃO HÁ PRONTUÁRIO */}
      {!prontuario ? (
        <div className="warning-card" style={cardAviso}>
          <h3 style={tituloAviso}>Prontuário Não Encontrado</h3>
          <p style={textoAviso}>
            Você precisa ter um prontuário ativo para visualizar a anamnese.
          </p>
          <button className="btn-primary" style={btnPrimario} onClick={criarProntuario}>
            Criar Prontuário
          </button>
        </div>

      ) : !prontuario.anamnese ? (
        /* SE NÃO HÁ ANAMNESE */
        <div className="warning-card" style={cardAviso}>
          <h3 style={tituloAviso}>Nenhuma Anamnese Encontrada</h3>
          <p style={textoAviso}>Preencha a anamnese antes de consultar.</p>

          <button
            className="btn-primary"
            style={btnPrimario}
            onClick={() => handleSubmenuClick("Preencher Anamnese", "anamnese")}
          >
            Preencher Anamnese
          </button>
        </div>

      ) : (
        /* EXIBIÇÃO DA ANAMNESE */
        <div
          style={{
            background: "white",
            padding: "35px",
            borderRadius: "18px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
          }}
        >
          <table className="data-table" style={{ width: "100%", textAlign: "center" }}>
            <thead>
              <tr>
                <th>Data de Preenchimento</th>
                <th>Respostas</th>
                <th>Informações Médicas</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>
                  {new Date(prontuario.anamnese.dataPreenchimento).toLocaleDateString("pt-BR")}
                </td>

                <td>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      try {
                        const r = JSON.parse(prontuario.anamnese.respostas);
                        alert(
                          "Respostas da Anamnese:\n\n" +
                            `Doenças crônicas: ${r.doenca_cronica}\n` +
                            `Uso de medicamentos: ${r.uso_medicamento}\n` +
                            `Alergias: ${r.alergias}\n` +
                            `Cirurgias anteriores: ${r.cirurgia}\n` +
                            `Fuma: ${r.fuma}\n` +
                            `Álcool: ${r.alcool}`
                        );
                      } catch {
                        alert("Respostas: " + prontuario.anamnese.respostas);
                      }
                    }}
                  >
                    Visualizar Respostas
                  </button>
                </td>

                <td>
                  {prontuario.anamnese.informacoes ? (
                    <button
                      className="btn-secondary"
                      onClick={() => {
                        alert(
                          "Informações Médicas:\n\n" +
                            prontuario.anamnese.informacoes
                        );
                      }}
                    >
                      Visualizar Informações
                    </button>
                  ) : (
                    <span className="status pending">Sem informações</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );


      default:
        return <div><h2>{label}</h2><p>Conteúdo em desenvolvimento.</p></div>;
    }
  };

  const renderProntuarioContent = (label) => {
    switch (label) {
case "Visualizar prontuário":
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1600px",
        margin: "0 auto",
        padding: "10px 20px",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <h2
        style={{
          fontSize: "2rem",
          fontWeight: 800,
          marginBottom: "10px",
          color: "#1e293b",
          textAlign: "center",
        }}
      >
        Meu Prontuário Médico
      </h2>

      {/* BLOCO SUPERIOR – INFORMACOES DO PRONTUARIO */}
      <div
        style={{
          width: "100%",
          background: "white",
          padding: "20px 30px",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
          marginBottom: "20px", // pouca distância para o bloco de baixo
        }}
      >
        <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1e293b" }}>
          Informações do Prontuário
        </h3>

        <p><strong>Data de Criação:</strong> {new Date(prontuario.dataCriacao).toLocaleDateString("pt-BR")}</p>
        <p><strong>Paciente:</strong> {prontuario.paciente?.nome}</p>
        <p><strong>CPF:</strong> {prontuario.paciente?.cpf}</p>
      </div>

      {/* BLOCO INFERIOR – ANAMNESE (LARGO NA HORIZONTAL) */}
   <div
  style={{
    width: "100%",
    maxWidth: "1000px",   // aumenta MUITO a largura
    margin: "0 auto",
    background: "white",
    padding: "30px 40px", // mais horizontal, menos vertical
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
  }}
>

        {!prontuario.anamnese ? (
          <div style={{ textAlign: "center" }}>
            <h4 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#c2410c" }}>
              Nenhuma Anamnese Encontrada
            </h4>

            <p style={{ maxWidth: "600px", margin: "10px auto" }}>
              Preencha a anamnese para visualizar.
            </p>

            <button
              className="btn-primary"
              style={{ padding: "10px 20px" }}
              onClick={() => handleSubmenuClick("Preencher Anamnese", "anamnese")}
            >
              Preencher Anamnese
            </button>
          </div>
        ) : (
          <>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "10px" }}>
              Anamnese Vinculada
            </h3>

            <p><strong>ID:</strong> {prontuario.anamnese.idAnamnese}</p>
            <p><strong>Data:</strong> {new Date(prontuario.anamnese.dataPreenchimento).toLocaleDateString("pt-BR")}</p>

            {/* CAIXA DE RESPOSTAS – LARGA HORIZONTAL */}
            <h4 style={{ marginTop: "15px", fontWeight: 700 }}>Respostas do Questionário:</h4>
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "12px",
                padding: "18px",
                border: "1px solid #e2e8f0",
                whiteSpace: "pre-line",
                width: "100%",        // ocupa toda horizontal
                fontSize: "1rem",
              }}
            >
              {formatarRespostas(prontuario.anamnese.respostas)}
            </div>

            <h4 style={{ marginTop: "20px", fontWeight: 700 }}>Informações Médicas:</h4>
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "12px",
                padding: "18px",
                border: "1px solid #e2e8f0",
                whiteSpace: "pre-line",
                width: "100%",
                fontSize: "1rem",
              }}
            >
              {prontuario.anamnese.informacoes || "Nenhuma informação registrada"}
            </div>
          </>
        )}
      </div>
    </div>
  );




      default:
        return <div><h2>{label}</h2><p>Conteúdo em desenvolvimento.</p></div>;
    }
  };
const formatarRespostas = (respostasJSON) => {
  try {
    const r = JSON.parse(respostasJSON);

    return (
      "Doenças crônicas: " + r.doenca_cronica + "\n" +
      "Uso de medicamentos: " + r.uso_medicamento + "\n" +
      "Medicamentos: " + (r.medicamentos || "Nenhum") + "\n" +
      "Alergias: " + r.alergias + "\n" +
      "Lista de alergias: " + (r.alergias_lista || "Nenhuma") + "\n" +
      "Cirurgias anteriores: " + r.cirurgia + "\n" +
      "Cirurgias: " + (r.cirurgias_lista || "Nenhuma") + "\n" +
      "Fuma: " + r.fuma + "\n" +
      "Álcool: " + r.alcool
    );
  } catch {
    return respostasJSON;
  }
};

  const renderPerfilContent = (label) => {
    switch (label) {
  case 'Meus dados pessoais':
  return (
    <div className="content-section profile-wrapper">

      <div className="profile-card">

        {/* Cabeçalho */}
        <div className="profile-header">
          <div className="avatar">
            <i className="ai-person"></i>
          </div>

          <div className="profile-title">
            <h2>Meu Perfil</h2>
            <p>Gerencie suas informações pessoais</p>
          </div>
        </div>

        {/* FORM */}
        <div className="profile-form-grid">

          {/* Nome */}
          <div className="form-group full">
            <label>Nome Completo</label>
            <input
              type="text"
              className="form-input"
              value={formData.nome}
              disabled={!editMode}
              onChange={(e) => atualizarCampo("nome", e.target.value)}
            />
          </div>

          {/* CPF - sempre bloqueado */}
          <div className="form-group">
            <label>CPF</label>
            <input
              type="text"
              className="form-input"
              value={formData.cpf}
              disabled={true}
              style={{ background: "#ececec", cursor: "not-allowed" }}
            />
          </div>

          {/* Email - sempre bloqueado */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              disabled={true}
              style={{ background: "#ececec", cursor: "not-allowed" }}
            />
          </div>

          {/* Telefone - editável */}
          <div className="form-group">
            <label>Telefone</label>
            <input
              type="tel"
              className="form-input"
              value={formData.telefone}
              disabled={!editMode}
              onChange={(e) => atualizarCampo("telefone", e.target.value)}
            />
          </div>

          {/* Data de nascimento - sempre bloqueada */}
          <div className="form-group">
            <label>Data de Nascimento</label>
            <input
              type="date"
              className="form-input"
              value={formData.dataNascimento}
              disabled={true}
              style={{ background: "#ececec", cursor: "not-allowed" }}
            />
          </div>

          {/* Endereço - editável */}
          <div className="form-group full">
            <label>Endereço</label>
            <input
              type="text"
              className="form-input"
              value={formData.endereco}
              disabled={!editMode}
              onChange={(e) => atualizarCampo("endereco", e.target.value)}
            />
          </div>

        </div>

        {/* Botões */}
        <div className="profile-actions">
          {!editMode ? (
            <button className="btn-primary edit-btn" onClick={() => setEditMode(true)}>
              <i className="ai-edit"></i> Editar Dados
            </button>
          ) : (
            <button className="btn-primary save-btn" onClick={salvarPerfil}>
              <i className="ai-check"></i> Salvar Alterações
            </button>
          )}
        </div>

      </div>

    </div>
  );
case 'Adicionar dados extras':
  return (
    <div className="content-section profile-wrapper">
      <div className="profile-card">

        <div className="profile-header">
          <div className="avatar">
           <i className="ai-person"></i>
          </div>

          <div className="profile-title">
            <h2>Adicionar Dados Extras</h2>
            <p>Complete suas informações de perfil</p>
          </div>
        </div>

        <div className="profile-form-grid">

          <div className="form-group">
            <label>Telefone</label>
            <input
              type="tel"
              className="form-input"
              value={formData.telefone}
              onChange={(e) => atualizarCampo("telefone", e.target.value)}
              placeholder="Digite seu telefone"
            />
          </div>

          <div className="form-group">
            <label>Data de Nascimento</label>
            <input
              type="date"
              className="form-input"
              value={formData.dataNascimento}
              onChange={(e) => atualizarCampo("dataNascimento", e.target.value)}
            />
          </div>

          <div className="form-group full">
            <label>Endereço</label>
            <input
              type="text"
              className="form-input"
              value={formData.endereco}
              onChange={(e) => atualizarCampo("endereco", e.target.value)}
              placeholder="Digite seu endereço"
            />
          </div>

        </div>

        <div className="profile-actions">
          <button className="btn-primary save-btn" onClick={salvarDadosExtras}>
            <i className="ai-check"></i> Salvar Dados
          </button>
        </div>

      </div>
    </div>
  );


      case 'Encerrar conta':
        return (
          <div className="content-section">
            <h2>Encerrar Conta</h2>
            <div className="warning-section">
              <div className="alert alert-warning">
                <i className="ai-warning"></i>
                <h3>
                  <strong>Atenção! </strong>
                  Esta ação é irreversível. Todos os seus dados serão excluídos permanentemente.
                </h3>
              </div>
              <div className="closure-form">
                <div className="form-group">
                  <label>Motivo do encerramento:</label>
                  <select className="form-select">
                    <option value="">Selecione um motivo</option>
                    <option value="mudanca">Mudança de cidade</option>
                    <option value="outro_clinica">Mudança para outra clínica</option>
                    <option value="outro">Outro motivo</option>
                  </select>
                </div>
                <button className="btn-danger">Confirmar Encerramento</button>
              </div>
            </div>
          </div>
        );

      default:
        return <div><h2>{label}</h2><p>Conteúdo em desenvolvimento.</p></div>;
    }
  };

  const renderInfoContent = (label) => {
    switch (label) {
      case 'Localização e contatos':
        return (
          <div className="content-section">
            <h2>Informações da Clínica</h2>
            <div className="clinic-info">
              <div className="info-card">
                <h3><i className="ai-location"></i> Localização</h3>
                <p>Rua Exemplo, 123 - Centro</p>
                <p>São Paulo - SP, 01234-567</p>
              </div>
              <div className="info-card">
                <h3><i className="ai-phone"></i> Contatos</h3>
                <p>Telefone: (11) 3456-7890</p>
                <p>WhatsApp: (11) 98765-4321</p>
                <p>Email: contato@clinica.com</p>
              </div>
              <div className="info-card">
                <h3><i className="ai-clock"></i> Horário de Funcionamento</h3>
                <p>Segunda a Sexta: 7h às 19h</p>
                <p>Sábado: 8h às 12h</p>
                <p>Domingo: Fechado</p>
              </div>
            </div>
          </div>
        );

      default:
        return <div><h2>{label}</h2><p>Conteúdo em desenvolvimento.</p></div>;
    }
  };

  const handleSubmenuClick = (label, menuName) => {
    let component;

    switch (menuName) {
      case 'consultas':
        component = renderConsultaContent(label);
        break;
      case 'servicos':
        component = renderServicosContent(label);
        break;
      case 'anamnese':
        component = renderAnamneseContent(label);
        break;
      case 'prontuario':
        component = renderProntuarioContent(label);
        break;
      case 'perfil':
        component = renderPerfilContent(label);
        break;
      case 'info':
        component = renderInfoContent(label);
        break;
      default:
        component = <div><h2>{label}</h2><p>Conteúdo em desenvolvimento.</p></div>;
    }

   setActiveContent({ menuName, label });

    setError(null);
  }

  const menuItems = [
    {
      name: 'consultas',
      icon: 'ai-calendar',
      label: 'Minhas Consultas',
      submenu: [
        { label: 'Solicitar Consulta' },
        { label: 'Visualizar Consultas' },
        { label: 'Status das solicitações' },
        { label: 'Cancelar solicitação' }
      ]
    },
    {
      name: 'servicos',
      icon: 'ai-shipping-box-v1',
      label: 'Serviços',
      submenu: [
        { label: 'Todos os serviços' }
      ]
    },
    {
      name: 'anamnese',
      icon: 'ai-folder-add',
      label: 'Minha Anamnese',
      submenu: [
        { label: 'Preencher Anamnese' },
        { label: 'Consultar Anamnese' }
      ]
    },
    {
      name: 'prontuario',
      icon: 'ai-file',
      label: 'Meu Prontuário',
      submenu: [
        { label: 'Visualizar prontuário' }
      ]
    },
    {
      name: 'perfil',
      icon: 'ai-person',
      label: 'Meu Perfil',
      submenu: [
        { label: 'Meus dados pessoais' },
        { label: 'Adicionar dados extras' }, 
        { label: 'Encerrar conta' }
      ]
    },
    {
      name: 'info',
      icon: 'ai-info',
      label: 'Informações da Clínica',
      submenu: [
        { label: 'Localização e contatos' }
      ]
    }
  ];

  return (
    <div className="layout">
      <div className="menu-paciente-container">
        <aside className="sidebar">
          <header>
            <button type="button" className="sidebar-burger">
              <i className="ai-three-line-horizontal"></i>
            </button>
            <img src="logo.svg" alt="Logo" />
          </header>

          <div className="sidebar-content">
            <ul>
              {menuItems.map((item) => (
                <li key={item.name}>
                  <button
                    type="button"
                    className={activeSubmenu === item.name ? 'active' : ''}
                    onClick={() => toggleSubmenu(item.name)}
                  >
                    <i className={item.icon}></i>
                    <p>{item.label}</p>
                    {item.submenu && <i className="ai-chevron-down-small"></i>}
                  </button>

                  {item.submenu && (
                    <div className={`sub-menu ${activeSubmenu === item.name ? "open" : ""}`}>
                      <ul>
                        {item.submenu.map((subItem, index) => (
                          <li key={index}>
                            <button
                              type="button"
                              className="sub-menu-item"
                              onClick={() => handleSubmenuClick(subItem.label, item.name)}
                            >
                              {subItem.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <div className="main-content">
        {error && (
          <div className="error-message">
            <i className="ai-warning"></i>
            {error}
          </div>
        )}

        {activeContent ? (
  renderContent(activeContent.menuName, activeContent.label)
) : (

          <div className="welcome-section">
            <h1>Bem-vindo ao Portal do Paciente</h1>
            <p>Selecione uma opção no menu lateral para começar.</p>
            <div className="quick-stats">
              <div className="stat-card">
                <i className="ai-calendar"></i>
                <h3>Minhas Consultas</h3>
                <p>Agende e acompanhe suas consultas</p>
              </div>
              <div className="stat-card">
                <i className="ai-folder-add"></i>
                <h3>Minha Anamnese</h3>
                <p>Preencha seu questionário de saúde</p>
              </div>
              <div className="stat-card">
                <i className="ai-file"></i>
                <h3>Meu Prontuário</h3>
                <p>Acesse seu histórico médico</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPaciente;