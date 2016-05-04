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
	private Integer qtde;
	transient String acao;

	public Produto() {}
	
	public Produto(Long id, String codigo, String descricao, Double valorvenda, Integer qtde) {
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
	
	public String getAcao() {
		return acao;
	}

	public void setAcao(String acao) {
		this.acao = acao;
	}
	
	public boolean criar() {
		ProdutoDAO dao = new ProdutoDAO();
		ProdutoDTO dto = new ProdutoDTO();
		dto.setCodigo(codigo);
		dto.setDescricao(descricao);
		dto.setValorvenda(valorvenda);
		dto.setQtde(qtde);
		dto.setAcao(acao);
		boolean ret = dao.incluir(dto);
		this.id = dto.getId();
		return ret;
	}
	
	public boolean alterar() {
		ProdutoDAO dao = new ProdutoDAO();
		ProdutoDTO dto = new ProdutoDTO();
		dto.setId(id);
		dto.setCodigo(codigo);
		dto.setDescricao(descricao);
		dto.setValorvenda(valorvenda);
		dto.setQtde(qtde);
		dto.setAcao(acao);
		return dao.alterar(dto);		
	}
	
	public boolean excluir() {
		ProdutoDAO dao = new ProdutoDAO();
		ProdutoDTO dto = new ProdutoDTO();
		dto.setId(id);
		return dao.excluir(dto);		
	}
	
	public List<ProdutoDTO> listar(String busca) {
		List<ProdutoDTO> produtos = new ArrayList<>();
		String sqlSelect = null;
        if (busca.isEmpty()) {
        	sqlSelect = "SELECT * FROM produto order by descricao";
        }
		else {
        	sqlSelect = "SELECT * FROM produto where descricao like ? order by descricao";		
		}		
		try (Connection conn = ConnectionFactory.obtemConexao();
				PreparedStatement stm = conn.prepareStatement(sqlSelect);) {
	        if (!busca.isEmpty()) {
	        	stm.setString(1, "%"+busca+"%");
	        }			
	        try (ResultSet rs = stm.executeQuery();) {
				while (rs.next()) {
					Long pId = rs.getLong("id");
					String pCodigo = rs.getString("codigo");
					String pDescricao = rs.getString("descricao");
					Double pValorVenda = rs.getDouble("valorvenda");
					Integer pQtde = rs.getInt("qtde");
					ProdutoDTO produto = new ProdutoDTO(pId, pCodigo, pDescricao, pValorVenda, pQtde);
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

	public List<ProdutoDTO> listarUltimoProdutoAcessado() {
		List<ProdutoDTO> produtos = new ArrayList<>();
		String sqlSelect = "SELECT id, codigo, descricao, valorvenda, qtde FROM produto where id=?";
		try (Connection conn = ConnectionFactory.obtemConexao();
				PreparedStatement stm = conn.prepareStatement(sqlSelect);) {
			stm.setLong(1, this.id);
			try (ResultSet rs = stm.executeQuery();) {
				if (rs.next()) {
					Long pId = rs.getLong("id");
					String pCodigo = rs.getString("codigo");
					String pDescricao = rs.getString("descricao");
					Double pValorVenda = rs.getDouble("valorvenda");
					Integer pQtde = rs.getInt("qtde");
					ProdutoDTO produto = new ProdutoDTO(pId, pCodigo, pDescricao, pValorVenda, pQtde);
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
		return "Produto [id=" + id + ", codigo=" + codigo + ", descricao=" + descricao + ", valorvenda=" + valorvenda
				+ ", qtde=" + qtde + "]";
	}
}
