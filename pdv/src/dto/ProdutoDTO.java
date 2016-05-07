package dto;

public class ProdutoDTO {
	private Long id;
	private String codigo;
	private String descricao;
	private Double valorvenda;
	private Integer qtde;
	transient String acao;
	
	public ProdutoDTO() {
	}

	public ProdutoDTO(Long id, String codigo, String descricao, Double valorvenda, Integer qtde) {
		this.id = id;
		this.codigo = codigo;
		this.descricao = descricao;
		this.valorvenda = valorvenda;
		this.qtde = qtde;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCodigo() {
		return codigo;
	}

	public void setCodigo(String codigo) {
		this.codigo = codigo;
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	public String getAcao() {
		return acao;
	}

	public void setAcao(String acao) {
		this.acao = acao;
	}
	
	public void setValorvenda(Double valorvenda) {
		this.valorvenda = valorvenda;
	}
	
	public Double getValorvenda() {
		return valorvenda;
	}
	
	public void setQtde(Integer qtde) {
		this.qtde = qtde;
	}
	
	public Integer getQtde() {
		return qtde;
	}

	@Override
	public String toString() {
		return "ProdutoDTO [id=" + id + ", codigo=" + codigo + ", descricao=" + descricao + ", valorvenda=" + valorvenda
				+ ", qtde=" + qtde + "]";
	}
	
}

