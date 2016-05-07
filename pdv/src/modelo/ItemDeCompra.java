package modelo;

import dto.ProdutoDTO;

public class ItemDeCompra {
	private Long id;
	private ProdutoDTO produto;
	private int quantidade;
	private double total;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public ProdutoDTO getProduto() {
		return produto;
	}
	public void setProduto(ProdutoDTO produto) {
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
	@Override
	public String toString() {
		return "ItemDeCompra [id=" + id + ", produto=" + produto + ", quantidade=" + quantidade + ", total=" + total
				+ "]";
	}
			
}
