package controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import dao.ClienteDAO;
import dto.ClienteDTO;
import modelo.Cliente;

@WebServlet("/clientes")
public class ClienteController extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String acao = null;
		String mensagem = null;
		String pAcao = request.getParameter("acao");
		String pAction = request.getParameter("action");
		String pNome = request.getParameter("nome");
		String pCpf = request.getParameter("cpf");
		String pFone = request.getParameter("fone");
		String pEmail = request.getParameter("email");
		String pBusca = request.getParameter("busca");
		String pId = request.getParameter("id");
		Long id = 0L;
		if (pId != null) {
			if (!pId.equals("")) {
				id = Long.parseLong(pId);
			}
		}
		
		Cliente cliente = new Cliente(id, pNome, pFone, pCpf, pEmail);

		if ("Incluir".equals(pAction)) {
			if (cliente.criar()) {
				acao = "success";
				mensagem = "Cliente cadastrado com sucesso";
			} else {
				acao = "danger";
				mensagem = "Erro no cadastro do cliente";
			}
		} else if ("Alterar".equals(pAction)) {
			if (cliente.alterar() && id > 0) {
				acao = "success";
				mensagem = "Cliente alterado com sucesso";
			} else {
				mensagem = "Erro na alteração do cliente";
				acao = "danger";
			}
		} else if ("Excluir".equals(pAcao)) {
			if (cliente.excluir() && id > 0) {
				mensagem = "Cliente excluído com sucesso";
				acao = "success";
			} else {
				mensagem = "Erro na exclusão do cliente";
				acao = "danger";
			}
		} else if ("Carregar".equals(pAcao)) {
			ClienteDAO dao = new ClienteDAO();
			ClienteDTO dto = dao.carregar(id);
			dto.setAcao(pAcao);
			request.setAttribute("cliente", dto);
		}
		if ("Pesquisar".equals(pAction)) {
			List<ClienteDTO> clientes = cliente.listar(pBusca);
			request.setAttribute("clientes", clientes);
		} else if ("success".equals(acao)){
			List<ClienteDTO> clientes = cliente.listarUltimoClienteAcessado();
			request.setAttribute("clientes", clientes);		
		}
		request.setAttribute("acao", acao);
		request.setAttribute("mensagem", mensagem);
		RequestDispatcher rd = request.getRequestDispatcher("/clientes.jsp");
		rd.forward(request, response);
	}
}
