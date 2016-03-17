package dao;
import java.util.List;

import modelo.ItemVenda;

public class ItemVendaDAO {

   public void incluir ( ItemVenda itemVenda ) { 
      String sql = "insert into itemvenda (venda_id,produto_id,quantidade,valorvenda) values (?,?,?,?)";
      
   }

   public List<ItemVenda> getListaItemVenda( long idVenda ) {
	return null;

   }   
 }