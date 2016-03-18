<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<html>
<head> 
<link href="resources/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<link href="resources/css/bootstrap-theme.min.css" rel="stylesheet" type="text/css" />
<link href="resources/css/custom.css" rel="stylesheet" type="text/css" />


<script src="resources/js/jquery.min.js" type="text/javascript"></script>
<script src="resources/js/bootstrap.min.js" type="text/javascript"></script>
<script src="resources/js/jquery.maskedinput-1.3.1.min.js" type="text/javascript"></script>
<meta charset="UTF-8">
<title>Cadastro de Produtos</title>
</head>
<body>
	<script type="text/javascript">
	</script>
	<form id="f1" name="f1" action="produtos" method="post" role="form">
		<input id="pId" type="hidden" name="id" value="${produto.id}">
		<input id="pAcao" type="hidden" name="acao">
		<div class="container">
			<h4 align="center">Cadastro de Produtos</h4>
			<hr />
			<div class="form-group">
				<div class="form-group">
					<label>Codigo : </label> 
					<input required type=text maxlength="11" size="11" name="codigo" value="${produto.codigo}" class="form-control" />
				</div>				
				<div class="form-group">
					<label>Descrição : </label> 
					<input required type=text size="80" maxlength="100" name="descricao" value="${produto.descricao}" class="form-control" />
				</div>

				<div class="form-group">
					<input name="action" class="btn btn-primary" type="submit" value="Incluir"> 
					<c:if test="${produto.acao == 'Carregar'}">
						<input name="action" class="btn btn-primary" type="submit" value="Alterar">
					</c:if>
					<input name="action" class="btn btn-primary" type="submit" value="Limpar">
				</div>
				<hr />
				<br />
			</div>
			<c:if test="${produtos[0].id > 0}">
			<c:if test="${produto.acao != 'Carregar'}">
			<table class="table table-responsive">
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
							<td width="10%">
								<a class="btn btn-success" onclick="javascript:document.f1.acao.value='Carregar';document.f1.id.value=${produto.id};document.f1.submit();"><i class="glyphicon glyphicon-pencil"></i></a> 
								<a class="btn btn-danger" onclick="javascript:document.f1.acao.value='Excluir';document.f1.id.value=${produto.id};document.f1.submit();"><i class="glyphicon glyphicon-remove-sign"></i></a>
							</td>
						</tr>
					</c:forEach>
				</tbody>
			</table>
			</c:if>
			</c:if>
		</div>
	</form>
</body>
</html>