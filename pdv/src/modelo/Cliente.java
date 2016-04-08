package modelo;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import dao.ClienteDAO;
import dto.ClienteDTO;
import util.ConnectionFactory;

public class Cliente {
	private Long id;
	private String nome;
	private String fone;
	private String cpf;
	private String email;
	transient String acao;

	public Cliente(Long id, String nome, String fone, String cpf, String email) {
		this.id = id;
		this.nome = nome;
		this.fone = fone;
		this.cpf = cpf;
		this.email = email;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getFone() {
		return fone;
	}

	public void setFone(String fone) {
		this.fone = fone;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public String getAcao() {
		return acao;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getEmail() {
		return email;
	}

	public void setAcao(String acao) {
		this.acao = acao;
	}

	public boolean criar() {
		ClienteDAO dao = new ClienteDAO();
		ClienteDTO dto = new ClienteDTO();
		dto.setNome(nome);
		dto.setFone(fone);
		dto.setCpf(cpf);
		dto.setEmail(email);
		boolean ret = dao.incluir(dto);
		this.id = dto.getId();
		return ret;
	}

	public boolean alterar() {
		ClienteDAO dao = new ClienteDAO();
		ClienteDTO dto = new ClienteDTO();
		dto.setId(id);
		dto.setNome(nome);
		dto.setFone(fone);
		dto.setCpf(cpf);
		dto.setEmail(email);
		return dao.alterar(dto);
	}

	public boolean excluir() {
		ClienteDAO dao = new ClienteDAO();
		ClienteDTO dto = new ClienteDTO();
		dto.setId(id);
		return dao.excluir(dto);
	}

	public List<ClienteDTO> listar(String busca) {
		List<ClienteDTO> clientes = new ArrayList<>();
		String sqlSelect = null;
        if (busca.isEmpty()) {
        	sqlSelect = "SELECT id, nome, fone, cpf,email FROM cliente order by nome";
        }
		else {
        	sqlSelect = "SELECT id, nome, fone, cpf,email FROM cliente where nome like ? order by nome";		
		}
		try (Connection conn = ConnectionFactory.obtemConexao();
			PreparedStatement stm = conn.prepareStatement(sqlSelect);) {
	        if (!busca.isEmpty()) {
	        	stm.setString(1, "%"+busca+"%");
	        }
			try (ResultSet rs = stm.executeQuery();) {
				while (rs.next()) {
					Long id = rs.getLong("id");
					String nome = rs.getString("nome");
					String fone = rs.getString("fone");
					String cpf = rs.getString("cpf");
					String email = rs.getString("email");
					ClienteDTO cliente = new ClienteDTO(id, nome, fone, cpf, email );
					clientes.add(cliente);
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}
		} catch (SQLException e1) {
			System.out.print(e1.getStackTrace());
		}
		return clientes;
	}

	public List<ClienteDTO> listarUltimoClienteAcessado() {
		List<ClienteDTO> clientes = new ArrayList<>();
		String sqlSelect = "SELECT id, nome, fone, cpf,email FROM cliente where id=?";		
		try (Connection conn = ConnectionFactory.obtemConexao();
			PreparedStatement stm = conn.prepareStatement(sqlSelect);) {
	       	stm.setLong(1, this.id);
			try (ResultSet rs = stm.executeQuery();) {
				if (rs.next()) {
					String nome = rs.getString("nome");
					String fone = rs.getString("fone");
					String cpf = rs.getString("cpf");
					String email = rs.getString("email");
					ClienteDTO cliente = new ClienteDTO(id, nome, fone, cpf, email );
					clientes.add(cliente);
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}
		} catch (SQLException e1) {
			System.out.print(e1.getStackTrace());
		}
		return clientes;
	}
	
	@Override
	public String toString() {
		return "Cliente [id=" + id + ", nome=" + nome + ", fone=" + fone + ", cpf=" + cpf + ", email=" + email + "]";
	}

}
