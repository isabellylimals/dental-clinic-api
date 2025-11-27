import { useState } from "react";
import "./MenuAdmin.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserDoctor } from "@fortawesome/free-solid-svg-icons";

const MenuAdmin = () => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const toggleSubmenu = (menuName) => {
    setActiveSubmenu(activeSubmenu === menuName ? null : menuName);
  };

  const menuItems = [
    {
      name: "dashboard",
      icon: "ai-dashboard",
      label: "Dashboard",
      submenu: [
        { label: "Estatísticas do Dia" },
        { label: "Alertas Pendentes" },
      ],
    },
    {
      name: "pacientes",
      icon: "ai-people-group",
      label: "Pacientes",
      submenu: [
        { label: "Buscar Paciente" },
        { label: "Lista de Pacientes" },
        { label: "Ficha Completa do Paciente" },
        { label: "Consultar Prontuário" },
        { label: "Consultar Anamnese" },
        { label: "Consultas por Paciente" },
        { label: "Cadastrar Novo Paciente" }
      ],
    },
    {
      name: "consultas",
      icon: "ai-calendar",
      label: "Consultas",
      submenu: [
        { label: "Agendar Consulta" },
        { label: "Confirmar Solicitações" },
        { label: "Visualizar Agenda de Médicos" },
        { label: "Listar Todas as Consultas" },
        { label: "Gerenciar Status de Consultas" }
      ],
    },
    {
      name: "profissionais",
      icon: "fa-user-doctor", 
      label: "Profissionais",
      submenu: [
        { label: "Cadastrar Médico" },
        { label: "Listar Profissionais" },
        { label: "Editar Dados" },
        { label: "Desativar Conta" },
      ],
    },
    {
      name: "servicos",
      icon: "ai-shipping-box-v1",
      label: "Serviços",
      submenu: [
        { label: "Cadastrar Serviço" },
        { label: "Listar Serviços" },
        { label: "Editar Serviços" },
        { label: "Remover Serviço" },
      ],
    },
    {
      name: "relatorio",
      icon: "ai-folder",
      label: "Relatório",
      submenu: [{ label: "Gerar Relatório" }],
    },
    {
      name: "gerenciamento",
      icon: "ai-briefcase",
      label: "Gerenciamento",
      submenu: [
        { label: "Orçamento" },
        { label: "Estoque" },
        { label: "Contratos" },
      ],
    },
    {
      name: "perfil",
      icon: "ai-person",
      label: "Meu Perfil",
      submenu: [
        { label: "Meus dados pessoais" },
        { label: "Encerrar conta" },
      ],
    },
    {
      name: "config",
      icon: "ai-gear",
      label: "Configurações",
      submenu: [{ label: "Informações da Clínica" }],
    }
  ];

  return (
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
                className={activeSubmenu === item.name ? "active" : ""}
                onClick={() => toggleSubmenu(item.name)}
              >
                {item.icon === "fa-user-doctor" ? (
                  <FontAwesomeIcon
                    icon={faUserDoctor}
                    className="fa-icon"
                  />
                ) : (
                  <i className={item.icon}></i>
                )}

                <p>{item.label}</p>
                <i className="ai-chevron-down-small"></i>
              </button>

              <div
                className={`sub-menu ${
                  activeSubmenu === item.name ? "open" : ""
                }`}
              >
                <ul>
                  {item.submenu.map((subItem, index) => (
                    <li key={index}>
                      <button className="sub-menu-item">
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
  );
};

export default MenuAdmin;