package model;

import service.ProdutoService;

public class ItemDeCompra {
	private Long id;
	private ProdutoService produto;
	private int quantidade;
	private double total;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public ProdutoService getProduto() {
		return produto;
	}
	public void setProduto(ProdutoService produto) {
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
		return this.total;
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
