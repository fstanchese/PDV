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

@SuppressWarnings("serial")
@WebServlet("/clientes")
public class ClienteController extends HttpServlet {
	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String acao = request.getParameter("acao");
		String action = request.getParameter("action");
		String nome = request.getParameter("nome");
		String cpf = request.getParameter("cpf");
		String fone = request.getParameter("fone");
		String pId = request.getParameter("id");
		Long id = 0L;
		if (pId != null) {
			if (!pId.equals("")) {
				id = Long.parseLong(pId);
			}
		}

		Cliente cliente = new Cliente(id, nome, fone, cpf);

		if ("Incluir".equals(action)) {
			cliente.criar();
		} else if ("Alterar".equals(action)) {
			cliente.alterar();
		} else if ("Excluir".equals(acao)) {
			cliente.excluir();
		} else if ("Carregar".equals(acao)) {
			ClienteDAO dao = new ClienteDAO();
			ClienteDTO dto = dao.carregar(id);
			request.setAttribute("cliente", dto);
		}

		List<Cliente> clientes = cliente.listar();

		request.setAttribute("clientes", clientes);
		RequestDispatcher rd = request.getRequestDispatcher("/clientes.jsp");
		rd.forward(request, response);
	}
}
