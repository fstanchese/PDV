package modelo;

public class ItemDeCompra {
	private Long id;
	private Produto produto;
	private int quantidade;
	private double total;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Produto getProduto() {
		return produto;
	}
	public void setProduto(Produto produto) {
		this.produto = produto;
	}
	public int getQuantidade() {
		return quantidade;
	}
	public void setQuantidade(int quantidade) {
		this.quantidade = quantidade;
	}
	public double getTotal() {
		this.total = this.quantidade * this.produto.getValorvenda();
		return total;
	}
	public void setTotal(double total) {
		this.total = total;
	}
	
	
			
}
