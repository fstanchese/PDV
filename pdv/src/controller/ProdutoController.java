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

		String pAcao = request.getParameter("acao");
		String pAction = request.getParameter("action");
		String pCodigo = request.getParameter("codigo");
		String pDescricao = request.getParameter("descricao");
		String pId = request.getParameter("id");
		Long id = 0L;
		if (pId != null) {
			if (!pId.equals("")) {
				id = Long.parseLong(pId);
			}
		}

		Produto produto = new Produto(id, pCodigo, pDescricao);

		if ("Incluir".equals(pAction)) {
			produto.criar();
		} else if ("Alterar".equals(pAction)) {
			produto.alterar();
		} else if ("Excluir".equals(pAcao)) {
			produto.excluir();
		} else if ("Carregar".equals(pAcao)) {
			ProdutoDAO dao = new ProdutoDAO();
			ProdutoDTO dto = dao.carregar(id);
			dto.setAcao(pAcao);
			request.setAttribute("produto", dto);
		}
		if (!"Carregar".equals(pAcao)) {
			List<Produto> produtos = produto.listar();
			request.setAttribute("produtos", produtos);
		}
		RequestDispatcher rd = request.getRequestDispatcher("/produtos.jsp");
		rd.forward(request, response);
	}
}
