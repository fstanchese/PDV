<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %><!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Cadastros</title>

    <link href="resources/css/bootstrap.min.css" rel="stylesheet">
    <link href="resources/css/style.css" rel="stylesheet">
</head>

<body>
    <!-- Barra superior com os menus de navegaÃ§Ã£o -->
	<c:import url="menuPrincipal.jsp"/>
    <!-- Container Principal -->
    <div id="main" class="container">
       <h3 class="page-header">Login</h3>
       <!-- Formulario de Login -->
        <form action="menuprincipal" method="post">
				<div class="row col-md-12">
				<div class="form-group">
					<div class="input-group col-md-4">
					   <div class="input-group-addon"><span class="glyphicon glyphicon-envelope" aria-hidden="true"></span></div> 
					   <input type="email" name="login" id="login" class="form-control" maxlength="60" placeholder="E-mail" required/>
					</div>
				</div>
				<div class="form-group">
					<div class="input-group col-md-4">
					   <div class="input-group-addon"><span class="glyphicon glyphicon-option-horizontal" aria-hidden="true"></span></div> 
					   <input type="password" name="senha" id="senha" class="form-control" placeholder="Senha" required/>
					</div>
				</div>
				</div>
				<div class="row col-md-12">
					<button type="submit" class="btn btn-primary" name="command" value="FazerLogin"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Ok</button>
				</div>
			</form>    
			</div>
    <script src="resources/js/jquery.min.js"></script>
    <script src="resources/js/bootstrap.min.js"></script>
</body>

</html>