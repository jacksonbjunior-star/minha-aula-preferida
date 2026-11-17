import { type Produto } from '../types/Produto'
import { ProdutoService } from '../services/ProdutoService'
import ModalFoto from '../components/produtos/ModalFoto'
import { useState } from 'react'

interface Props {
  produtos: Produto[] 
  loading: boolean
  onAtualizar?: () => void
}

function ProdutoList({ produtos, loading, onAtualizar }: Props) {

  const [produtoModal, setProdutoModal] = useState<Produto | null>(null)

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
        if (onAtualizar) onAtualizar()
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
            {/* 1️⃣ NOVA COLUNA "FOTO" NO CABEÇALHO */}
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd', width: '120px' }}>Foto</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Nome</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Preço</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Estoque</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Status</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => {
            const estoqueBaixo = produto.estoque <= 5 

            return (
              <tr key={produto.id} style={{ borderBottom: '1px solid #eee' }}>
                
                {/* 2️⃣ AQUI ENTRA O SEU CÓDIGO DE THUMBNAIL (Dentro do primeiro <td>) */}
                <td style={{ padding: '12px', verticalAlign: 'middle' }}>
                  <div
                    onClick={() => produto.fotoBase64 && setProdutoModal(produto)}
                    style={{
                      cursor: produto.fotoBase64 ? 'pointer' : 'default',
                      position: 'relative', 
                      overflow: 'hidden',
                      borderRadius: '8px',
                      width: '100px', // Largura fixa para alinhar bem na tabela
                      margin: '0 auto' // Centraliza na célula
                    }}
                  >
                    {produto.fotoBase64 ? (
                      <>
                        <img
                          src={produto.fotoBase64}
                          alt={produto.nome}
                          style={{ 
                            width: '100%', 
                            height: 100, // Ajustado para 100px para ficar proporcional na tabela
                            objectFit: 'cover', 
                            display: 'block' 
                          }}
                        />
                        <div style={{
                          position: 'absolute', top: 4, right: 4,
                          background: 'rgba(0,0,0,0.5)', color: 'white',
                          borderRadius: '50%', width: 24, height: 24,
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 12
                        }}>🔍</div>
                      </>
                    ) : (
                      <div style={{
                        height: 100, background: '#f0f0f0',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', color: '#bbb'
                      }}>
                        <span style={{ fontSize: 24 }}>📷</span>
                        <span style={{ fontSize: 10, marginTop: 2 }}>sem foto</span>
                      </div>
                    )}
                  </div>
                </td>
                {/* FIM DO SEU CÓDIGO DE THUMBNAIL */}

                {/* 3️⃣ RESTANTE DAS COLUNAS */}
                <td style={{ padding: '12px' }}>{produto.nome}</td>
                <td style={{ padding: '12px' }}>R$ {Number(produto.preco).toFixed(2)}</td>
                
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
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* 4️⃣ MODAL FORA DO .MAP() */}
      {produtoModal && (
        <ModalFoto
          produto={produtoModal}
          onClose={() => setProdutoModal(null)}
        />
      )}
    </div>
  )
}

export default ProdutoList