import { useState } from 'react'
import { ProdutoService } from '../services/produtoService'

interface Props {
  onProdutoCriado: () => void
}

function ProdutoForm({ onProdutoCriado }: Props) {
  const [nome,    setNome]    = useState('')
  const [preco,   setPreco]   = useState('')
  const [estoque, setEstoque] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro,    setErro]    = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)
    try {
      setLoading(true)
      await ProdutoService.criar({
        nome,
        preco: Number(preco),
        estoque: Number(estoque),
        ativo: true
      })
      setNome('')
      setPreco('')
      setEstoque('') // 👈 limpando o campo estoque
      onProdutoCriado()
    } catch {
      setErro('Erro ao cadastrar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastrar Produto</h2>

      {erro && (
        <p style={{ color: 'red', marginBottom: '16px' }}>{erro}</p>
      )}

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="nome" style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
          Nome
        </label>
        <input
          id="nome"
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="preco" style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
          Preço
        </label>
        <input
          id="preco"
          type="number"
          step="0.01"
          value={preco}
          onChange={e => setPreco(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* 👇 CAMPO DE ESTOQUE ADICIONADO */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="estoque" style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
          Estoque Inicial
        </label>
        <input
          id="estoque"
          type="number"
          min="0"
          value={estoque}
          onChange={e => setEstoque(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px',
          background: loading ? '#999' : '#1a3d5c',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Salvando...' : 'Cadastrar'}
      </button>
    </form>
  )
}

export default ProdutoForm