package dao;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Vector;
import java.util.List;

public class ItemVendaDAO {

   public void incluir ( ItemVenda itemVenda ) { 
      String sql = "insert into itemvenda (venda_id,produto_id,quantidade,valorvenda) values (?,?,?,?)";
      
      Venda venda = itemVenda.getVenda();
      Produto produto = itemVenda.getProduto();
            
		Connection connection = null;
      PreparedStatement statement = null;
            
      try {
         ConnectionFactory bd = new ConnectionFactory();
         connection = bd.conectar();			      
         statement = connection.prepareStatement(sql);			
         statement.setLong(1,venda.getId());
         statement.setLong(2,produto.getId());
         statement.setInt(3,itemVenda.getQuantidade());
         statement.setDouble(4,itemVenda.getValorVenda());
         statement.execute();

      } catch (SQLException e1) {
         throw new RuntimeException(e1);
      } finally {
         if (statement != null) {
            try {            
               statement.close();
            } 
            catch (SQLException e1) {
               System.out.print(e1.getStackTrace());
            }
         }
         if (connection != null) {
            try {
               connection.close();
            } 
            catch (SQLException e1) {
               System.out.print(e1.getStackTrace());
            }
         }
      } 
   }

   public List<ItemVenda> getListaItemVenda( long idVenda ) {
      Connection connection = null;
      PreparedStatement statement = null;
      ResultSet result = null;
      List<ItemVenda> itemVendas = new ArrayList<ItemVenda>();
      ProdutoDAO daoProduto = new ProdutoDAO(); 
             
		try {
         ConnectionFactory bd = new ConnectionFactory();
         connection = bd.conectar();  
		   statement = connection.prepareStatement("select * from itemvenda where venda_id=? order by id"); 
         statement.setLong(1,idVenda);
			result = statement.executeQuery();
			
			while (result.next()) {
            ItemVenda itemVenda = new ItemVenda(); 
            Produto produto = daoProduto.getProdutoId( result.getLong("produto_id") );
            
			   itemVenda.setValorVenda(result.getDouble("valorvenda"));            
            itemVenda.setProduto(produto);
            itemVenda.setQuantidade(result.getInt("quantidade")); 
            itemVendas.add(itemVenda);				
         }
		} 
      catch (SQLException e) {
			throw new RuntimeException(e);
	   }
      finally {
         if (result != null) {
            try {            
               result.close();
            } 
            catch (SQLException e1) {
               System.out.print(e1.getStackTrace());
            }
         }         
         if (statement != null) {
            try {            
               statement.close();
            } 
            catch (SQLException e1) {
               System.out.print(e1.getStackTrace());
            }
         }
         if (connection != null) {
            try {
               connection.close();
            } 
            catch (SQLException e1) {
               System.out.print(e1.getStackTrace());
            }
         }
         
			return itemVendas;
      }
   }   
 }