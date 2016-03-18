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

	public Cliente(Long id, String nome, String fone, String cpf) {
		super();
		this.id = id;
		this.nome = nome;
		this.fone = fone;
		this.cpf = cpf;
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

	public void criar() {
		ClienteDAO dao = new ClienteDAO();
		ClienteDTO dto = new ClienteDTO();
		dto.setNome(nome);
		dto.setFone(fone);
		dto.setCpf(cpf);
		dao.incluir(dto);
	}
	
	public void alterar() {
		ClienteDAO dao = new ClienteDAO();
		ClienteDTO dto = new ClienteDTO();
		dto.setId(id);
		dto.setNome(nome);
		dto.setFone(fone);
		dto.setCpf(cpf);
		dao.alterar(dto);		
	}
	
	public void excluir() {
		ClienteDAO dao = new ClienteDAO();
		ClienteDTO dto = new ClienteDTO();
		dto.setId(id);
		dao.excluir(dto);		
	}
	
	public void carregar() {
		ClienteDAO dao = new ClienteDAO();
		ClienteDTO dto = dao.carregar(id);
		nome = dto.getNome();
		fone = dto.getFone();
	}

	public List<Cliente> listar() {
		List<Cliente> clientes = new ArrayList<>();
		String sqlSelect = "SELECT id, nome, fone, cpf FROM cliente order by nome";
		try (Connection conn = ConnectionFactory.obtemConexao();
				PreparedStatement stm = conn.prepareStatement(sqlSelect);) {
			try (ResultSet rs = stm.executeQuery();) {
				while (rs.next()) {
					Long id = rs.getLong("id");
					String nome = rs.getString("nome");
					String fone = rs.getString("fone");
					String cpf = rs.getString("cpf");
					Cliente cliente = new Cliente(id,nome,fone,cpf);
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
		return "Cliente [id=" + id + ", nome=" + nome + ", fone=" + fone + ", cpf=" + cpf + "]";
	}
}
