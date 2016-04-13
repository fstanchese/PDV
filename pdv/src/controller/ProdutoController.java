package controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import dao.ProdutoDAO;
import dto.ProdutoDTO;
import modelo.Produto;

@WebServlet("/produtos")
public class ProdutoController extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String acao = null;
		String mensagem = null;
		String pAcao = request.getParameter("acao");
		String pAction = request.getParameter("action");
		String pCodigo = request.getParameter("codigo");
		String pDescricao = request.getParameter("descricao");
		String pId = request.getParameter("id");
		String pValorVenda = request.getParameter("valorvenda");
		String pQtde = request.getParameter("qtde");
		String pBusca = request.getParameter("busca");
		
		Long id = 0L;
		if (pId != null) {
			if (!pId.equals("")) {
				id = Long.parseLong(pId);
			}
		}
		Double valorVenda = 0D;
		if (pValorVenda != null) {
			if (!pValorVenda.equals("")) {
				valorVenda = Double.parseDouble(pValorVenda);
			}
		}
		
		Integer qtde = 0;
		if (pQtde != null) {
			if (!pQtde.equals("")) {
				qtde = Integer.parseInt(pQtde);
			}
		}
		
		Produto produto = new Produto(id, pCodigo, pDescricao, valorVenda, qtde);

		if ("Incluir".equals(pAction)) {
			if (produto.criar()) {
				acao = "success";
				mensagem = "Produto cadastrado com sucesso";
			} else {
				acao = "danger";
				mensagem = "Erro no cadastro do produto";
			}
		} else if ("Alterar".equals(pAction)) {
			if (produto.alterar()) {
				acao = "success";
				mensagem = "Produto alterado com sucesso";
			} else {
				mensagem = "Erro na alteração do produto";
				acao = "danger";
			}
		} else if ("Excluir".equals(pAcao)) {
			if (produto.excluir()) {
				mensagem = "Produto excluído com sucesso";
				acao = "success";
			} else {
				mensagem = "Erro na exclusão do produto";
				acao = "danger";
			}
		} else if ("Carregar".equals(pAcao)) {
			ProdutoDAO dao = new ProdutoDAO();
			ProdutoDTO dto = dao.carregar(id);
			dto.setAcao(pAcao);
			request.setAttribute("produto", dto);
		}
		if ("Pesquisar".equals(pAction)) {
			List<ProdutoDTO> produtos = produto.listar(pBusca);
			request.setAttribute("produtos", produtos);
		} else if ("success".equals(acao)) {
			List<ProdutoDTO> produtos = produto.listarUltimoProdutoAcessado();
			request.setAttribute("produtos", produtos);
		}
		request.setAttribute("acao", acao);
		request.setAttribute("mensagem", mensagem);		
		RequestDispatcher rd = request.getRequestDispatcher("/produtos.jsp");
		rd.forward(request, response);
	}
}
