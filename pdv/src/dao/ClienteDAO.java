package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import modelo.Cliente;
import util.ConnectionFactory;

public class ClienteDAO {

	public void salvar(Cliente cliente) {
		String sqlInsert = "INSERT INTO cliente( nome, fone, cpf ) VALUES (?, ?, ?)";
		
		try (Connection conn = ConnectionFactory.obtemConexao();
			PreparedStatement stm = conn.prepareStatement(sqlInsert);) {
			stm.setString(1, cliente.getNome());
			stm.setString(2, cliente.getFone());
			stm.setString(3, cliente.getCpf());
			stm.execute();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	public void alterar(Cliente cliente) {

	}

	public void excluir(Cliente cliente) {

	}
}
