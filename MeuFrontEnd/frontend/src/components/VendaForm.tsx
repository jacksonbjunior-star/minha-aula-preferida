import { useEffect, useState } from 'react'
import { VendaService } from '../services/VendaService'
import { ProdutoService } from '../services/ProdutoService'
import { clienteService } from '../services/ClienteService'
import { type Produto } from '../types/Produto'
import { type Cliente } from '../types/Cliente'

interface Props {
  onVendaCriado: () => void
}

function VendaForm({ onVendaCriado }: Props) {
  const [cliente, setCliente] = useState<Cliente[]>([])
  const [produto, setProduto] = useState<Produto[]>([])

  const [id_Produto, setId_Produto] = useState('')
  const [id_Cliente, setId_Cliente] = useState('')
  const [quantidade, setQuantidade] = useState('1')

  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(null)

  // Novo: produto selecionado para mostrar estoque
  const produtoSelecionado = produto.find(p => p.id === Number(id_Produto))

  useEffect(() => {
    const carregarListas = async () => {
      try {
        setCliente(await clienteService.listar())
        setProduto(await ProdutoService.listar())
      } catch {
        setErro('Erro ao carregar clientes e produtos.')
      }
    }
    carregarListas()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)
    setSucesso(null)

    // Validação de estoque
    if (produtoSelecionado && Number(quantidade) > produtoSelecionado.estoque) {
      setErro(`Estoque insuficiente! Disponível: ${produtoSelecionado.estoque}`)
      return
    }

    try {
      setLoading(true)
      const venda = await VendaService.criar({
        id_Produto: Number(id_Produto),
        id_Cliente: Number(id_Cliente),
        quantidade: Number(quantidade),
      })
      setSucesso('Venda realizada com sucesso, total: R$' + venda.total_Venda.toFixed(2))
      setId_Produto('')
      setId_Cliente('')
      setQuantidade('1')
      onVendaCriado()
      
      // Recarrega produtos para atualizar estoque
      setProduto(await ProdutoService.listar())
    } catch (error: any) {
      // Mensagem de erro mais específica
      const mensagem = error?.response?.data?.message || 'Erro ao cadastrar. Tente novamente.'
      setErro(mensagem)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>🛒 Registrar Venda</h2>

      {erro && <p className="mensagem-erro">{erro}</p>}
      {sucesso && <p className="mensagem-sucesso">{sucesso}</p>}

      <div>
        <label htmlFor="cliente">Cliente</label>
        <select
          id="cliente"
          value={id_Cliente}
          onChange={e => setId_Cliente(e.target.value)}
          required
        >
          <option value="">Selecione...</option>
          {cliente.map(c => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="produto">Produto</label>
        <select
          id="produto"
          value={id_Produto}
          onChange={e => setId_Produto(e.target.value)}
          required
        >
          <option value="">Selecione...</option>
          {produto.map(p => (
            <option key={p.id} value={p.id}>
              {p.nome} - R$ {p.preco.toFixed(2)} {p.estoque > 0 ? `(Estoque: ${p.estoque})` : '(SEM ESTOQUE)'}
            </option>
          ))}
        </select>
        
        {/* Mostra estoque do produto selecionado */}
        {produtoSelecionado && (
          <small style={{ color: produtoSelecionado.estoque === 0 ? 'red' : 'green' }}>
            Estoque disponível: {produtoSelecionado.estoque}
          </small>
        )}
      </div>

      <div>
        <label htmlFor="quantidade">Quantidade</label>
        <input
          id="quantidade"
          type="number"
          min="1"
          max={produtoSelecionado?.estoque || 1}
          value={quantidade}
          onChange={e => setQuantidade(e.target.value)}
          required
        />
      </div>

      <div className="form-acoes">
        <button type="submit" disabled={loading || produtoSelecionado?.estoque === 0}>
          {loading ? 'Registrando...' : 'Registrar venda'}
        </button>
      </div>
    </form>
  )
}

export default VendaForm