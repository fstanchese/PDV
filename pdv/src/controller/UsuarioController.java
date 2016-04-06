package controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import dao.UsuarioDAO;

@WebServlet("/menuprincipal")
public class UsuarioController extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		UsuarioDAO dao = new UsuarioDAO();
		String pLogin = request.getParameter("login");
		String pSenha = request.getParameter("senha");	
		
		if (dao.existeUsuario(pLogin, pSenha)) {
			request.getRequestDispatcher("menuPrincipal.jsp").forward(request,response);
		} else {
			response.sendRedirect("formulario-login.jsp");
		}
	}
}
