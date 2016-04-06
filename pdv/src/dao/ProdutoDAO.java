package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import dto.ProdutoDTO;
import util.ConnectionFactory;

public class ProdutoDAO {

	public void incluir(ProdutoDTO dto) {
		String sql = "insert into produto (codigo,descricao,valorvenda) values (?,?,?)";
		try (Connection conn = ConnectionFactory.obtemConexao(); PreparedStatement stm = conn.prepareStatement(sql)) {
			stm.setString(1, dto.getCodigo());
			stm.setString(2, dto.getDescricao());
			stm.setDouble(3, dto.getValorvenda());
			stm.execute();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void alterar(ProdutoDTO dto) {
		String sql = "update produto set codigo=?,descricao=?,valorvenda=? where id=?";

		try (Connection conn = ConnectionFactory.obtemConexao(); PreparedStatement stm = conn.prepareStatement(sql)) {
			stm.setString(1, dto.getCodigo());
			stm.setString(2, dto.getDescricao());
			stm.setDouble(3, dto.getValorvenda());
			stm.setLong(4, dto.getId());
			stm.execute();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void excluir(ProdutoDTO dto) {
		String sql = "delete from produto where id=?";
		try (Connection conn = ConnectionFactory.obtemConexao(); PreparedStatement stm = conn.prepareStatement(sql)) {
			stm.setLong(1, dto.getId());
			stm.execute();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public ProdutoDTO carregar(Long id) {
		ProdutoDTO dto = new ProdutoDTO();
		String sqlSelect = "SELECT codigo, descricao,valorvenda FROM produto WHERE id = ?";
		try (Connection conn = ConnectionFactory.obtemConexao();
				PreparedStatement stm = conn.prepareStatement(sqlSelect);) {
			stm.setLong(1, id);
			try (ResultSet rs = stm.executeQuery();) {
				if (rs.next()) {
					dto.setId(id);
					dto.setCodigo(rs.getString("codigo"));
					dto.setDescricao(rs.getString("descricao"));
					dto.setValorvenda(rs.getDouble("valorvenda"));
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}
		} catch (SQLException e1) {
			System.out.print(e1.getStackTrace());
		}
		return dto;
	}
}