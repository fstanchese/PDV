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
<title>Cadastro de Clientes</title>
</head>
<body>
	<script type="text/javascript">

		jQuery(function($) {
			$.mask.definitions['~'] = '[+-]';
			//Inicio Mascara Telefone
			$('#telefoneId').mask("(99) 9999-9999?9").blur(
					function(event) {
						var target, phone, element;
						target = (event.currentTarget) ? event.currentTarget
								: event.srcElement;
						phone = target.value.replace(/\D/g, '');
						element = $(target);
						element.unmask();
						if (phone.length > 10) {
							element.mask("(99) 99999-999?9");
						} else {
							element.mask("(99) 9999-9999?9");
						}
					});
		});
	</script>
	<form id="f1" name="f1" action="clientes" method="post" role="form">
		<input id="pId" type="hidden" name="id" value="${cliente.id}">
		<input id="pAcao" type="hidden" name="acao">
		<div class="container">
			<h4 align="center">Cadastro de Clientes</h4>
			<hr />
			<div class="form-group">
				<div class="form-group">
					<label>Nome : </label> <input required type=text size="80" maxlength="100"
						name="nome" value="${cliente.nome}" class="form-control" />
				</div>
				<div class="form-group">
					<label>CPF : </label> <input type=text maxlength="11" size="11"
						name="cpf" value="${cliente.cpf}" class="form-control" />
				</div>
				<div class="form-group">
					<label>Telefone: </label> <input id="telefoneId" type="text"
						maxlength="15" size="12" name="fone" value="${cliente.fone}"
						class="form-control" />
				</div>
				<div class="form-group">
					<input name="action" class="btn btn-primary" type="submit" value="Incluir"> 
					<c:if test="${cliente.acao == 'read'}">
						<input name="action" class="btn btn-primary" type="submit" value="Alterar">
					</c:if>
					<input name="action" class="btn btn-primary" type="submit" value="Limpar">
				</div>
				<hr />
				<br />
			</div>
			<c:if test="${clientes[0].id > 0}">
			<c:if test="${cliente.acao != 'Carregar'}">
			<table class="table table-responsive">
				<thead>
					<tr>
						<th align=center>ID</th>
						<th align=center>NOME</th>
						<th align=center>CPF</th>
						<th align=center>FONE</th>
						<th width="10%">AÇÃO</th>
					</tr>
				</thead>
				<tbody>
					<c:forEach var="cliente" items="${clientes}">
						<tr>
							<td>&nbsp;${cliente.id}</td>
							<td>&nbsp;${cliente.nome}</td>
							<td>&nbsp;${cliente.cpf}</td>
							<td>&nbsp;${cliente.fone}</td>
							<td width="10%">
								<a class="btn btn-success" onclick="javascript:document.f1.acao.value='Carregar';document.f1.id.value=${cliente.id};document.f1.submit();"><i class="glyphicon glyphicon-pencil"></i></a> 
								<a class="btn btn-danger" onclick="javascript:document.f1.acao.value='Excluir';document.f1.id.value=${cliente.id};document.f1.submit();"><i class="glyphicon glyphicon-remove-sign"></i></a>
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