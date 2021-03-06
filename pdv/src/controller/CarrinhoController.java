package controller;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import dao.ProdutoDAO;
import model.CarrinhoDeCompra;
import model.ItemDeCompra;
import service.ProdutoService;

@WebServlet("/vendas")
public class CarrinhoController extends HttpServlet {

	private static final long serialVersionUID = 1L;

	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String pId = request.getParameter("id");
		String pQtde = request.getParameter("qtde");
		String pAcao = request.getParameter("acao");
		String pCodigo = request.getParameter("codigo");
		String pCPF = request.getParameter("cpf");

		HttpSession sessao = request.getSession();
		CarrinhoDeCompra carrinho = (CarrinhoDeCompra) sessao.getAttribute("carrinho");
		
		long idProduto = 0;
		if (pId != null) {
			if (!pId.equals("")) {
				idProduto = Integer.parseInt(pId);
			}
		}
		Integer qtde = 1;
		if (pQtde != null) {
			if (!pQtde.equals("")) {
				qtde = Integer.parseInt(pQtde);
			}
		}

		// verifica se j� exista um carrinho na sessao
		if (carrinho == null) {
			// cria um carrinho
			carrinho = new CarrinhoDeCompra();
			sessao.setAttribute("carrinho", carrinho);
			request.setAttribute("carrinho", carrinho);
		}

		if (pCodigo != null && !pCodigo.isEmpty()) {
			idProduto = new ProdutoDAO().carregar(pCodigo);
		}
		
		boolean existe = false;

		ProdutoService produto = new ProdutoDAO().carregar(idProduto);

		if ("Incluir".equals(pAcao) && idProduto > 0) {

			// verifica se o produto existe no carrinho
			if (carrinho.getItens() != null) {
				for (ItemDeCompra item : carrinho.getItens()) {
					if (item.getProduto().getId() == idProduto) {
						// incrementa a quantidade
						item.setQuantidade(item.getQuantidade() + qtde);
						existe = true;
					}
				}
			}

			// se n�o existe o item ou produto, cria um novo
			if (existe == false) {

				// cria um novo item
				ItemDeCompra novoItem = new ItemDeCompra();
				novoItem.setProduto(produto);
				novoItem.setQuantidade(qtde);
				// adiciona novo item
				carrinho.addNovoItem(novoItem);
			}
		}
		
		if ("Excluir".equals(pAcao)) {
			ItemDeCompra itemRemove = new ItemDeCompra();
			itemRemove.setProduto(produto);
			carrinho.removerItem(itemRemove);
		}
		request.setAttribute("total", null);
		if (carrinho.getSize() > 0) {
			request.setAttribute("total", carrinho.getTotal());
		}
		request.setAttribute("carrinho", carrinho);
		request.setAttribute("cpf", pCPF);
		sessao.setAttribute("carrinho", carrinho);
		sessao.setAttribute("cpf", pCPF);
		RequestDispatcher rd = request.getRequestDispatcher("/vendas.jsp");
		rd.forward(request, response);
	}
}
