package dto;

public class ClienteDTO {
	private Long id;
	private String nome;
	private String fone;
	private String cpf;
	private String email;
	
	public ClienteDTO() {
	}
	
	public ClienteDTO(Long id, String nome, String fone, String cpf, String email) {
		this.id = id;
		this.nome = nome;
		this.fone = fone;
		this.cpf = cpf;
		this.email = email;
	}

	transient String acao;

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

	public void setAcao(String acao) {
		this.acao = acao;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getEmail() {
		return email;
	}
}
