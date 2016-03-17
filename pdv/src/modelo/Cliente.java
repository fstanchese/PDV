package modelo;

import dao.ClienteDAO;
import dto.ClienteDTO;

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
		dto.setId(id);
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
}
