package controller;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import modelo.Produto;

@WebServlet("/vendas")
public class VendaController extends HttpServlet {
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
		} else if ("Excluir".equals(pAcao)) {
		} 
		RequestDispatcher rd = request.getRequestDispatcher("/vendas.jsp");
		rd.forward(request, response);
	}
}
