package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import util.ConnectionFactory;

public class UsuarioDAO {

	public boolean existeUsuario(String pLogin, String pSenha) {
		String sql = "select * from usuario where login=? and senha=?";
		boolean ret = false;
		try (Connection conn = ConnectionFactory.obtemConexao(); PreparedStatement stm = conn.prepareStatement(sql);) {
			stm.setString(1, pLogin);
			stm.setString(2, pSenha);
			try (ResultSet rs = stm.executeQuery();) {
				ret = rs.next();
			} catch (SQLException e) {
				e.printStackTrace();
			}		
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ret;
	}
	
	
}
