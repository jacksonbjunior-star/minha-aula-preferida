// src/pages/ProdutoPage.tsx
import { useCallback, useEffect, useState } from 'react'
import ProdutoForm from '../components/ProdutoForm'
import ProdutoList from '../components/ProdutoList'
import { ProdutoService } from '../services/ProdutoService'
import { type Produto } from '../types/Produto'
import './ProdutoPage.css'

function ProdutoPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    try {
      setLoading(true)
      setErro(null)
      const lista = await ProdutoService.listar()
      setProdutos(lista)
    } catch {
      setErro(
        'Não foi possível carregar os produtos. Verifique se o backend está rodando em localhost:5255 e se o CORS libera http://localhost:5173.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  return (
    <main className="pagina">
      <div className="painel">
        <h1 className="pagina-titulo">⚙️ Gestão de Produtos</h1>

        {erro && (
          <p className="mensagem-erro" role="alert">
            {erro}
          </p>
        )}

        <section className="card">
          <ProdutoForm onProdutoCriado={carregar} />
        </section>

        <section className="card">
          <h2>📦 Produtos Cadastrados</h2>
          <ProdutoList produtos={produtos} loading={loading} />
        </section>
      </div>
    </main>
  )
}

export default ProdutoPage
