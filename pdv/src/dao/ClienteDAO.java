package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import dto.ClienteDTO;
import util.ConnectionFactory;

public class ClienteDAO {

	public void incluir(ClienteDTO dto) {
		String sql = "INSERT INTO cliente( nome, fone, cpf ) VALUES (?, ?, ?)";

		try (Connection conn = ConnectionFactory.obtemConexao(); PreparedStatement stm = conn.prepareStatement(sql);) {
			stm.setString(1, dto.getNome());
			stm.setString(2, dto.getFone());
			stm.setString(3, dto.getCpf());
			stm.execute();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public void alterar(ClienteDTO dto) {
		String sql = "UPDATE cliente SET nome=? , fone=?, cpf=? WHERE id=?";

		try (Connection conn = ConnectionFactory.obtemConexao(); PreparedStatement stm = conn.prepareStatement(sql);) {
			stm.setString(1, dto.getNome());
			stm.setString(2, dto.getFone());
			stm.setString(3, dto.getCpf());
			stm.setLong(4, dto.getId());
			stm.execute();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public void excluir(ClienteDTO dto) {
		String sql = "DELETE FROM cliente WHERE id=?";

		try (Connection conn = ConnectionFactory.obtemConexao(); PreparedStatement stm = conn.prepareStatement(sql);) {
			stm.setLong(1, dto.getId());
			stm.execute();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public ClienteDTO carregar(Long id) {
		ClienteDTO dto = new ClienteDTO();
		String sqlSelect = "SELECT nome, fone, cpf FROM cliente WHERE cliente.id = ?";
		try (Connection conn = ConnectionFactory.obtemConexao();
				PreparedStatement stm = conn.prepareStatement(sqlSelect);) {
			stm.setLong(1, id);
			try (ResultSet rs = stm.executeQuery();) {
				if (rs.next()) {
					dto.setId(id);
					dto.setNome(rs.getString("nome"));
					dto.setFone(rs.getString("fone"));
					dto.setCpf(rs.getString("cpf"));
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
