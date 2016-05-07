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

		String pQtde = request.getParameter("qtde");
		String pId = request.getParameter("id");
		String pAcao = request.getParameter("acao");
		
		Long idPropduto = 84L;
		if (pId != null) {
			if (!pId.equals("")) {
				idPropduto = Long.parseLong(pId);
			}
		}
		Integer qtde = 0;
		if (pQtde != null) {
			if (!pQtde.equals("")) {
				qtde = Integer.parseInt(pQtde);
			}
		}
		
		boolean existe = false;
		
		HttpSession sessao = request.getSession();
		CarrinhoDeCompra carrinho = (CarrinhoDeCompra) sessao.getAttribute("carrinho");
		ProdutoDTO produto = new ProdutoDAO().carregar(idPropduto);

		// verifica se já exista um carrinho na sessao
		if (carrinho == null) {
			// cria um carrinho
			carrinho = new CarrinhoDeCompra();
			sessao.setAttribute("carrinho", carrinho);
			request.setAttribute("carrinho", carrinho);
		}

		if ("Incluir".equals(pAcao)) {
	
			// verifica se o produto existe no carrinho
			if (carrinho.getItens() != null) {
				for (ItemDeCompra item : carrinho.getItens()) {
					if (item.getProduto().getId() == idPropduto) {
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
			System.out.println(carrinho.getItens().toString());
			request.setAttribute("carrinho", carrinho);
		}
		if ("Excluir".equals(pAcao)) {
			ItemDeCompra itemRemove = new ItemDeCompra();
			itemRemove.setProduto(produto);
			carrinho.removerItem(itemRemove);
			request.setAttribute("carrinho", carrinho);
		}
		
		sessao.setAttribute("carrinho", carrinho);
		RequestDispatcher rd = request.getRequestDispatcher("/vendas.jsp");
		rd.forward(request, response);
	}
}
