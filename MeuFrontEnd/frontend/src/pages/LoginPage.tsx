// src/pages/LoginPage.tsx
import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/AuthService'
import './LoginPage.css'

function LoginPage() {
  const [email, setEmail]     = useState('')
  const [senha, setSenha]     = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro]       = useState<string | null>(null)
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Já logado? Não precisa ver o login
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  if (isAuthenticated) return <Navigate to="/produtos" replace />
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)
    try {
      setLoading(true)
      const resp = await authService.login({ email, senha })
      login(resp)
      navigate('/dashboard')
      navigate('/produtos')
    } catch (err) {
      // sem resposta = a API não respondeu (desligada ou CORS)
      if (isAxiosError(err) && !err.response) {
        setErro('Não foi possível conectar à API. Verifique se o backend está rodando.')
      } else {
        setErro('E-mail ou senha incorretos.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-pagina">
      <div className="login-card">
        <h1 className="login-titulo">🔐 Entrar</h1>
        <p className="login-subtitulo">Acesse o MinhaApp com seu e-mail e senha.</p>

        {erro && <p className="login-erro" role="alert">{erro}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" value={email}
            autoComplete="username"
            onChange={e => setEmail(e.target.value)} required />

          <label htmlFor="senha">Senha</label>
          <input id="senha" type="password" value={senha}
            autoComplete="current-password"
            onChange={e => setSenha(e.target.value)} required />

          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  )
}
export default LoginPage
