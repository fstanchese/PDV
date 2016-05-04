package modelo;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class CarrinhoDeCompras {

	private Long id;
	private List<ItemDeCompra> itens;
	private double total;
	
	public void addNovoItem(ItemDeCompra item) {
		if(this.itens==null){
			this.itens = new ArrayList<ItemDeCompra>();
		}
		this.itens.add(item);
	}
	
	public void removerItem(ItemDeCompra itemRemove){
		for(Iterator<ItemDeCompra> i = itens.iterator(); i.hasNext();) {
			ItemDeCompra item = (ItemDeCompra) i.next();
			if(item.getProduto().getId()== itemRemove.getProduto().getId()) {
				i.remove();
			}
		}
	}
	
	public double valorTotal() {
		double vtotal = 0;
		for(ItemDeCompra item : itens) {
			vtotal += item.getTotal();
		}
		this.total = vtotal;
		return total;
	}
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public List<ItemDeCompra> getItens() {
		return itens;
	}
	public void setItens(List<ItemDeCompra> itens) {
		this.itens = itens;
	}
	public double getTotal() {
		return total;
	}
	public void setTotal(double total) {
		this.total = total;
	}
	
	
}
