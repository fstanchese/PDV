<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<html>
<head>
<link href="resources/css/bootstrap.min.css" rel="stylesheet"
	type="text/css" />
<link href="resources/css/bootstrap-theme.min.css" rel="stylesheet"
	type="text/css" />
<link href="resources/css/zebra.dialog.css" rel="stylesheet"
	type="text/css" />
<link href="resources/css/custom.css" rel="stylesheet" type="text/css" />
<link href="resources/css/style.css" rel="stylesheet" type="text/css" />
<script src="resources/js/jquery.min.js" type="text/javascript"></script>
<script src="resources/js/bootstrap.min.js" type="text/javascript"></script>
<script src="resources/js/jquery.maskedinput-1.3.1.min.js"
	type="text/javascript"></script>
<script src="resources/js/jquery.validate.js" type="text/javascript"></script>
<script src="resources/js/jquery.bootstrap-growl.js"
	type="text/javascript"></script>
<script src="resources/js/zebra.dialog.js" type="text/javascript"></script>
<script src="resources/js/zebra.dialog.src.js" type="text/javascript"></script>
<meta charset="UTF-8">
<title>Vendas</title>
</head>
<body>
	<script type="text/javascript">
		$(document).ready(function() {

		});
		$(document).on('click', '#excluir', function() {
			$.Zebra_Dialog('', {
				'type' : 'question',
				'title' : 'Excluir Produto ?',
				'keyboard' : false,
				'overlay_close' : false,
				'show_close_button' : false,
				'buttons' : [ {
					caption : 'Sim',
					callback : function() {
						$.ajax({
							type : 'POST',
							url : 'vendas',
							data : {
								id : $("#excluir").val(),
								acao : "teste"
							}
						});
					}
				}, {
					caption : 'NÃ£o',
					callback : function() {
					}
				} ]
			});
		});
	</script>
	<c:import url="cabecalho.jsp" />
	<div class="container">
		<h3 align="center">Vendas</h3>
		<form id="formProduto" name="f1" action="vendas" method="post"
			role="form">
			<input id="pId" type="hidden" name="id"> <input id="pAcao"
				type="hidden" name="acao">

			<div class="row">
				<div class="form-group col-xs-2">
					<label for="qtde">Quantidade : </label> 
					<input class="form-control" id="qtde" name="qtde" maxlength="3"/>
				</div>
			</div>
			<div class="row">
				<div class="form-group col-xs-2">
					<label for="codigo">Código : </label> <input class="form-control"
						type=text maxlength="10" id="codigo" name="codigo" />
				</div>
			</div>
			<div class="row">
				<div class="form-group col-xs-9">
					<label for="descricao">Descrição : </label> <input
						class="form-control" type=text maxlength="100" id="descricao"
						name="descricao" />
				</div>
			</div>
			<div class="row">
				<div class="form-group col-xs-2">
					<label for="valorvenda">Valor da Venda : </label> <input
						class="form-control"
						onKeyPress="return(MascaraMoeda(this,'','.',event))"
						id="valorvenda" name="valorvenda" />
				</div>
			</div>
			<div class="row">
				<div class="col-xs-12">
					<button name="action" class="btn btn-primary" value="Incluir">Incluir</button>
					<a href="vendas" class="btn btn-default">Cancelar</a>
				</div>
			</div>
		</form>
	</div>
	<br>
	<br>
	<c:if test="${carrinho[0].quantidade > 0}">
	<div class="table-responsive col-md-12">
		<table class="table table-striped">
			<thead>
				<tr>
					<th align=center>Código</th>
					<th align=center>Descrição</th>
					<th align=center>Valor Venda</th>
					<th align=center>Qtde</th>
					<th width="13%">Ação</th>
				</tr>
			</thead>
			<tbody>
				<c:forEach var="item" items="${carrinho}">
					<tr>
						<td>&nbsp;${item.getProduto().getDescricao()}</td>
						<td width="13%">
							<button type="button" class="btn btn-danger btn-xs"	id="excluir" value="${carrinho.id}">Excluir</button>
						</td>
					</tr>
				</c:forEach>
			</tbody>
		</table>
	</div>
	</c:if>
</body>
</html>