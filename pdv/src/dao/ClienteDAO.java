package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import factory.ConnectionFactory;
import service.ClienteService;

public class ClienteDAO {

	public boolean incluir(ClienteService dto) {
		String sql = "INSERT INTO cliente( nome, fone, cpf, email ) VALUES (?, ?, ?, ?)";

		try (Connection conn = ConnectionFactory.obtemConexao(); PreparedStatement stm = conn.prepareStatement(sql,PreparedStatement.RETURN_GENERATED_KEYS);) {
			stm.setString(1, dto.getNome());
			stm.setString(2, dto.getFone());
			stm.setString(3, dto.getCpf());
			stm.setString(4, dto.getEmail());
			stm.execute();
			ResultSet generatedKeys = stm.getGeneratedKeys();
	        if (generatedKeys.next()) {
	        	dto.setId(generatedKeys.getLong(1));
	        }
	        return true;
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
	}

	public boolean alterar(ClienteService dto) {
		String sql = "UPDATE cliente SET nome=? , fone=?, cpf=?, email=? WHERE id=?";

		try (Connection conn = ConnectionFactory.obtemConexao(); PreparedStatement stm = conn.prepareStatement(sql);) {
			stm.setString(1, dto.getNome());
			stm.setString(2, dto.getFone());
			stm.setString(3, dto.getCpf());
			stm.setString(4, dto.getEmail());
			stm.setLong(5, dto.getId());
			stm.execute();
			return true;
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
	}

	public boolean excluir(ClienteService dto) {
		String sql = "DELETE FROM cliente WHERE id=?";

		try (Connection conn = ConnectionFactory.obtemConexao(); PreparedStatement stm = conn.prepareStatement(sql);) {
			stm.setLong(1, dto.getId());
			stm.execute();
			return true;
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
	}

	public ClienteService carregar(Long id) {
		ClienteService dto = new ClienteService();
		String sqlSelect = "SELECT nome, fone, cpf, email FROM cliente WHERE cliente.id = ?";
		try (Connection conn = ConnectionFactory.obtemConexao();
			PreparedStatement stm = conn.prepareStatement(sqlSelect);) {
			stm.setLong(1, id);
			try (ResultSet rs = stm.executeQuery();) {
				if (rs.next()) {
					dto.setId(id);
					dto.setNome(rs.getString("nome"));
					dto.setFone(rs.getString("fone"));
					dto.setCpf(rs.getString("cpf"));
					dto.setEmail(rs.getString("email"));
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
