<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<html>
<head>
<link href="resources/css/bootstrap.min.css" rel="stylesheet"
	type="text/css" />
<link href="resources/css/bootstrap-theme.min.css" rel="stylesheet"
	type="text/css" />
<link href="resources/css/custom.css" rel="stylesheet" type="text/css" />

<script src="resources/js/jquery.min.js" type="text/javascript"></script>
<script src="resources/js/bootstrap.min.js" type="text/javascript"></script>
<script src="resources/js/jquery.maskedinput-1.3.1.min.js"
	type="text/javascript"></script>
<script src="resources/js/jquery.validate.js" type="text/javascript"></script>
<meta charset="UTF-8">
<title>Cadastro de Produtos</title>
</head>
<body>
	<script type="text/javascript">
		$(document).ready(function() {
			$("#formProduto").validate({
				rules : {
					codigo : "required",
					descricao : "required",
				},
				messages : {
					codigo : "Este campo não pode ser vazio!",
					descricao : "Este campo não pode ser vazio!"
				}
			});
		});
	</script>
	<c:import url="cabecalho.jsp" />
	<br>
	<br>
	<br>
	<div class="container">
		<h3 align="center">Cadastro de Produtos</h3>
		<form id="formProduto" name="f1" action="produtos" method="post"
			role="form">
			<input id="pId" type="hidden" name="id" value="${produto.id}">
			<input id="pAcao" type="hidden" name="acao">
			<div class="col-md-12">
				<div class="row">
					<div class="form-group col-md-12">
						<label for="codigo">Codigo : </label> <input class="form-control"
							type=text maxlength="10" size="10" id="codigo" name="codigo"
							value="${produto.codigo}" />
					</div>
				</div>
				<div class="row">
					<div class="form-group col-md-12">
						<label for="descricao">Descrição : </label> <input
							class="form-control" type=text size="80" maxlength="100"
							id="descricao" name="descricao" value="${produto.descricao}" />
					</div>
				</div>
				<div id="actions" class="row">
					<div class="col-md-12">
						<button name="action" class="btn btn-primary" value="Incluir">Incluir</button>
						<c:if test="${produto.acao == 'Carregar'}">
							<button name="action" class="btn btn-primary" type="submit"
								value="Alterar">Alterar</button>
						</c:if>
						<a href="produtos" class="btn btn-default">Cancelar</a>
					</div>
				</div>
				<br>
			</div>
		</form>
	</div>
	<div class="container">
		<form name="f2" action="produtos" method="post" role="form">
			<div class="col-md-12">
				<div class="input-group h2">
					<input name="busca" class="form-control" id="search" type="text"
						placeholder="Pesquisar Produtos (deixe vazio para trazer todos)">
					<span class="input-group-btn">
						<button name="action" class="btn btn-primary" type="submit"
							value="Pesquisar">
							<span class="glyphicon glyphicon-search"></span>
						</button>
					</span>
				</div>
			</div>
			<c:if test="${produtos[0].id > 0}">
				<c:if test="${produto.acao != 'Carregar'}">
					<br>
					<br>
					<div class="table-responsive col-md-12">
						<table class="table table-striped">
							<thead>
								<tr>
									<th align=center>ID</th>
									<th align=center>CODIGO</th>
									<th align=center>DESCRICAO</th>
									<th width="10%">AÇÃO</th>
								</tr>
							</thead>
							<tbody>
								<c:forEach var="produto" items="${produtos}">
									<tr>
										<td>&nbsp;${produto.id}</td>
										<td>&nbsp;${produto.codigo}</td>
										<td>&nbsp;${produto.descricao}</td>
										<td width="10%"><a class="btn btn-success"
											onclick="javascript:document.f1.acao.value='Carregar';document.f1.id.value=${produto.id};document.f1.submit();"><i
												class="glyphicon glyphicon-pencil"></i></a> <a
											class="btn btn-danger"
											onclick="javascript:document.f1.acao.value='Excluir';document.f1.id.value=${produto.id};document.f1.submit();"><i
												class="glyphicon glyphicon-remove-sign"></i></a></td>
									</tr>
								</c:forEach>
							</tbody>
						</table>
					</div>
				</c:if>
			</c:if>
		</form>
	</div>
</body>
</html>