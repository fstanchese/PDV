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
import dto.ProdutoDTO;
import modelo.CarrinhoDeCompra;
import modelo.ItemDeCompra;

@WebServlet("/vendas")
public class CarrinhoController extends HttpServlet {

	private static final long serialVersionUID = 1L;

	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String pId = request.getParameter("id");
		String pQtde = request.getParameter("qtde");
		String pAcao = request.getParameter("acao");
		String pCodigo = request.getParameter("codigo");

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

		// verifica se já exista um carrinho na sessao
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

		ProdutoDTO produto = new ProdutoDAO().carregar(idProduto);

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

			// se não existe o item ou produto, cria um novo
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
			System.out.println("Produto "+produto.toString());
			ItemDeCompra itemRemove = new ItemDeCompra();
			itemRemove.setProduto(produto);
			carrinho.removerItem(itemRemove);
		}
		
		request.setAttribute("carrinho", carrinho);
		sessao.setAttribute("carrinho", carrinho);
		RequestDispatcher rd = request.getRequestDispatcher("/vendas.jsp");
		rd.forward(request, response);
	}
}
