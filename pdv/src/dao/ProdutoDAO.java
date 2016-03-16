package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import modelo.Produto;
import util.ConnectionFactory;

public class ProdutoDAO {

	public void incluir() {
		String sql = "insert into produto (codigo,descricao,valorcusto,valorvenda,estoque,virtual) values (?,?,?,?,?,?)";
		try (Connection conn = ConnectionFactory.obtemConexao(); PreparedStatement stm = conn.prepareStatement(sql)) {

			stm.execute();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void alterar() {
		String sql = "update produto set codigo=?,descricao=?,valorcusto=?,valorvenda=?,estoque=?,virtual=? where id=?";

		try (Connection conn = ConnectionFactory.obtemConexao(); PreparedStatement stm = conn.prepareStatement(sql)) {

			stm.execute();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void excluir() {
		String sql = "delete from produto where id=?";
		try (Connection conn = ConnectionFactory.obtemConexao(); PreparedStatement stm = conn.prepareStatement(sql)) {

			stm.execute();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public Produto getProdutoId(long id) {
		String sql = "select * from produto where id=?";
		Produto produto = new Produto();
		ResultSet result = null;

		try (Connection conn = ConnectionFactory.obtemConexao(); PreparedStatement stm = conn.prepareStatement(sql)) {
			stm.setLong(1, id);
			result = stm.executeQuery();

			result.next();

			produto.setId(result.getLong("id"));
			produto.setCodigo(result.getString("codigo"));
			produto.setDescricao(result.getString("descricao"));
			produto.setValorCusto(result.getDouble("valorcusto"));
			produto.setValorVenda(result.getDouble("valorvenda"));
			produto.setEstoque(result.getInt("estoque"));
			produto.setVirtual(result.getInt("virtual"));

		} catch (Exception e) {
			e.printStackTrace();
		}
		return produto;
	}

	public long getProduto(String codigo, String descricao) {
		ResultSet result = null;
		long id = 0;
		String sql = "select id from produto where codigo=? or descricao=?";

		try (Connection conn = ConnectionFactory.obtemConexao(); PreparedStatement stm = conn.prepareStatement(sql)) {
			stm.setString(1, codigo);
			stm.setString(2, descricao);
			result = stm.executeQuery();
			if (result.next()) {
				id = result.getLong("id");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return id;
	}

	public List<Produto> getListaProdutos(String busca) {
		ResultSet result = null;
		List<Produto> produtos = new ArrayList<Produto>();
		String sql = null;
		if (busca.isEmpty()) {
			sql = "select * from produto order by descricao";
		} else {
			sql = "select * from produto where descricao like ? or codigo like ? order by descricao";
		}
		try (Connection conn = ConnectionFactory.obtemConexao(); PreparedStatement stm = conn.prepareStatement(sql)) {
			if (!busca.isEmpty()) {
				stm.setString(1, "%" + busca + "%");
				stm.setString(2, "%" + busca + "%");
			}

			result = stm.executeQuery();

			while (result.next()) {
				Produto produto = new Produto();

				produto.setCodigo(result.getString("codigo"));
				produto.setDescricao(result.getString("descricao"));
				produto.setValorCusto(result.getDouble("valorcusto"));
				produto.setValorVenda(result.getDouble("valorvenda"));
				produto.setEstoque(result.getInt("estoque"));
				produto.setVirtual(result.getInt("virtual"));
				produto.setId(result.getInt("id"));
				produtos.add(produto);
			}
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}
		return produtos;
	}

	public long temProduto(long id) {
		String sql = "select count(*) as total from itemvenda where produto_id=?";
		ResultSet result = null;
		long total = 0;
		
		try (Connection conn = ConnectionFactory.obtemConexao(); PreparedStatement stm = conn.prepareStatement(sql)) {

			stm.setLong(1, id);
			result = stm.executeQuery();

			result.next();
			total = result.getInt("total");
			return total;
		} catch (SQLException e) {
			throw new RuntimeException(e);
		}
	}

}