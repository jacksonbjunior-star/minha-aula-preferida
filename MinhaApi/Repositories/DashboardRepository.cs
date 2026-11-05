 // mesmo using dos outros repositories
using MySqlConnector;
public class DashboardRepository : IDashboardRepository
{
    private readonly string _cs;
    public DashboardRepository(IConfiguration config)
        => _cs = config.GetConnectionString("DefaultConnection")!;

    public DashboardResumo ObterResumo(DateTime inicio)
    {
        using var conn = new MySqlConnection(_cs);
        conn.Open();
        using var cmd = new MySqlCommand(@"
            SELECT
              (SELECT COUNT(*) FROM venda
                 WHERE data_venda >= @Inicio) AS total_vendas,
              (SELECT COALESCE(SUM(total_venda), 0) FROM venda
                 WHERE data_venda >= @Inicio) AS faturamento,
              (SELECT COUNT(*) FROM cliente
                 WHERE ativo = 1) AS total_clientes", conn);
        cmd.Parameters.AddWithValue("@Inicio", inicio);

        using var r = cmd.ExecuteReader();
        r.Read();
        return new DashboardResumo
        {
            TotalVendas   = Convert.ToInt32(r["total_vendas"]),
            Faturamento   = Convert.ToDecimal(r["faturamento"]),
            TotalClientes = Convert.ToInt32(r["total_clientes"])
        };
    }

    public List<VendasPorDia> ObterVendasPorDia(DateTime inicio)
    {
        var lista = new List<VendasPorDia>();
        using var conn = new MySqlConnection(_cs);
        conn.Open();
        using var cmd = new MySqlCommand(@"
            SELECT DATE(data_venda) AS dia,
                   COUNT(*)         AS qtd,
                   SUM(total_venda) AS total
            FROM venda
            WHERE data_venda >= @Inicio
            GROUP BY DATE(data_venda)
            ORDER BY dia", conn);
        cmd.Parameters.AddWithValue("@Inicio", inicio);

        using var r = cmd.ExecuteReader();
        while (r.Read())
            lista.Add(new VendasPorDia
            {
                Data       = Convert.ToDateTime(r["dia"]),
                Quantidade = Convert.ToInt32(r["qtd"]),
                Total      = Convert.ToDecimal(r["total"])
            });
        return lista;
    }

    public List<TopProduto> ObterTopProdutos(DateTime inicio, int limite)
    {
        var lista = new List<TopProduto>();
        using var conn = new MySqlConnection(_cs);
        conn.Open();
        using var cmd = new MySqlCommand(@"
            SELECT p.id, p.nome,
                   SUM(v.quantidade)  AS qtd,
                   SUM(v.total_venda) AS total
            FROM venda v
            JOIN produto p ON p.id = v.id_produto
            WHERE v.data_venda >= @Inicio
            GROUP BY p.id, p.nome
            ORDER BY qtd DESC
            LIMIT @Limite", conn);
        cmd.Parameters.AddWithValue("@Inicio", inicio);
        cmd.Parameters.AddWithValue("@Limite", limite);

        using var r = cmd.ExecuteReader();
        while (r.Read())
            lista.Add(new TopProduto
            {
                ProdutoId         = Convert.ToInt32(r["id"]),
                Nome              = r["nome"].ToString()!,
                QuantidadeVendida = Convert.ToInt32(r["qtd"]),
                Faturamento       = Convert.ToDecimal(r["total"])
            });
        return lista;
    }

    public List<ProdutoEstoqueBaixo> ObterEstoqueBaixo(int minimo)
    {
        var lista = new List<ProdutoEstoqueBaixo>();
        using var conn = new MySqlConnection(_cs);
        conn.Open();
        using var cmd = new MySqlCommand(@"
            SELECT id, nome, estoque FROM produto
            WHERE ativo = 1 AND estoque <= @Minimo
            ORDER BY estoque", conn);
        cmd.Parameters.AddWithValue("@Minimo", minimo);

        using var r = cmd.ExecuteReader();
        while (r.Read())
            lista.Add(new ProdutoEstoqueBaixo
            {
                Id      = Convert.ToInt32(r["id"]),
                Nome    = r["nome"].ToString()!,
                Estoque = Convert.ToInt32(r["estoque"])
            });
        return lista;
    }

    public List<UltimaVenda> ObterUltimasVendas(int limite)
    {
        var lista = new List<UltimaVenda>();
        using var conn = new MySqlConnection(_cs);
        conn.Open();
        using var cmd = new MySqlCommand(@"
            SELECT v.id, c.nome AS cliente, p.nome AS produto,
                   v.quantidade, v.total_venda, v.data_venda
            FROM venda v
            JOIN cliente c ON c.id = v.id_cliente
            JOIN produto p ON p.id = v.id_produto
            ORDER BY v.data_venda DESC
            LIMIT @Limite", conn);
        cmd.Parameters.AddWithValue("@Limite", limite);

        using var r = cmd.ExecuteReader();
        while (r.Read())
            lista.Add(new UltimaVenda
            {
                Id         = Convert.ToInt32(r["id"]),
                Cliente    = r["cliente"].ToString()!,
                Produto    = r["produto"].ToString()!,
                Quantidade = Convert.ToInt32(r["quantidade"]),
                ValorTotal = Convert.ToDecimal(r["total_venda"]),
                DataVenda  = Convert.ToDateTime(r["data_venda"])
            });
        return lista;
    }
} // fim da classe DashboardRepository

    // continua no próximo slide...