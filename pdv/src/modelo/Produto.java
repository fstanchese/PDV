package modelo;
public class Produto {
	private long id;
	private String codigo;
	private String descricao;
	private double valorCusto;
	private double valorVenda;
	private int estoque;
   private int virtual;

	public long getId() {
		return id;
	}
	public void setId(long id) {
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
	public double getValorCusto() {
		return valorCusto;
	}
	public void setValorCusto(double valorCusto) {
		this.valorCusto = valorCusto;
	}
	public double getValorVenda() {
		return valorVenda;
	}
	public void setValorVenda(double valorVenda) {
		this.valorVenda = valorVenda;
	}
	public int getEstoque() {
		return estoque;
	}
	public void setEstoque(int estoque) {
		this.estoque = estoque;
	}
  	public int getVirtual() {
		return virtual;
	}
	public void setVirtual(int virtual) {
		this.virtual = virtual;
	} 
	public String toString() {
		return "C�digo=" + codigo + "\nDescri��o=" + descricao + "\nValorCusto=R$" + valorCusto + "\nValorVenda=R$"
				+ valorVenda + "\nEstoque=" + estoque;
	}   
}
