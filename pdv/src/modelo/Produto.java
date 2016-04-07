package modelo;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import dao.ProdutoDAO;
import dto.ProdutoDTO;
import util.ConnectionFactory;

public class Produto {
	private Long id;
	private String codigo;
	private String descricao;
	private Double valorvenda;
	transient String acao;

	public Produto(Long id, String codigo, String descricao, Double valorvenda) {
		this.id = id;
		this.codigo = codigo;
		this.descricao = descricao;
		this.valorvenda = valorvenda;
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
	
	public void setValorvenda(Double valorvenda) {
		this.valorvenda = valorvenda;
	}
	
	public Double getValorvenda() {
		return valorvenda;
	}
	
	public String getAcao() {
		return acao;
	}

	public void setAcao(String acao) {
		this.acao = acao;
	}
	
	public void criar() {
		ProdutoDAO dao = new ProdutoDAO();
		ProdutoDTO dto = new ProdutoDTO();
		dto.setCodigo(codigo);
		dto.setDescricao(descricao);
		dto.setValorvenda(valorvenda);
		dto.setAcao(acao);
		dao.incluir(dto);
	}
	
	public void alterar() {
		ProdutoDAO dao = new ProdutoDAO();
		ProdutoDTO dto = new ProdutoDTO();
		dto.setId(id);
		dto.setCodigo(codigo);
		dto.setDescricao(descricao);
		dto.setValorvenda(valorvenda);
		dto.setAcao(acao);
		dao.alterar(dto);		
	}
	
	public void excluir() {
		ProdutoDAO dao = new ProdutoDAO();
		ProdutoDTO dto = new ProdutoDTO();
		dto.setId(id);
		dao.excluir(dto);		
	}
	
	public void carregar() {
		ProdutoDAO dao = new ProdutoDAO();
		ProdutoDTO dto = dao.carregar(id);
		codigo = dto.getCodigo();
		descricao = dto.getDescricao();
	}

	public List<Produto> listar() {
		List<Produto> produtos = new ArrayList<>();
		String sqlSelect = "SELECT id, codigo, descricao, valorvenda FROM produto order by descricao";
		try (Connection conn = ConnectionFactory.obtemConexao();
				PreparedStatement stm = conn.prepareStatement(sqlSelect);) {
			try (ResultSet rs = stm.executeQuery();) {
				while (rs.next()) {
					Long pId = rs.getLong("id");
					String pCodigo = rs.getString("codigo");
					String pDescricao = rs.getString("descricao");
					Double pValorVenda = rs.getDouble("valorvenda");
					Produto produto = new Produto(pId, pCodigo, pDescricao, pValorVenda);
					produtos.add(produto);
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}
		} catch (SQLException e1) {
			System.out.print(e1.getStackTrace());
		}
		return produtos;		
	}

	@Override
	public String toString() {
		return "Produto [id=" + id + ", codigo=" + codigo + ", descricao=" + descricao + "]";
	}

}
