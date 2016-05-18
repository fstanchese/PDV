package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import factory.ConnectionFactory;
import model.Venda;

public class VendaDAO {

	public long incluir(Venda venda) {
		String sql = "insert into venda (cpf,datavenda) values (?,?)";
		long id = 0;
		ResultSet result = null;

		try (Connection conn = ConnectionFactory.obtemConexao();
				PreparedStatement stm = conn.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS)) {
			stm.setString(1, venda.getCpf());
			stm.setDate(2, java.sql.Date.valueOf(java.time.LocalDate.now()));
			stm.execute();
			result = stm.getGeneratedKeys();
			if (result.next()) {
				id = result.getLong(1);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return id;
	}
}