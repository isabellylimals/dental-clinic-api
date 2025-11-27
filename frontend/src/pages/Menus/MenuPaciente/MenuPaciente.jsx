import React, { useState } from 'react';
import axios from 'axios';
import './MenuPaciente.css';

const MenuPaciente = () => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [activeContent, setActiveContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados para os formulários
  const [consultaData, setConsultaData] = useState({
    cpfPacienteInput: '',
    especialidadeInput: '',
    nomeServicoInput: '',
    dataHora: ''
  });

  const [anamneseData, setAnamneseData] = useState({
    cpf: '',
    respostas: ''
  });

  const [buscaData, setBuscaData] = useState({
    cpf: '',
    idPaciente: '',
    idConsulta: '',
    idAnamnese: ''
  });

  const [cancelamentoData, setCancelamentoData] = useState({
    idConsulta: ''
  });

  const [statusData, setStatusData] = useState({
    idConsulta: '',
    novoStatus: ''
  });

  const [observacaoData, setObservacaoData] = useState({
    idAnamnese: '',
    observacao: ''
  });

  const [servicoData, setServicoData] = useState({
    nome: ''
  });

  const [userData, setUserData] = useState({
    idUsuario: '',
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    dataNascimento: '',
    endereco: ''
  });

  const [profileMessage, setProfileMessage] = useState('');

  const toggleSubmenu = (menuName) => {
    setActiveSubmenu(activeSubmenu === menuName ? null : menuName);
  };

  const handleSubmenuClick = (submenuLabel, menuName) => {
    setActiveContent({ submenuLabel, menuName });
    setError('');

    // Renderizar conteúdo baseado no submenu clicado
    switch(submenuLabel) {
      case 'Solicitar Consulta':
        renderSolicitarConsulta();
        break;
      case 'Visualizar Consultas':
        renderVisualizarConsultas();
        break;
      case 'Status das solicitações':
        renderStatusSolicitacoes();
        break;
      case 'Cancelar solicitação':
        renderCancelarSolicitacao();
        break;
      case 'Preencher Anamnese':
        renderPreencherAnamnese();
        break;
      case 'Visualizar Anamnese Validada':
        renderVisualizarAnamnese();
        break;
      case 'Consultar Anamnese':
        renderConsultarAnamnese();
        break;
      case 'Visualizar prontuário':
        renderVisualizarProntuario();
        break;
      case 'Próximas consultas':
        renderProximasConsultas();
        break;
      case 'Pedidos pendentes':
        renderPedidosPendentes();
        break;
      case 'Anamnese pendente':
        renderAnamnesePendente();
        break;
      case 'Meus dados pessoais':
        renderMeusDados();
        break;
      case 'Encerrar conta':
        renderEncerrarConta();
        break;
      case 'Pesquisar serviços':
        renderPesquisarServicos();
        break;
      case 'Todos os serviços':
        renderTodosServicos();
        break;
      case 'Localização e contatos':
        renderLocalizacaoContatos();
        break;
      default:
        setActiveContent(null);
    }
  };

  // ========== CONSULTAS ==========
  const renderSolicitarConsulta = () => {
    setActiveContent(prev => ({
      ...prev,
      component: (
        <div className="content-section">
          <h2>Solicitar Nova Consulta</h2>
          <form onSubmit={handleSolicitarConsulta} className="form-container">
            <div className="form-group">
              <label>CPF do Paciente:</label>
              <input
                type="text"
                value={consultaData.cpfPacienteInput}
                onChange={(e) => setConsultaData({...consultaData, cpfPacienteInput: e.target.value})}
                required
                placeholder="Digite seu CPF"
              />
            </div>
            <div className="form-group">
              <label>Especialidade Desejada:</label>
              <input
                type="text"
                value={consultaData.especialidadeInput}
                onChange={(e) => setConsultaData({...consultaData, especialidadeInput: e.target.value})}
                required
                placeholder="Ex: Ortodontia, Clínico Geral"
              />
            </div>
            <div className="form-group">
              <label>Serviço Desejado:</label>
              <input
                type="text"
                value={consultaData.nomeServicoInput}
                onChange={(e) => setConsultaData({...consultaData, nomeServicoInput: e.target.value})}
                required
                placeholder="Ex: Limpeza, Consulta de rotina"
              />
            </div>
            <div className="form-group">
              <label>Data e Hora Desejada:</label>
              <input
                type="datetime-local"
                value={consultaData.dataHora}
                onChange={(e) => setConsultaData({...consultaData, dataHora: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Solicitando...' : 'Solicitar Consulta'}
            </button>
          </form>
        </div>
      )
    }));
  };

  const handleSolicitarConsulta = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const consultaDataToSend = {
        ...consultaData,
        dataHora: new Date(consultaData.dataHora).toISOString()
      };

      const response = await axios.post('http://localhost:8080/api/consultas/solicitar', consultaDataToSend);
      
      setActiveContent(prev => ({
        ...prev,
        component: (
          <div className="content-section">
            <h2>Solicitar Nova Consulta</h2>
            <div className="success-message">
              <h3>✅ Consulta solicitada com sucesso!</h3>
              <div className="consulta-info">
                <p><strong>ID da Consulta:</strong> {response.data.idConsulta}</p>
                <p><strong>Status:</strong> {response.data.status}</p>
                <p><strong>Médico:</strong> {response.data.medico?.nome}</p>
                <p><strong>Data/Hora:</strong> {new Date(response.data.dataHora).toLocaleString()}</p>
              </div>
            </div>
            <button 
              onClick={renderSolicitarConsulta}
              className="btn-secondary"
            >
              Nova Solicitação
            </button>
          </div>
        )
      }));
    } catch (err) {
      setError(err.response?.data || 'Erro ao solicitar consulta');
    } finally {
      setLoading(false);
    }
  };

  const renderVisualizarConsultas = () => {
    setActiveContent(prev => ({
      ...prev,
      component: (
        <div className="content-section">
          <h2>Visualizar Minhas Consultas</h2>
          <div className="form-container">
            <div className="form-group">
              <label>CPF do Paciente:</label>
              <input
                type="text"
                value={buscaData.cpf}
                onChange={(e) => setBuscaData({...buscaData, cpf: e.target.value})}
                placeholder="Digite seu CPF"
              />
            </div>
            <button onClick={handleBuscarConsultas} className="btn-primary" disabled={loading}>
              {loading ? 'Buscando...' : 'Buscar Consultas'}
            </button>
          </div>
          <div id="consultas-result" className="result-container"></div>
        </div>
      )
    }));
  };

  const handleBuscarConsultas = async () => {
    if (!buscaData.cpf) {
      setError('CPF é obrigatório');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`http://localhost:8080/api/consultas/buscar-por-cpf?cpf=${buscaData.cpf}`);
      const consultas = response.data;
      
      const resultDiv = document.getElementById('consultas-result');
      resultDiv.innerHTML = `
        <h3>📋 Consultas Encontradas (${consultas.length})</h3>
        <div class="consultas-list">
          ${consultas.length > 0 ? consultas.map(consulta => `
            <div class="consulta-card">
              <p><strong>ID:</strong> ${consulta.idConsulta}</p>
              <p><strong>Data:</strong> ${new Date(consulta.dataHora).toLocaleString()}</p>
              <p><strong>Status:</strong> <span class="status-${consulta.status.toLowerCase()}">${consulta.status}</span></p>
              <p><strong>Médico:</strong> ${consulta.medico?.nome}</p>
              <p><strong>Serviço:</strong> ${consulta.servico?.nomeServico}</p>
            </div>
          `).join('') : '<p class="empty-state">Nenhuma consulta encontrada</p>'}
        </div>
      `;
    } catch (err) {
      setError(err.response?.data || 'Erro ao buscar consultas');
    } finally {
      setLoading(false);
    }
  };

  const renderStatusSolicitacoes = () => {
    setActiveContent(prev => ({
      ...prev,
      component: (
        <div className="content-section">
          <h2>Status das Solicitações</h2>
          <div className="form-container">
            <div className="form-group">
              <label>ID da Consulta:</label>
              <input
                type="number"
                value={statusData.idConsulta}
                onChange={(e) => setStatusData({...statusData, idConsulta: e.target.value})}
                placeholder="Digite o ID da consulta"
              />
            </div>
            <div className="form-group">
              <label>Novo Status:</label>
              <select
                value={statusData.novoStatus}
                onChange={(e) => setStatusData({...statusData, novoStatus: e.target.value})}
              >
                <option value="">Selecione um status</option>
                <option value="SOLICITADA">Solicitada</option>
                <option value="CONFIRMADA">Confirmada</option>
                <option value="REALIZADA">Realizada</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>
            <button onClick={handleAtualizarStatus} className="btn-primary" disabled={loading}>
              {loading ? 'Atualizando...' : 'Atualizar Status'}
            </button>
          </div>
        </div>
      )
    }));
  };

  const handleAtualizarStatus = async () => {
    if (!statusData.idConsulta || !statusData.novoStatus) {
      setError('ID da consulta e novo status são obrigatórios');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:8080/api/consultas/atualizar-status', {
        idConsulta: parseInt(statusData.idConsulta),
        novoStatus: statusData.novoStatus
      });

      setActiveContent(prev => ({
        ...prev,
        component: (
          <div className="content-section">
            <h2>Status das Solicitações</h2>
            <div className="success-message">
              <h3>✅ Status atualizado com sucesso!</h3>
              <p>Status da consulta ${statusData.idConsulta} foi atualizado para: {statusData.novoStatus}</p>
            </div>
            <button 
              onClick={renderStatusSolicitacoes}
              className="btn-secondary"
            >
              Nova Atualização
            </button>
          </div>
        )
      }));
    } catch (err) {
      setError(err.response?.data || 'Erro ao atualizar status');
    } finally {
      setLoading(false);
    }
  };

  const renderCancelarSolicitacao = () => {
    setActiveContent(prev => ({
      ...prev,
      component: (
        <div className="content-section">
          <h2>Cancelar Solicitação de Consulta</h2>
          <div className="form-container">
            <div className="form-group">
              <label>ID da Consulta:</label>
              <input
                type="number"
                value={cancelamentoData.idConsulta}
                onChange={(e) => setCancelamentoData({...cancelamentoData, idConsulta: e.target.value})}
                placeholder="Digite o ID da consulta"
              />
            </div>
            <button onClick={handleCancelarConsulta} className="btn-danger" disabled={loading}>
              {loading ? 'Cancelando...' : 'Cancelar Consulta'}
            </button>
          </div>
        </div>
      )
    }));
  };

  const handleCancelarConsulta = async () => {
    if (!cancelamentoData.idConsulta) {
      setError('ID da consulta é obrigatório');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:8080/api/consultas/cancelar', {
        idConsulta: parseInt(cancelamentoData.idConsulta)
      });

      setActiveContent(prev => ({
        ...prev,
        component: (
          <div className="content-section">
            <h2>Cancelar Solicitação de Consulta</h2>
            <div className="success-message">
              <h3>✅ Consulta cancelada com sucesso!</h3>
              <p>A consulta ID {cancelamentoData.idConsulta} foi cancelada.</p>
            </div>
            <button 
              onClick={renderCancelarSolicitacao}
              className="btn-secondary"
            >
              Novo Cancelamento
            </button>
          </div>
        )
      }));
    } catch (err) {
      setError(err.response?.data || 'Erro ao cancelar consulta');
    } finally {
      setLoading(false);
    }
  };

  // ========== ANAMNESE ==========
  const renderPreencherAnamnese = () => {
    setActiveContent(prev => ({
      ...prev,
      component: (
        <div className="content-section">
          <h2>Preencher Questionário de Anamnese</h2>
          <form onSubmit={handlePreencherAnamnese} className="form-container">
            <div className="form-group">
              <label>CPF do Paciente:</label>
              <input
                type="text"
                value={anamneseData.cpf}
                onChange={(e) => setAnamneseData({...anamneseData, cpf: e.target.value})}
                required
                placeholder="Digite seu CPF"
              />
            </div>
            <div className="form-group">
              <label>Respostas do Questionário:</label>
              <textarea
                value={anamneseData.respostas}
                onChange={(e) => setAnamneseData({...anamneseData, respostas: e.target.value})}
                rows="10"
                placeholder="Digite suas respostas ao questionário de saúde..."
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Anamnese'}
            </button>
          </form>
        </div>
      )
    }));
  };

  const handlePreencherAnamnese = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/anamneses/preencher', anamneseData);
      
      setActiveContent(prev => ({
        ...prev,
        component: (
          <div className="content-section">
            <h2>Preencher Questionário de Anamnese</h2>
            <div className="success-message">
              <h3>✅ Anamnese preenchida com sucesso!</h3>
              <div className="consulta-info">
                <p><strong>ID da Anamnese:</strong> {response.data.idAnamnese}</p>
                <p><strong>Data de Preenchimento:</strong> {response.data.dataPreenchimento}</p>
              </div>
            </div>
            <button 
              onClick={renderPreencherAnamnese}
              className="btn-secondary"
            >
              Preencher Nova Anamnese
            </button>
          </div>
        )
      }));
    } catch (err) {
      setError(err.response?.data || 'Erro ao preencher anamnese');
    } finally {
      setLoading(false);
    }
  };

  const renderVisualizarAnamnese = () => {
    setActiveContent(prev => ({
      ...prev,
      component: (
        <div className="content-section">
          <h2>Visualizar Anamnese Validada</h2>
          <div className="form-container">
            <div className="form-group">
              <label>ID da Anamnese:</label>
              <input
                type="number"
                value={buscaData.idAnamnese}
                onChange={(e) => setBuscaData({...buscaData, idAnamnese: e.target.value})}
                placeholder="Digite o ID da anamnese"
              />
            </div>
            <button onClick={handleVisualizarAnamnese} className="btn-primary" disabled={loading}>
              {loading ? 'Buscando...' : 'Visualizar Anamnese'}
            </button>
          </div>
          <div id="anamnese-result" className="result-container"></div>
        </div>
      )
    }));
  };

  const handleVisualizarAnamnese = async () => {
    if (!buscaData.idAnamnese) {
      setError('ID da anamnese é obrigatório');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`http://localhost:8080/api/anamneses/${buscaData.idAnamnese}`);
      const anamnese = response.data;
      
      const resultDiv = document.getElementById('anamnese-result');
      resultDiv.innerHTML = `
        <h3>📋 Anamnese</h3>
        <div class="prontuario-info">
          <p><strong>ID:</strong> ${anamnese.idAnamnese}</p>
          <p><strong>Data de Preenchimento:</strong> ${anamnese.dataPreenchimento}</p>
          <p><strong>Respostas:</strong> ${anamnese.respostas}</p>
          ${anamnese.informacoes ? `<p><strong>Informações Adicionais:</strong> ${anamnese.informacoes}</p>` : ''}
        </div>
      `;
    } catch (err) {
      setError(err.response?.data || 'Erro ao visualizar anamnese');
    } finally {
      setLoading(false);
    }
  };

  const renderConsultarAnamnese = () => {
    setActiveContent(prev => ({
      ...prev,
      component: (
        <div className="content-section">
          <h2>Consultar e Adicionar Observação na Anamnese</h2>
          <div className="form-container">
            <div className="form-group">
              <label>ID da Anamnese:</label>
              <input
                type="number"
                value={observacaoData.idAnamnese}
                onChange={(e) => setObservacaoData({...observacaoData, idAnamnese: e.target.value})}
                placeholder="Digite o ID da anamnese"
              />
            </div>
            <div className="form-group">
              <label>Observação:</label>
              <textarea
                value={observacaoData.observacao}
                onChange={(e) => setObservacaoData({...observacaoData, observacao: e.target.value})}
                rows="4"
                placeholder="Digite sua observação..."
              />
            </div>
            <button onClick={handleAdicionarObservacao} className="btn-primary" disabled={loading}>
              {loading ? 'Adicionando...' : 'Adicionar Observação'}
            </button>
          </div>
        </div>
      )
    }));
  };

  const handleAdicionarObservacao = async () => {
    if (!observacaoData.idAnamnese || !observacaoData.observacao) {
      setError('ID da anamnese e observação são obrigatórios');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/anamneses/observacao', {
        idAnamnese: parseInt(observacaoData.idAnamnese),
        observacao: observacaoData.observacao
      });

      setActiveContent(prev => ({
        ...prev,
        component: (
          <div className="content-section">
            <h2>Consultar e Adicionar Observação na Anamnese</h2>
            <div className="success-message">
              <h3>✅ Observação adicionada com sucesso!</h3>
              <div className="consulta-info">
                <p><strong>ID da Anamnese:</strong> {response.data.idAnamnese}</p>
                <p><strong>Informações Atualizadas:</strong> ${response.data.informacoes}</p>
              </div>
            </div>
            <button 
              onClick={renderConsultarAnamnese}
              className="btn-secondary"
            >
              Nova Observação
            </button>
          </div>
        )
      }));
    } catch (err) {
      setError(err.response?.data || 'Erro ao adicionar observação');
    } finally {
      setLoading(false);
    }
  };

  // ========== PRONTUÁRIO ==========
  const renderVisualizarProntuario = () => {
    setActiveContent(prev => ({
      ...prev,
      component: (
        <div className="content-section">
          <h2>Visualizar Meu Prontuário</h2>
          <div className="form-container">
            <div className="form-group">
              <label>ID do Paciente:</label>
              <input
                type="number"
                value={buscaData.idPaciente}
                onChange={(e) => setBuscaData({...buscaData, idPaciente: e.target.value})}
                placeholder="Digite seu ID de paciente"
              />
            </div>
            <button onClick={handleVisualizarProntuario} className="btn-primary" disabled={loading}>
              {loading ? 'Carregando...' : 'Visualizar Prontuário'}
            </button>
          </div>
          <div id="prontuario-result" className="result-container"></div>
        </div>
      )
    }));
  };

  const handleVisualizarProntuario = async () => {
    if (!buscaData.idPaciente) {
      setError('ID do paciente é obrigatório');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`http://localhost:8080/api/prontuarios/paciente/${buscaData.idPaciente}`);
      const prontuario = response.data;
      
      const resultDiv = document.getElementById('prontuario-result');
      resultDiv.innerHTML = `
        <h3>📁 Prontuário Médico</h3>
        <div class="prontuario-info">
          <p><strong>ID do Prontuário:</strong> ${prontuario.idProntuario}</p>
          <p><strong>Data de Criação:</strong> ${prontuario.dataCriacao}</p>
          <p><strong>Paciente:</strong> ${prontuario.paciente?.nome}</p>
          ${prontuario.anamnese ? `
            <div class="anamnese-section">
              <h4>Anamnese</h4>
              <p><strong>Respostas:</strong> ${prontuario.anamnese.respostas}</p>
              ${prontuario.anamnese.informacoes ? `<p><strong>Informações:</strong> ${prontuario.anamnese.informacoes}</p>` : ''}
            </div>
          ` : '<p>Nenhuma anamnese associada</p>'}
          ${prontuario.registros && prontuario.registros.length > 0 ? `
            <div class="registros-section">
              <h4>Registros de Atendimento (${prontuario.registros.length})</h4>
              ${prontuario.registros.map(registro => `
                <div class="registro-card">
                  <p><strong>Data:</strong> ${new Date(registro.dataHora).toLocaleString()}</p>
                  <p><strong>Médico:</strong> ${registro.medico?.nome}</p>
                  <p><strong>Observações:</strong> ${registro.observacoes}</p>
                </div>
              `).join('')}
            </div>
          ` : '<p>Nenhum registro de atendimento</p>'}
        </div>
      `;
    } catch (err) {
      setError(err.response?.data || 'Erro ao visualizar prontuário');
    } finally {
      setLoading(false);
    }
  };

  // ========== DASHBOARD ==========
  const renderProximasConsultas = () => {
    setActiveContent(prev => ({
      ...prev,
      component: (
        <div className="content-section">
          <h2>Próximas Consultas</h2>
          <div className="info-card">
            <p>Esta funcionalidade está em desenvolvimento.</p>
            <p>Em breve você poderá visualizar suas próximas consultas agendadas.</p>
          </div>
        </div>
      )
    }));
  };

  const renderPedidosPendentes = () => {
    setActiveContent(prev => ({
      ...prev,
      component: (
        <div className="content-section">
          <h2>Pedidos Pendentes</h2>
          <button onClick={handleBuscarPendentes} className="btn-primary" disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar Consultas Pendentes'}
          </button>
          <div id="pendentes-result" className="result-container"></div>
        </div>
      )
    }));
  };

  const handleBuscarPendentes = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('http://localhost:8080/api/consultas/pendentes');
      const pendentes = response.data;
      
      const resultDiv = document.getElementById('pendentes-result');
      resultDiv.innerHTML = `
        <h3>📋 Consultas Pendentes (${pendentes.length})</h3>
        <div class="consultas-list">
          ${pendentes.length > 0 ? pendentes.map(consulta => `
            <div class="consulta-card">
              <p><strong>ID:</strong> ${consulta.idConsulta}</p>
              <p><strong>Paciente:</strong> ${consulta.paciente?.nome}</p>
              <p><strong>Data:</strong> ${new Date(consulta.dataHora).toLocaleString()}</p>
              <p><strong>Serviço:</strong> ${consulta.servico?.nomeServico}</p>
            </div>
          `).join('') : '<p class="empty-state">Nenhuma consulta pendente</p>'}
        </div>
      `;
    } catch (err) {
      setError(err.response?.data || 'Erro ao buscar consultas pendentes');
    } finally {
      setLoading(false);
    }
  };

  const renderAnamnesePendente = () => {
    setActiveContent(prev => ({
      ...prev,
      component: (
        <div className="content-section">
          <h2>Anamnese Pendente</h2>
          <div className="info-card">
            <p>Verifique se existe alguma anamnese pendente de preenchimento.</p>
            <p>Utilize a opção "Preencher Anamnese" no menu para completar seu questionário de saúde.</p>
          </div>
        </div>
      )
    }));
  };

  // ========== SERVIÇOS ==========
  const renderPesquisarServicos = () => {
    setActiveContent(prev => ({
      ...prev,
      component: (
        <div className="content-section">
          <h2>Pesquisar Serviços</h2>
          <div className="form-container">
            <div className="form-group">
              <label>Nome do Serviço:</label>
              <input
                type="text"
                value={servicoData.nome}
                onChange={(e) => setServicoData({...servicoData, nome: e.target.value})}
                placeholder="Digite o nome do serviço"
              />
            </div>
            <button onClick={handlePesquisarServicos} className="btn-primary" disabled={loading}>
              {loading ? 'Pesquisando...' : 'Pesquisar Serviços'}
            </button>
          </div>
          <div id="servicos-result" className="result-container"></div>
        </div>
      )
    }));
  };

  const handlePesquisarServicos = async () => {
    if (!servicoData.nome) {
      setError('Nome do serviço é obrigatório');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`http://localhost:8080/api/servicos/buscar?nome=${servicoData.nome}`);
      const servicos = response.data;
      
      const resultDiv = document.getElementById('servicos-result');
      resultDiv.innerHTML = `
        <h3>🔍 Serviços Encontrados (${servicos.length})</h3>
        <div class="servicos-list">
          ${servicos.length > 0 ? servicos.map(servico => `
            <div class="servico-card">
              <h4>${servico.nomeServico}</h4>
              <p>${servico.descricao || 'Sem descrição disponível'}</p>
              <p><strong>ID:</strong> ${servico.idServico}</p>
            </div>
          `).join('') : '<p class="empty-state">Nenhum serviço encontrado</p>'}
        </div>
      `;
    } catch (err) {
      setError(err.response?.data || 'Erro ao pesquisar serviços');
    } finally {
      setLoading(false);
    }
  };

  const renderTodosServicos = () => {
    setActiveContent(prev => ({
      ...prev,
      component: (
        <div className="content-section">
          <h2>Todos os Serviços</h2>
          <button onClick={handleBuscarTodosServicos} className="btn-primary" disabled={loading}>
            {loading ? 'Carregando...' : 'Carregar Todos os Serviços'}
          </button>
          <div id="todos-servicos-result" className="result-container"></div>
        </div>
      )
    }));
  };

  const handleBuscarTodosServicos = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('http://localhost:8080/api/servicos');
      const servicos = response.data;
      
      const resultDiv = document.getElementById('todos-servicos-result');
      resultDiv.innerHTML = `
        <h3>📦 Todos os Serviços (${servicos.length})</h3>
        <div class="servicos-list">
          ${servicos.map(servico => `
            <div class="servico-card">
              <h4>${servico.nomeServico}</h4>
              <p>${servico.descricao || 'Sem descrição disponível'}</p>
              <p><strong>ID:</strong> ${servico.idServico}</p>
            </div>
          `).join('')}
        </div>
      `;
    } catch (err) {
      setError(err.response?.data || 'Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  // ========== PERFIL ==========
  const renderMeusDados = () => {
    setActiveContent(prev => ({
      ...prev,
      component: (
        <div className="content-section">
          <h2>Meus Dados Pessoais</h2>
          
          {profileMessage && (
            <div className={profileMessage.type === 'success' ? 'profile-success' : 'profile-error'}>
              <strong>{profileMessage.type === 'success' ? '✅ ' : '❌ '}</strong>
              {profileMessage.text}
            </div>
          )}

          <div className="profile-form">
            <div className="profile-section">
              <h3>Informações Básicas</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Nome Completo *</label>
                  <input
                    type="text"
                    value={userData.nome}
                    onChange={(e) => setUserData({...userData, nome: e.target.value})}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CPF *</label>
                  <input
                    type="text"
                    value={userData.cpf}
                    onChange={(e) => setUserData({...userData, cpf: e.target.value})}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Telefone *</label>
                  <input
                    type="tel"
                    value={userData.telefone}
                    onChange={(e) => setUserData({...userData, telefone: e.target.value})}
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3>Informações Adicionais</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Data de Nascimento</label>
                  <input
                    type="date"
                    value={userData.dataNascimento}
                    onChange={(e) => setUserData({...userData, dataNascimento: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>ID do Usuário (para busca)</label>
                  <input
                    type="number"
                    value={userData.idUsuario}
                    onChange={(e) => setUserData({...userData, idUsuario: e.target.value})}
                    placeholder="Digite seu ID para carregar dados"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Endereço Completo</label>
                <textarea
                  value={userData.endereco}
                  onChange={(e) => setUserData({...userData, endereco: e.target.value})}
                  rows="3"
                  placeholder="Rua, número, bairro, cidade - Estado"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={handleBuscarUsuario} className="btn-secondary" disabled={loading}>
                {loading ? 'Buscando...' : 'Buscar Meus Dados'}
              </button>
              <button onClick={handleAtualizarUsuario} className="btn-primary" disabled={loading}>
                {loading ? 'Atualizando...' : 'Atualizar Dados'}
              </button>
              <button onClick={handleLimparFormulario} className="btn-outline-danger">
                Limpar Formulário
              </button>
            </div>
          </div>
        </div>
      )
    }));
  };

  const handleBuscarUsuario = async () => {
    if (!userData.idUsuario) {
      setProfileMessage({ type: 'error', text: 'Digite o ID do usuário para buscar os dados' });
      return;
    }

    setLoading(true);
    setProfileMessage('');

    try {
      const response = await axios.get(`http://localhost:8080/api/usuarios`);
      const usuarios = response.data;
      const usuario = usuarios.find(u => u.idUsuario === parseInt(userData.idUsuario));
      
      if (usuario) {
        setUserData({
          idUsuario: usuario.idUsuario.toString(),
          nome: usuario.nome || '',
          email: usuario.email || '',
          telefone: usuario.telefone || '',
          cpf: usuario.cpf || '',
          dataNascimento: usuario.dataNascimento || '',
          endereco: usuario.endereco || ''
        });
        setProfileMessage({ type: 'success', text: 'Dados carregados com sucesso!' });
      } else {
        setProfileMessage({ type: 'error', text: 'Usuário não encontrado com este ID' });
      }
    } catch (err) {
      setProfileMessage({ type: 'error', text: 'Erro ao buscar usuário: ' + (err.response?.data || err.message) });
    } finally {
      setLoading(false);
    }
  };

  const handleAtualizarUsuario = async () => {
    if (!userData.idUsuario || !userData.nome || !userData.email) {
      setProfileMessage({ type: 'error', text: 'ID, nome e email são obrigatórios' });
      return;
    }

    setLoading(true);
    setProfileMessage('');

    try {
      const usuarioAtualizado = {
        idUsuario: parseInt(userData.idUsuario),
        nome: userData.nome,
        email: userData.email,
        telefone: userData.telefone,
        cpf: userData.cpf,
        dataNascimento: userData.dataNascimento,
        endereco: userData.endereco,
        tipoUsuario: 'PACIENTE',
        stats: true
      };

      const response = await axios.put('http://localhost:8080/api/usuarios/editar', usuarioAtualizado);
      setProfileMessage({ type: 'success', text: 'Dados atualizados com sucesso!' });
    } catch (err) {
      setProfileMessage({ type: 'error', text: 'Erro ao atualizar usuário: ' + (err.response?.data || err.message) });
    } finally {
      setLoading(false);
    }
  };

  const handleLimparFormulario = () => {
    setUserData({
      idUsuario: '',
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
      dataNascimento: '',
      endereco: ''
    });
    setProfileMessage('');
  };

  // ========== ENCERRAR CONTA MELHORADO ==========
  const renderEncerrarConta = () => {
    setActiveContent(prev => ({
      ...prev,
      component: (
        <div className="content-section">
          <h2>Encerrar Conta</h2>
          
          <div className="warning-section">
            <h3>⚠️ Atenção - Ação Irreversível</h3>
            <p>
              Você está prestes a encerrar sua conta permanentemente. 
              Esta ação não pode ser desfeita e resultará na perda total de acesso aos seus dados.
            </p>
            
            <div className="warning-features">
              <div className="warning-feature">
                <strong>📋 Histórico Médico</strong>
                <span>Seu prontuário será arquivado</span>
              </div>
              <div className="warning-feature">
                <strong>📅 Consultas Futuras</strong>
                <span>Todas as consultas serão canceladas</span>
              </div>
              <div className="warning-feature">
                <strong>🔒 Acesso ao Sistema</strong>
                <span>Login será permanentemente bloqueado</span>
              </div>
              <div className="warning-feature">
                <strong>📊 Dados Pessoais</strong>
                <span>Informações serão anonimizadas</span>
              </div>
            </div>

            <p style={{ fontStyle: 'italic', color: '#bf360c' }}>
              💡 <strong>Recomendação:</strong> Considere apenas desativar temporariamente sua conta se precisar de uma pausa.
            </p>
          </div>

          <div className="confirm-section">
            <h4>Confirmar Encerramento da Conta</h4>
            <p style={{ marginBottom: '20px', color: '#666' }}>
              Para confirmar o encerramento permanente, digite <strong>"ENCERRAR MINHA CONTA"</strong> no campo abaixo:
            </p>
            
            <div className="form-group" style={{ maxWidth: '400px', margin: '0 auto 20px' }}>
              <input
                type="text"
                placeholder='Digite "ENCERRAR MINHA CONTA"'
                style={{ textAlign: 'center', fontWeight: '600' }}
              />
            </div>
            
            <div className="confirm-actions">
              <button className="btn-outline-danger" disabled>
                Encerrar Conta Permanentemente
              </button>
              <button className="btn-secondary" onClick={() => setActiveContent(null)}>
                Cancelar e Voltar
              </button>
            </div>
            
            <p style={{ marginTop: '16px', fontSize: '12px', color: '#999' }}>
              ⚠️ Esta funcionalidade está em fase final de desenvolvimento e será liberada em breve.
            </p>
          </div>
        </div>
      )
    }));
  };

  // ========== INFORMAÇÕES DA CLÍNICA ATUALIZADA ==========
  const renderLocalizacaoContatos = () => {
    setActiveContent(prev => ({
      ...prev,
      component: (
        <div className="content-section">
          <h2>Localização e Contatos</h2>
          
          <div className="info-card" style={{ textAlign: 'left', marginBottom: '32px' }}>
            <h3 style={{ color: '#1976ff', marginBottom: '16px' }}>🏥 Clínica Odontológica Sorriso Saudável</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#003153' }}>
              Cuidando do seu sorriso com excelência há mais de 15 anos. 
              Oferecemos tratamentos odontológicos completos com tecnologia de ponta 
              e uma equipe de profissionais altamente qualificados.
            </p>
          </div>

          <div className="contact-grid">
            <div className="contact-card">
              <div className="icon sky">📍</div>
              <div>
                <h3>Visite-Nos</h3>
                <p>123 Dental Street,<br />Suite 100<br />New York, NY 10001</p>
                <small>Próximo ao Central Park</small>
              </div>
            </div>

            <div className="contact-card">
              <div className="icon purple">📞</div>
              <div>
                <h3>Ligue Para Nós</h3>
                <p>(84) 98765-4321</p>
                <p>(84) 91234-5678</p>
                <small>Seg–Sex 8h–18h</small>
              </div>
            </div>

            <div className="contact-card">
              <div className="icon blue">✉️</div>
              <div>
                <h3>Envie um E-mail</h3>
                <p>contato@sorrisosaudavel.com</p>
                <p>emergencias@sorrisosaudavel.com</p>
                <small>Suporte 24/7 para emergências</small>
              </div>
            </div>

            <div className="contact-card gradient">
              <div className="icon white">⏰</div>
              <div>
                <h3>Horário de Funcionamento</h3>
                <p>Seg–Sex: 8:00 – 18:00<br />
                  Sábado: 9:00 – 16:00<br />
                  Domingo: Fechado</p>
                <strong>Emergências: 24/7</strong>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <div className="info-card">
              <h4 style={{ color: '#1976ff', marginBottom: '16px' }}>🚑 Serviço de Emergência</h4>
              <p style={{ margin: '8px 0', color: '#003153' }}>
                <strong>Plantão 24 horas:</strong> (84) 99999-1234
              </p>
              <p style={{ margin: '8px 0', color: '#666', fontSize: '14px' }}>
                Atendimento de urgência e emergência odontológica disponível 24 horas por dia, 7 dias por semana.
              </p>
            </div>
          </div>
        </div>
      )
    }));
  };

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