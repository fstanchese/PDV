package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import dto.ProdutoDTO;
import util.ConnectionFactory;

public class ProdutoDAO {

	public boolean incluir(ProdutoDTO dto) {
		String sql = "insert into produto (codigo,descricao,valorvenda,qtde) values (?,?,?,?)";
		try (Connection conn = ConnectionFactory.obtemConexao(); PreparedStatement stm = conn.prepareStatement(sql,PreparedStatement.RETURN_GENERATED_KEYS)) {
			stm.setString(1, dto.getCodigo());
			stm.setString(2, dto.getDescricao());
			stm.setDouble(3, dto.getValorvenda());
			stm.setInt(4, dto.getQtde());
			stm.execute();
			ResultSet generatedKeys = stm.getGeneratedKeys();
	        if (generatedKeys.next()) {
	        	dto.setId(generatedKeys.getLong(1));
	        }
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public boolean alterar(ProdutoDTO dto) {
		String sql = "update produto set codigo=?,descricao=?,valorvenda=?,qtde=? where id=?";

		try (Connection conn = ConnectionFactory.obtemConexao(); PreparedStatement stm = conn.prepareStatement(sql)) {
			stm.setString(1, dto.getCodigo());
			stm.setString(2, dto.getDescricao());
			stm.setDouble(3, dto.getValorvenda());
			stm.setInt(4, dto.getQtde());
			stm.setLong(5, dto.getId());
			stm.execute();
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public boolean excluir(ProdutoDTO dto) {
		String sql = "delete from produto where id=?";
		try (Connection conn = ConnectionFactory.obtemConexao(); PreparedStatement stm = conn.prepareStatement(sql)) {
			stm.setLong(1, dto.getId());
			stm.execute();
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public ProdutoDTO carregar(Long id) {
		ProdutoDTO dto = new ProdutoDTO();
		String sqlSelect = "SELECT codigo, descricao, valorvenda, qtde FROM produto WHERE id = ?";
		try (Connection conn = ConnectionFactory.obtemConexao();
				PreparedStatement stm = conn.prepareStatement(sqlSelect);) {
			stm.setLong(1, id);
			try (ResultSet rs = stm.executeQuery();) {
				if (rs.next()) {
					dto.setId(id);
					dto.setCodigo(rs.getString("codigo"));
					dto.setDescricao(rs.getString("descricao"));
					dto.setValorvenda(rs.getDouble("valorvenda"));
					dto.setQtde(rs.getInt("qtde"));
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}
		} catch (SQLException e1) {
			System.out.print(e1.getStackTrace());
		}
		return dto;
	}
	
	public long carregar(String codigo) {
		String sqlSelect = "SELECT id FROM produto WHERE codigo = ?";
		long id = 0;
		try (Connection conn = ConnectionFactory.obtemConexao();
				PreparedStatement stm = conn.prepareStatement(sqlSelect);) {
			stm.setString(1, codigo);
			try (ResultSet rs = stm.executeQuery();) {
				if (rs.next()) {
					id = rs.getLong("id");
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}
		} catch (SQLException e1) {
			System.out.print(e1.getStackTrace());
		}
		return id;
	}
}