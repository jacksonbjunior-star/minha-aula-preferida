// src/components/SideBar.tsx
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const getLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  display: 'block',
  padding: '12px 20px',
  color: isActive ? '#c8d400' : 'white',
  fontWeight: isActive ? 700 : 400,
  textDecoration: 'none',
  background: isActive ? 'rgba(255,255,255,.12)' : 'transparent',
  borderLeft: isActive ? '4px solid #c8d400' : '4px solid transparent'
})

function Sidebar() {
  // usuário logado e a função de sair, vindos do AuthContext
  const { user, logout } = useAuth()

  return (
    <nav
      style={{
        width: '210px',
        background: '#1a3d5c',
        minHeight: '100vh',
        padding: '24px 0',
        flexShrink: 0,
        fontFamily: "'DM Sans', system-ui, sans-serif"
      }}
    >
      <div
        style={{
          padding: '0 24px 20px',
          color: 'white',
          fontSize: '1.15rem',
          fontWeight: 700
        }}
      >
        MinhaApp
      </div>
      <NavLink to="/dashboard" style={getLinkStyle}>📊 Dashboard</NavLink>
      <NavLink to="/produtos" style={getLinkStyle}>📦 Produtos</NavLink>
      <NavLink to="/clientes" style={getLinkStyle}>👤 Clientes</NavLink>
      <NavLink to="/vendas" style={getLinkStyle}>🛒 Vendas</NavLink>

      {/* Usuário logado + botão Sair */}
      <div
        style={{
          margin: '20px 20px 0',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255,255,255,.2)',
          color: 'white',
          fontSize: '13px'
        }}
      >
        <p style={{ margin: '0 0 10px' }}>👤 {user?.nome}</p>
        <button
          onClick={logout}
          style={{
            padding: '6px 14px',
            color: '#1a3d5c',
            background: '#c8d400',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          🚪 Sair
        </button>
      </div>
    </nav>
  )
}
export default Sidebar
