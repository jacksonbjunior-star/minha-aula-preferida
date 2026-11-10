import { type Produto } from '../types/Produto'
import {ProdutoService } from '../services/ProdutoService'

interface Props {
  produtos: Produto[]
  loading: boolean
  onAtualizar?: () => void // Opcional: para recarregar a lista após excluir
}

function ProdutoList({ produtos, loading, onAtualizar }: Props) {
  if (loading) {
    return <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Carregando produtos...</p>
  }

  if (produtos.length === 0) {
    return <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Nenhum produto cadastrado ainda.</p>
  }

  const handleExcluir = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await ProdutoService.excluir(id)
        if (onAtualizar) onAtualizar() // Chama a função do ProdutoPage para recarregar
      } catch {
        alert('Erro ao excluir o produto. Tente novamente.')
      }
    }
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ background: '#f4f6f8', textAlign: 'left' }}>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Nome</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Preço</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Estoque</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Status</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => {
            // 👇 Regra de negócio: Estoque baixo é 5 ou menos
            const estoqueBaixo = produto.estoque <= 5 

            return (
              <tr key={produto.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{produto.nome}</td>
                <td style={{ padding: '12px' }}>R$ {Number(produto.preco).toFixed(2)}</td>
                
                {/* 👇 Destaque visual para o estoque */}
                <td style={{ padding: '12px', fontWeight: 'bold', color: estoqueBaixo ? '#d32f2f' : '#2e7d32' }}>
                  {estoqueBaixo && '⚠️ '} {produto.estoque} un
                </td>
                
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: produto.ativo ? '#e8f5e9' : '#ffebee',
                    color: produto.ativo ? '#2e7d32' : '#c62828'
                  }}>
                    {produto.ativo ? '✅ Ativo' : '❌ Inativo'}
                  </span>
                </td>
                
                <td style={{ padding: '12px' }}>
                  <button 
                    onClick={() => handleExcluir(produto.id)} 
                    style={{ 
                      color: '#d32f2f', 
                      background: 'none', 
                      border: '1px solid #d32f2f', 
                      borderRadius: '4px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    🗑️ Excluir
                  </button>
                  {/* Aqui você pode adicionar um botão de Editar no futuro */}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ProdutoList