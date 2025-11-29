import { useState } from "react";
import "./MenuMedico.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentMedical } from "@fortawesome/free-solid-svg-icons";

const MenuMedico = () => {
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
        { label: "Consultas pendentes" },
        { label: "Alertas de prontuário / anamnese" },
        { label: "Meus Atendimentos" }
      ],
    },
    {
      name: "agenda",
      icon: "ai-calendar",
      label: "Agenda",
      submenu: [
        { label: "Agendamentos" },
      ],
    },
    {
      name: "pacientes",
      icon: "ai-people-group",
      label: "Pacientes",
      submenu: [
        { label: "Buscar paciente" },
        { label: "Listar pacientes" },
        { label: "Ficha do Paciente" },
        { label: "Consultar Prontuário" },
        { label: "Consultar Anamnese" },
      ],
    },
    {
      name: "anamnese",
      icon: "ai-folder-add",
      label: "Anamnese",
      submenu: [
        { label: "Registrar anamnese" },
        { label: "Registrar Observação" }
      ],
    },
    {
      name: "consulta",
      icon: "fa-comment-medical", 
      label: "Consultas / Atendimentos",
      submenu: [
        { label: "Buscar consulta" },
        { label: "Agendar consulta" },
        { label: "Evolução clínica" },
        { label: "Gerenciar status das Consultas" }
      ],
    },
    {
      name: "servicos",
      icon: "ai-shipping-box-v1",
      label: "Serviços",
      submenu: [
        { label: "Listar serviços" },
        { label: "Buscar serviços" },
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
      name: "info",
      icon: "ai-info",
      label: "Informações da Clínica",
      submenu: [{ label: "Localização e contatos" }],
    },
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
                {item.icon.startsWith("fa-") ? (
                  <FontAwesomeIcon icon={faCommentMedical} className="fa-icon" />
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

export default MenuMedico;