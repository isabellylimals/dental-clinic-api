import { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import introimg from "../../assets/images/introimg.jpg";
import aboutusimg from "../../assets/images/aboutusimg.jpg";
import service1 from "../../assets/images/service1.jpg";
import service2 from "../../assets/images/service2.jpg";
import service3 from "../../assets/images/service3.jpg";
import service4 from "../../assets/images/service4.jpg";
import service5 from "../../assets/images/service5.jpg";
import service6 from "../../assets/images/service6.jpg";
import iconservice1 from "../../assets/icons/service1.svg";
import iconservice2 from "../../assets/icons/service2.svg";
import iconservice3 from "../../assets/icons/service3.svg";
import iconservice4 from "../../assets/icons/service4.svg";
import iconservice5 from "../../assets/icons/service5.svg";
import iconservice6 from "../../assets/icons/service6.svg";
import iconSeta from "../../assets/icons/seta.svg";
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faLinkedin, faInstagram, faSquareTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faStar,
  faPhone,
  faAward,
  faUsers,
  faClock,
  faTooth,
  faMedal,
  faShieldAlt,
  faHeart,
  faChartLine,
  faMapMarkerAlt,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  return (
    <> 
      <div className="home-container">
        {/* Navbar */}
        <header className="navbar">
        <div className="logo">
          <div className="logo-icon">
            {/* Ícone da marca (estrela, dente, etc.) */}
            <FontAwesomeIcon icon={faStar} />
            {/* se quiser dente: faTooth */}
          </div>

          <div className="logo-text">
            <span className="brand-strong">BrightSmile</span>
            <span className="brand-light">Dental</span>
          </div>
        </div>

          <nav className="nav-links">
            <a href="#beginning">Início</a>
            <a href="#services">Serviços</a>
            <a href="#about">Sobre</a>
            <a href="#contact">Contatos</a>
          </nav>

          <div className="nav-right">
            <span className="phone">
              <FontAwesomeIcon icon={faPhone} style={{ marginRight: "6px" }} />
              (84) 98765-4321
            </span>


            {/* BOTÃO QUE VAI PARA LOGIN */}
            <Link className="btn-blue" to="/login">
              Logar
              <FontAwesomeIcon icon={faCircleUser} className="btn-user-icon" />
            </Link>
          </div>
        </header>

        {/* HERO */}
        <section className="hero" id="beginning">
          <div className="hero-left">
           <div className="badge">
              <FontAwesomeIcon icon={faStar} style={{ marginRight: "6px" }} />
              Cuidado Dental Premiado
            </div>


            <h1>
              Seu Sorriso Perfeito <br /> Começa Aqui
            </h1>

            <p>
              Experimente cuidados dentários de classe mundial com nossa equipe especializada. Combinamos
              tecnologia avançada com cuidado gentil para dar a você o sorriso que
              sempre desejou.
            </p>

            <div className="hero-buttons">
              <Link to="/login" className="btn-blue">
                Logar
                <img src={iconSeta} className="seta-icon" />
              </Link>

              <a href="#services" className="btn-outline">
                Nossos Serviços
              </a>
            </div>

            {/* Stats */}
            <div className="stats">
              <div className="stat">
                <div className="stat-icon">
                <FontAwesomeIcon icon={faAward} />
                </div>

                <p className="info">10+ Anos</p>
                <p>Experiência</p>
              </div>

              <div className="stat">
                <div className="stat-icon">
              <FontAwesomeIcon icon={faUsers} />
              </div>

                <p className="info">1.000+</p>
                <p>Pacientes Felizes</p>
              </div>

              <div className="stat">
               <div className="stat-icon">
                 <FontAwesomeIcon icon={faClock} />
                </div>

                <p className="info">Seg a Sáb</p>
                <p>Atendimento Emergencial</p>
              </div>
            </div>
          </div>

          {/* Right image */}
          <div className="hero-right">
            <img
              src={introimg}
              alt="Clínica Dental"
            />

            <div className="floating-card">
              <span className="tooth">
              <FontAwesomeIcon icon={faTooth} />
            </span>

              <div>
                <strong>99% Taxa de Sucesso</strong>
                <br />
                <small>Nos Tratamentos</small>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="services-section" id="services">
          <div className="section-container">
            <div className="services-content">
              <p className="services-label">Nossos Serviços</p>
              <h2 className="services-title">Soluções Dentárias Completas</h2>

              <p className="services-subtitle">
                De check-ups de rotina a procedimentos avançados, oferecemos uma gama completa de
                serviços dentários para atender a todas as suas necessidades de saúde bucal.
              </p>

              <div className="services-cards">
                {/* CARD 1 */}
                <div className="service-card">
                  <div className="card-img">
                    <img
                      src={service1}
                      alt="Clareamento Dental"
                    />
                    <div className="card-icon yellow">
                      <img src={iconservice1} alt="clareamento" />
                    </div>
                  </div>

                  <div className="card-content">
                    <h3>Clareamento Dental</h3>
                    <p>
                      Tratamentos de clareamento profissional para um sorriso mais brilhante e confiante.
                    </p>
                    <a href="#" className="learn-more">
                      Saiba Mais →
                    </a>
                  </div>
                </div>

                {/* CARD 2 */}
                <div className="service-card">
                  <div className="card-img">
                    <img
                      src={service2}
                      alt="Implantes Dentários"
                    />
                    <div className="card-icon purple">
                      <img src={iconservice2} alt="implantes" />
                    </div>
                  </div>

                  <div className="card-content">
                    <h3>Implantes Dentários</h3>
                    <p>
                      Soluções permanentes de reposição dentária com aparência e sensação naturais.
                    </p>
                    <a href="#" className="learn-more">
                      Saiba Mais →
                    </a>
                  </div>
                </div>

                {/* CARD 3 */}
                <div className="service-card">
                  <div className="card-img">
                    <img
                      src={service3}
                      alt="Ortodontia"
                    />
                    <div className="card-icon blue">
                      <img src={iconservice3} alt="ortodontia" />
                    </div>
                  </div>

                  <div className="card-content">
                    <h3>Ortodontia</h3>
                    <p>
                      Aparelhos modernos e alinhadores para endireitar seus dentes de forma bonita.
                    </p>
                    <a href="#" className="learn-more">
                      Saiba Mais →
                    </a>
                  </div>
                </div>

                {/* CARD 4 – Cuidado Preventivo */}
                <div className="service-card">
                  <div className="card-img">
                    <img
                      src={service4}
                      alt="Cuidado Preventivo"
                    />
                    <div className="card-icon green">
                      <img src={iconservice4} alt="cuidado preventivo" />
                    </div>
                  </div>

                  <div className="card-content">
                    <h3>Cuidado Preventivo</h3>
                    <p>
                      Check-ups regulares e limpezas para manter uma saúde bucal ideal.
                    </p>
                    <a href="#" className="learn-more">
                      Saiba Mais →
                    </a>
                  </div>
                </div>

                {/* CARD 5 – Dentística */}
                <div className="service-card">
                  <div className="card-img">
                    <img
                      src={service5}
                      alt="Dentística"
                    />
                    <div className="card-icon pink">
                      <img src={iconservice5} alt="dentística" />
                    </div>
                  </div>

                  <div className="card-content">
                    <h3>Dentística</h3>
                    <p>
                      Transforme seu sorriso com facetas, restaurações e remodelação.
                    </p>
                    <a href="#" className="learn-more">
                      Saiba Mais →
                    </a>
                  </div>
                </div>

                {/* CARD 6 – Atendimento de Emergência */}
                <div className="service-card">
                  <div className="card-img">
                    <img
                      src={service6}
                      alt="Atendimento de Emergência"
                    />
                    <div className="card-icon orange">
                      <img src={iconservice6} alt="emergência" />
                    </div>
                  </div>

                  <div className="card-content">
                    <h3>Atendimento de Emergência</h3>
                    <p>
                      Serviços dentários de emergência 24 horas para situações urgentes.
                    </p>
                    <a href="#" className="learn-more">
                      Saiba Mais →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="about-section" id="about">
          <div className="section-container">
          <div className="about-container">
            {/* Left image */}
            <div className="about-image">
              <img
                src={aboutusimg}
                alt="Equipe da Clínica"
              />

              <div className="rating-box">
                <h3>4.9/5</h3>
                <p>Avaliação dos Pacientes</p>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} className="star-icon" />
                  ))}
                </div>

              </div>
            </div>

            {/* Right content */}
            <div className="about-content">
              <p className="about-label">Sobre Nós</p>

              <h2 className="about-title">
                Criando <br />
                Sorrisos Bonitos <br />
                Desde 2008
              </h2>

              <p className="about-text">
                Somos apaixonados por transformar vidas através de cuidados dentários excepcionais.
                Nossa equipe de profissionais experientes combina tecnologia de ponta com uma
                abordagem gentil e centrada no paciente.
              </p>

              <p className="about-text">
                Acreditamos que todos merecem um sorriso saudável e bonito.
                É por isso que oferecemos serviços abrangentes em um ambiente
                confortável e acolhedor, onde suas necessidades sempre vêm em primeiro lugar.
              </p>

              {/* Features */}
              <div className="about-features">
                <div className="feature">
                  <div className="icon blue">
                <FontAwesomeIcon icon={faMedal} />
              </div>

                  <div>
                    <h4>Equipe Especializada</h4>
                    <p>Dentistas altamente qualificados com anos de experiência</p>
                  </div>
                </div>

                <div className="feature">
                  <div className="icon purple">
                    <FontAwesomeIcon icon={faShieldAlt} />
                  </div>

                  <div>
                    <h4>Seguro e Estéril</h4>
                    <p>Protocolos de esterilização e segurança de última geração</p>
                  </div>
                </div>

                <div className="feature">
                  <div className="icon sky">
                    <FontAwesomeIcon icon={faHeart} />
                  </div>

                  <div>
                    <h4>Cuidado ao Paciente</h4>
                    <p>Cuidado compassivo personalizado para suas necessidades</p>
                  </div>
                </div>

                <div className="feature">
                  <div className="icon green">
                    <FontAwesomeIcon icon={faChartLine} />
                  </div>

                  <div>
                    <h4>Tecnologia Avançada</h4>
                    <p>Equipamentos modernos para tratamentos precisos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </section>
        {/* CONTACT SECTION */}
        <section className="contact-section" id="contact">
          <div className="section-container">
          <h4 className="contact-label">Entre em Contato</h4>
          <h2 className="contact-title">Contatos</h2>

          <p className="contact-subtitle">
            Pronto para começar sua jornada rumo ao sorriso perfeito? Entre em contato conosco hoje
            para agendar sua consulta.
          </p>

          <div className="contact-wrapper">

            {/* LEFT INFO CARDS */}
            <div className="contact-info">

              <div className="contact-card">
                <div className="icon sky">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>

                <div>
                  <h3>Visite-Nos</h3>
                  <p>123 Rua Principal,<br />Suite 100<br />Pau dos Ferros, RN</p>
                </div>
              </div>

              <div className="contact-card">
                <div className="icon purple">
                  <FontAwesomeIcon icon={faPhone} />
                </div>

                <div>
                  <h3>Ligue Para Nós</h3>
                  <p>(84) 98765-4321</p>
                  <small>Seg–Sex 8h–18h</small>
                </div>
              </div>

              <div className="contact-card">
                <div className="icon blue">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>

                <div>
                  <h3>Envie um E-mail</h3>
                  <p>info@brightsmile.com</p>
                  <small>Suporte 24/7</small>
                </div>
              </div>

              <div className="contact-card gradient">
                <div className="icon white">
                  <FontAwesomeIcon icon={faClock} />
                </div>

                <div>
                  <h3>Horário de Funcionamento</h3>
                  <p>Seg–Sex: 8:00 – 18:00<br />
                    Sábado: 9:00 – 16:00<br />
                    Domingo: Fechado</p>
                  <strong>Emergências: Seg a Sáb</strong>
                </div>
              </div>

            </div>

            {/* RIGHT FORM */}
            <form className="contact-form">

              <div className="row">
                <div className="field">
                  <label>Nome Completo *</label>
                  <input type="text" placeholder="João Silva" />
                </div>

                <div className="field">
                  <label>E-mail *</label>
                  <input type="email" placeholder="joao@exemplo.com" />
                </div>
              </div>

              <div className="row">
                <div className="field">
                  <label>Assunto *</label>
                  <input type="text" placeholder="Título da mensagem" />
                </div>

                <div className="field">
                  <label>Telefone *</label>
                  <input type="text" placeholder="(84) 98765-4321" />
                </div>
              </div>

              <div className="field">
                <label>Mensagem</label>
                <textarea placeholder="Digite sua dúvida ou mensagem aqui..." />
              </div>

              <button className="btn-blue large">
                Enviar Dúvidas
              </button>

              <p className="contact-note">
                Entraremos em contato em até 24 horas para confirmar sua consulta.
              </p>

            </form>

          </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-top">
            <div className="footer-left">
              <div className="footer-logo">
                <div className="logo-icon">
                  <FontAwesomeIcon icon={faStar} />
                </div>

                <div className="footer-brand">BrightSmile Dental</div>
              </div>
              <p className="footer-desc">
                Criando sorrisos bonitos e saudáveis<br/>
                com cuidados dentários excepcionais desde 2008.
              </p>
              <div className="footer-socials">
                <a href="#" className="social-circle">
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a href="#" className="social-circle">
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
                <a href="#" className="social-circle">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a href="#" className="social-circle">
                  <FontAwesomeIcon icon={faSquareTwitter} />
                </a>
                <a href="#" className="social-circle">
                  <FontAwesomeIcon icon={faWhatsapp} />
                </a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Links Rápidos</h4>
              <ul>
                <li><Link to="#beginning">Início</Link></li>
                <li><Link to="#services">Serviços</Link></li>
                <li><Link to="#about">Sobre Nós</Link></li>
                <li><Link to="#contact">Contato</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Nossos Serviços</h4>
              <ul>
                <li><Link to="#">Clareamento Dental</Link></li>
                <li><Link to="#">Implantes Dentários</Link></li>
                <li><Link to="#">Ortodontia</Link></li>
                <li><Link to="#">Cuidado Preventivo</Link></li>
                <li><Link to="#">Atendimento de Emergência</Link></li>
              </ul>
            </div>

            <div className="footer-col footer-contact">
              <h4>Informações de Contato</h4>
              <p>123 Rua Principal, Suite 100<br/>Pau dos Ferros, RN1</p>
              <p className="footer-phone">(84) 98765-4321</p>
              <p className="footer-email">info@brightsmile.com</p>
            </div>
          </div>

          <div className="footer-bottom">
            <div>© 2025 BrightSmile Dental. Todos os direitos reservados.</div>
          <div className="made-with">
            Desenvolvido para proporcionar a melhor experiência ao paciente.
          </div>

            <div className="policies">
              <Link to="#">Política de Privacidade</Link>
              <Link to="#">Termos de Serviço</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}