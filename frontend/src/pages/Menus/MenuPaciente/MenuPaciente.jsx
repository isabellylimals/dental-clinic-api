import { useState, useEffect } from 'react';
import './MenuPaciente.css';

const MenuPaciente = () => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [activeContent, setActiveContent] = useState(null);
  const [error, setError] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState('');

  useEffect(() => {
    carregarServicos();
  }, []);

  const carregarServicos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/servicos');
      
      if (response.ok) {
        const data = await response.json();
        setServicos(data);
      } else {
        console.error('Erro ao carregar serviços');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEspecialidadeChange = (e) => {
    setEspecialidadeSelecionada(e.target.value);
  };

  const handleSolicitarConsulta = async (e) => {
    e.preventDefault();
    setError(null);
    
    const formData = {
      cpf: document.getElementById('cpf').value,
      id_servico: parseInt(document.getElementById('servico').value),
      data_hora: document.getElementById('data').value
    };

    // Validação dos campos obrigatórios
    if (!formData.cpf || !especialidadeSelecionada || !formData.id_servico) {
      setError('CPF, Especialidade e Serviço são obrigatórios');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/consultas/solicitar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const consulta = await response.json();
        alert('Consulta solicitada com sucesso!');
        e.target.reset();
        setEspecialidadeSelecionada('');
      } else {
        const errorText = await response.text();
        setError(errorText || 'Erro ao solicitar consulta');
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.');
      console.error('Erro:', error);
    }
  };

  const toggleSubmenu = (menuName) => {
    setActiveSubmenu(activeSubmenu === menuName ? null : menuName);
  }

  const renderConsultaContent = (label) => {
    switch(label) {
      case 'Solicitar Consulta':
        return (
          <div className="content-section">
            <h2>Solicitar Nova Consulta</h2>

            {error && (
              <div className="error-message">
                <i className="ai-warning"></i>
                {error}
              </div>
            )}
            
            <div className="form-container">
              <form className="consulta-form" onSubmit={handleSolicitarConsulta}>
                {/* CPF - Obrigatório */}
                <div className='form-group'>
                  <label htmlFor="cpf">CPF do Paciente *</label>
                  <input 
                    type="text" 
                    id="cpf"
                    className="form-input" 
                    placeholder="Digite o CPF" 
                    required
                  />
                </div>
                
                {/* Especialidade - Obrigatório */}
                <div className="form-group">
                  <label htmlFor="especialidade">Especialidade *</label>
                  <select 
                    id="especialidade" 
                    className="form-select"
                    value={especialidadeSelecionada}
                    onChange={handleEspecialidadeChange}
                    required
                  >
                    <option value="">Selecione uma especialidade</option>
                    <option value="Odontologia Geral">Odontologia Geral</option>
                    <option value="Endodontia">Endodontia</option>
                    <option value="Cirurgia Bucomaxilofacial">Cirurgia Bucomaxilofacial</option>
                    <option value="Ortodontia">Ortodontia</option>
                    <option value="Odontopediatria">Odontopediatria</option>
                    <option value="Periodontia">Periodontia</option>
                    <option value="Implantodontia">Implantodontia</option>
                    <option value="Prótese Dentária">Prótese Dentária</option>
                    <option value="Odontologia Estética">Odontologia Estética</option>
                  </select>
                </div>
                
                {/* Serviço - Obrigatório */}
                <div className="form-group">
                  <label htmlFor="servico">Serviço *</label>
                  <select 
                    id="servico" 
                    className="form-select" 
                    required
                    disabled={loading}
                  >
                    <option value="">
                      {loading ? 'Carregando serviços...' : 'Selecione um serviço'}
                    </option>
                    {servicos.map((servico) => (
                      <option 
                        key={servico.idServico}
                        value={servico.idServico}
                      >
                        {servico.nomeServico}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Data e Horário - Obrigatório */}
                <div className="form-group">
                  <label htmlFor="data">Data e Horário *</label>
                  <input 
                    type="datetime-local" 
                    id="data" 
                    className="form-input" 
                    required
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn-primary"
                >
                  Solicitar Consulta
                </button>

                <div className="form-required-note">
                  <small>* Campos obrigatórios</small>
                </div>
              </form>
            </div>
          </div>
        );
      
      case 'Visualizar Consultas':
        return (
          <div className="content-section">
            <h2>Minhas Consultas Agendadas</h2>
            <div className="consultas-list">
              <div className="consulta-card">
                <div className="consulta-info">
                  <h3>Consulta com Cardiologista</h3>
                  <p><i className="ai-calendar"></i> 15/12/2024 - 14:30</p>
                  <p><i className="ai-person"></i> Dr. João Silva</p>
                  <span className="status confirmed">Confirmada</span>
                </div>
              </div>
              <div className="consulta-card">
                <div className="consulta-info">
                  <h3>Consulta com Dermatologista</h3>
                  <p><i className="ai-calendar"></i> 20/12/2024 - 10:00</p>
                  <p><i className="ai-person"></i> Dra. Maria Santos</p>
                  <span className="status pending">Pendente</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'Status das solicitações':
        return (
          <div className="content-section">
            <h2>Status das Solicitações</h2>
            <div className="status-list">
              <div className="status-item">
                <h3>Solicitação #001</h3>
                <p>Tipo: Consulta de Retorno</p>
                <p>Data: 10/12/2024</p>
                <span className="status approved">Aprovada</span>
              </div>
              <div className="status-item">
                <h3>Solicitação #002</h3>
                <p>Tipo: Nova Consulta</p>
                <p>Data: 12/12/2024</p>
                <span className="status reviewing">Em análise</span>
              </div>
            </div>
          </div>
        );
      
      case 'Cancelar solicitação':
        return (
          <div className="content-section">
            <h2>Cancelar Solicitação</h2>
            <div className="cancel-section">
              <p>Selecione a solicitação que deseja cancelar:</p>
              <div className="solicitacoes-list">
                <div className="solicitacao-item">
                  <input type="checkbox" id="solicitacao1" />
                  <label htmlFor="solicitacao1">
                    <strong>Consulta com Dr. João Silva</strong>
                    <span>15/12/2024 - 14:30</span>
                  </label>
                </div>
                <button className="btn-danger">Cancelar Selecionadas</button>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div><h2>{label}</h2><p>Conteúdo em desenvolvimento.</p></div>;
    }
  };

  const renderServicosContent = (label) => {
    switch(label) {
      case 'Pesquisar serviços':
        return (
          <div className="content-section">
            <h2>Pesquisar Serviços</h2>
            <div className="search-section">
              <div className="search-bar">
                <input type="text" placeholder="Digite o nome do serviço..." className="search-input" />
                <button className="btn-primary"><i className="ai-search"></i> Pesquisar</button>
              </div>
              <div className="filters">
                <select className="filter-select">
                  <option value="">Todas as categorias</option>
                  <option value="exames">Exames</option>
                  <option value="consultas">Consultas</option>
                  <option value="procedimentos">Procedimentos</option>
                </select>
              </div>
            </div>
          </div>
        );
      
      case 'Todos os serviços':
        return (
          <div className="content-section">
            <h2>Todos os Serviços Disponíveis</h2>
            <div className="servicos-grid">
              <div className="servico-card">
                <h3>Consulta Médica</h3>
                <p>Consulta com especialistas</p>
                <span className="price">R$ 150,00</span>
              </div>
              <div className="servico-card">
                <h3>Exames Laboratoriais</h3>
                <p>Análises clínicas completas</p>
                <span className="price">A partir de R$ 80,00</span>
              </div>
              <div className="servico-card">
                <h3>Ultrassonografia</h3>
                <p>Exames de imagem</p>
                <span className="price">R$ 200,00</span>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div><h2>{label}</h2><p>Conteúdo em desenvolvimento.</p></div>;
    }
  };

  const renderAnamneseContent = (label) => {
    switch(label) {
      case 'Preencher Anamnese':
        return (
          <div className="content-section">
            <h2>Preencher Questionário de Anamnese</h2>
            <div className="anamnese-form">
              <div className="form-section">
                <h3>Dados Pessoais de Saúde</h3>
                <div className="form-group">
                  <label>Possui alguma doença crônica?</label>
                  <div className="radio-group">
                    <input type="radio" id="doenca_sim" name="doenca_cronica" />
                    <label htmlFor="doenca_sim">Sim</label>
                    <input type="radio" id="doenca_nao" name="doenca_cronica" />
                    <label htmlFor="doenca_nao">Não</label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Faz uso de medicamentos contínuos?</label>
                  <textarea placeholder="Liste os medicamentos em uso..." className="form-textarea"></textarea>
                </div>
                <button className="btn-primary">Salvar Anamnese</button>
              </div>
            </div>
          </div>
        );
      
      case 'Visualizar Anamnese Validada':
        return (
          <div className="content-section">
            <h2>Anamnese Validada</h2>
            <div className="anamnese-view">
              <div className="validation-badge">
                <i className="ai-check"></i>
                <span>Documento Validado em 10/12/2024</span>
              </div>
              <div className="anamnese-content">
                <h3>Seus Dados de Saúde</h3>
                <p><strong>Doenças crônicas:</strong> Nenhuma informada</p>
                <p><strong>Medicamentos em uso:</strong> Não faz uso contínuo</p>
                <p><strong>Alergias:</strong> Nenhuma alergia informada</p>
              </div>
            </div>
          </div>
        );
      
      case 'Consultar Anamnese':
        return (
          <div className="content-section">
            <h2>Consultar Histórico de Anamnese</h2>
            <div className="historico-anamnese">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>10/12/2024</td>
                    <td><span className="status approved">Validada</span></td>
                    <td><button className="btn-secondary">Visualizar</button></td>
                  </tr>
                  <tr>
                    <td>05/12/2024</td>
                    <td><span className="status pending">Pendente</span></td>
                    <td><button className="btn-secondary">Editar</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      
      default:
        return <div><h2>{label}</h2><p>Conteúdo em desenvolvimento.</p></div>;
    }
  };

  const renderProntuarioContent = (label) => {
    switch(label) {
      case 'Visualizar prontuário':
        return (
          <div className="content-section">
            <h2>Meu Prontuário Médico</h2>
            <div className="prontuario-tabs">
              <div className="tabs">
                <button className="tab active">Consultas</button>
                <button className="tab">Exames</button>
                <button className="tab">Receitas</button>
              </div>
              <div className="tab-content">
                <h3>Últimas Consultas</h3>
                <div className="consulta-item">
                  <h4>Consulta com Cardiologista</h4>
                  <p><strong>Data:</strong> 05/12/2024</p>
                  <p><strong>Diagnóstico:</strong> Pressão arterial controlada</p>
                  <p><strong>Observações:</strong> Manter acompanhamento trimestral</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div><h2>{label}</h2><p>Conteúdo em desenvolvimento.</p></div>;
    }
  };

  const renderDashboardContent = (label) => {
    switch(label) {
      case 'Próximas consultas':
        return (
          <div className="content-section">
            <h2>Próximas Consultas</h2>
            <div className="dashboard-cards">
              <div className="dashboard-card">
                <h3>Hoje</h3>
                <p>Nenhuma consulta hoje</p>
              </div>
              <div className="dashboard-card">
                <h3>Próximos 7 dias</h3>
                <div className="appointment-item">
                  <strong>Cardiologista</strong>
                  <span>15/12 - 14:30</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'Pedidos pendentes':
        return (
          <div className="content-section">
            <h2>Pedidos Pendentes</h2>
            <div className="pending-orders">
              <div className="order-item">
                <i className="ai-time"></i>
                <div>
                  <h4>Solicitação de Consulta</h4>
                  <p>Status: Aguardando aprovação</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'Anamnese pendente':
        return (
          <div className="content-section">
            <h2>Anamnese Pendente</h2>
            <div className="pending-anamnese">
              <div className="warning-card">
                <i className="ai-warning"></i>
                <h3>Questionário de Anamnese Incompleto</h3>
                <p>Complete seu questionário de saúde para melhor atendimento.</p>
                <button className="btn-primary">Completar Anamnese</button>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div><h2>{label}</h2><p>Conteúdo em desenvolvimento.</p></div>;
    }
  };

  const renderPerfilContent = (label) => {
    switch(label) {
      case 'Meus dados pessoais':
        return (
          <div className="content-section">
            <h2>Meus Dados Pessoais</h2>
            <div className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nome Completo:</label>
                  <input type="text" defaultValue="" className="form-input" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>CPF:</label>
                  <input type="text" defaultValue="" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" defaultValue="" className="form-input" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Telefone</label>
                  <input type="tel" defaultValue="" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Data de Nascimento</label>
                  <input type="date" defaultValue="" className="form-input" />
                </div>
              </div>
              <button className="btn-primary">Salvar Alterações</button>
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
    switch(label) {
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
    
    switch(menuName) {
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
      case 'dashboard':
        component = renderDashboardContent(label);
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
    
    setActiveContent({ menuName, label, component });
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
        { label: 'Pesquisar serviços' },
        { label: 'Todos os serviços' }
      ]
    },
    {
      name: 'anamnese',
      icon: 'ai-folder-add',
      label: 'Minha Anamnese',
      submenu: [
        { label: 'Preencher Anamnese' },
        { label: 'Visualizar Anamnese Validada'},
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
      name: 'dashboard',
      icon: 'ai-dashboard',
      label: 'Dashboard',
      submenu: [
        { label: 'Próximas consultas' },
        { label: 'Pedidos pendentes' },
        { label: 'Anamnese pendente' }
      ]
    },
    {
      name: 'perfil',
      icon: 'ai-person',
      label: 'Meu Perfil',
      submenu: [
        { label: 'Meus dados pessoais' },
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

      {/* Área de Conteúdo Principal */}
      <div className="main-content">
        {error && (
          <div className="error-message">
            <i className="ai-warning"></i>
            {error}
          </div>
        )}
        
        {activeContent ? (
          activeContent.component
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