<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<html>
<head>
<link href="resources/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<link href="resources/css/bootstrap-theme.min.css" rel="stylesheet"	type="text/css" />
<link href="resources/css/custom.css" rel="stylesheet" type="text/css" />
<link href="resources/css/style.css" rel="stylesheet" type="text/css" />
<link href="resources/css/jquery-ui.min.css" rel="stylesheet" type="text/css" />
<script src="resources/js/jquery.min.js" type="text/javascript"></script>
<script src="resources/js/jquery-ui.min.js" type="text/javascript"></script>
<script src="resources/js/bootstrap.min.js" type="text/javascript"></script>
<script src="resources/js/jquery.scrolltable.js" type="text/javascript"></script>
<meta charset="UTF-8">
<title>Vendas</title>
</head>
<body>
<script type="text/javascript">
		$(function() {
				$('.scrollTable').scrolltable({
					stripe : true,
					oddClass : 'odd',
					maxHeight: 425
				});
		});
</script>
<style type="text/css">

h1 {
	margin-top: 0;
	float: left;
}

#controls {
	float: left;
	padding: 0.3em 1em;
}

table.scrollTable {
	width: 100%;
	border: 1px solid #ddd;
}

thead {
	background-color: #eee;
}

thead th {
	text-align: center;
	padding: 0.1em 0.3em;
}

tbody td {
	border-top: 1px solid #eee;
	border-right: 1px solid #eee;
	padding: 0.1em 0.3em;
}

tbody tr.odd td {
	background-color: #f9f9f9;
}
</style>
	<c:import url="cabecalho.jsp" />
	<div class="container">
		<div class="row">
			<div role="main" class="col-xs-2">
				<form id="formProduto" name="f1" action="vendas" method="post"
					role="form">
					<input id="pId" type="hidden" name="id">
					<div class="row">
						<div class="form-group col-xs-8">
							<label for="codigo">Código : </label> <input class="form-control"
								type=text maxlength="10" id="codigo" name="codigo" />
						</div>
					</div>
					<div class="row">
						<div class="form-group col-xs-8">
							<label for="qtde">Quantidade : </label> <input
								class="form-control" id="qtde" name="qtde" maxlength="3"
								value="1" />
						</div>
					</div>
					<div class="row">
						<div class="col-xs-12">
							<button name="acao" class="btn btn-primary" value="Incluir">Incluir</button>
							<a href="vendas" class="btn btn-default">Cancelar</a>
						</div>
					</div>
				</form>
				<br> <br>
			</div>
			<aside role="complementary" class="col-xs-10">
				<c:if test="${carrinho.size gt 0}">
					<div style="clear: both" />
					<table class="scrollTable">
						<thead>
							<tr>
								<th width="10%">Código</th>
								<th width="55%">Descrição</th>
								<th width="10%">Valor Unidade</th>
								<th width="5%">Qtde</th>
								<th width="15%">Total</th>
								<th width="5%">Ação</th>
							</tr>
						</thead>
						<tbody>
							<c:forEach var="itemCarrinho" items="${carrinho.itens}">
								<tr id="linha${itemCarrinho.produto.id}">
									<td>&nbsp;${itemCarrinho.produto.codigo}</td>
									<td>&nbsp;${itemCarrinho.produto.descricao}</td>
									<td>&nbsp;${itemCarrinho.produto.valorvenda}</td>
									<td>&nbsp;${itemCarrinho.quantidade}</td>
									<td>&nbsp;${itemCarrinho.total}</td>
									<td width="13%"><a
										href="vendas?acao=Excluir&id=${itemCarrinho.produto.id}"
										class="btn btn-danger btn-xs" id="excluir">Excluir</a></td>
								</tr>
							</c:forEach>
						</tbody>
					</table>
		</div>
		</c:if>
		</aside>
	</div>
	</div>
</body>
</html>