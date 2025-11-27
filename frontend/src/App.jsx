import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginSignup from './pages/LoginSignUps/LoginSignUps.jsx'
import Home from './pages/Home/Home.jsx'
import MenuPaciente from './pages/Menus/MenuPaciente/MenuPaciente.jsx'
import MenuMedico from './pages/Menus/MenuMedico/MenuMedico.jsx'
import MenuAdmin from './pages/Menus/MenuAdmin/MenuAdmin.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* HOME */}
          <Route path="/" element={<Home />} />

          {/* LOGIN / CADASTRO */}
          <Route path="/login" element={<LoginSignup />} />

          {/* MENUS */}
          <Route path="/menupaciente" element={<MenuPaciente />} />
          <Route path="/menumedico" element={<MenuMedico />} />
          <Route path="/menuadmin" element={<MenuAdmin />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
