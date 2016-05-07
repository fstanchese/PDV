<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<html>
<head>
<link href="resources/css/bootstrap.min.css" rel="stylesheet" 	type="text/css" />
<link href="resources/css/bootstrap-theme.min.css" rel="stylesheet"	type="text/css" />
<link href="resources/css/zebra.dialog.css" rel="stylesheet" type="text/css" />
<link href="resources/css/custom.css" rel="stylesheet" type="text/css" />
<link href="resources/css/style.css" rel="stylesheet" type="text/css" />
<script src="resources/js/jquery.min.js" type="text/javascript"></script>
<script src="resources/js/bootstrap.min.js" type="text/javascript"></script>
<script src="resources/js/jquery.maskedinput-1.3.1.min.js" 	type="text/javascript"></script>
<script src="resources/js/jquery.validate.js" type="text/javascript"></script>
<script src="resources/js/jquery.bootstrap-growl.js" type="text/javascript"></script>
<script src="resources/js/zebra.dialog.js" type="text/javascript"></script>
<script src="resources/js/zebra.dialog.src.js" type="text/javascript"></script>
<meta charset="UTF-8">
<title>Vendas</title>
</head>
<body>
	<script type="text/javascript">
	$(document).ready(function() {
		$(document).on('click','#excluir',function () {
			$.Zebra_Dialog( '', 
				{
			   		'type': 'question',
	  		  		'title': 'Excluir Item ?',
					'keyboard' : false,
					'overlay_close' : false,
					'show_close_button' : false,
		 	  		'buttons': 
					[
		 	      	  { caption:'Sim',callback:function() 
			 	      	  {
								$.ajax 
								(
									{
									type: 'POST',
									url: 'vendas',
									data:{id: $("#excluir").val(), acao:"Excluir"}
									}  
								).done(function () { $("#linha"+$("#excluir").val()).hide() });
			 	      	  }},
		 	     	  { caption:'Não',callback:function() {}}
		 	  		] 
				}
			);
		});
	});
	function MascaraMoeda(objTextBox, SeparadorMilesimo, SeparadorDecimal,
			e) {
		var sep = 0;
		var key = '';
		var i = j = 0;
		var len = len2 = 0;
		var strCheck = '0123456789';
		var aux = aux2 = '';
		var whichCode = (window.Event) ? e.which : e.keyCode;
		if (whichCode == 13 || whichCode == 8)
			return true;
		key = String.fromCharCode(whichCode); // Valor para o cï¿½digo da Chave  
		if (strCheck.indexOf(key) == -1)
			return false; // Chave invï¿½lida  
		len = objTextBox.value.length;
		for (i = 0; i < len; i++)
			if ((objTextBox.value.charAt(i) != '0')
					&& (objTextBox.value.charAt(i) != SeparadorDecimal))
				break;
		aux = '';
		for (; i < len; i++)
			if (strCheck.indexOf(objTextBox.value.charAt(i)) != -1)
				aux += objTextBox.value.charAt(i);
		aux += key;
		len = aux.length;
		if (len == 0)
			objTextBox.value = '';
		if (len == 1)
			objTextBox.value = '0' + SeparadorDecimal + '0' + aux;
		if (len == 2)
			objTextBox.value = '0' + SeparadorDecimal + aux;
		if (len > 2) {
			aux2 = '';
			for (j = 0, i = len - 3; i >= 0; i--) {
				if (j == 3) {
					aux2 += SeparadorMilesimo;
					j = 0;
				}
				aux2 += aux.charAt(i);
				j++;
			}
			objTextBox.value = '';
			len2 = aux2.length;
			for (i = len2 - 1; i >= 0; i--)
				objTextBox.value += aux2.charAt(i);
			objTextBox.value += SeparadorDecimal + aux.substr(len - 2, len);
		}
		return false;
	}
	</script>
	<c:import url="cabecalho.jsp" />
	<div class="container">
		<h3 align="center">Vendas</h3>
		<form id="formProduto" name="f1" action="vendas" method="post"
			role="form">
			<input id="pId" type="hidden" name="id"> 

			<div class="row">
				<div class="form-group col-xs-2">
					<label for="qtde">Quantidade : </label> 
					<input class="form-control" id="qtde" name="qtde" maxlength="3" />
				</div>
			</div>
			<div class="row">
				<div class="form-group col-xs-2">
					<label for="codigo">Código : </label> 
					<input class="form-control" type=text maxlength="10" id="codigo" name="codigo" />
				</div>
			</div>
			<div class="row">
				<div class="form-group col-xs-9">
					<label for="descricao">Descrição : </label> 
					<input class="form-control" type=text maxlength="100" id="descricao" name="descricao" />
				</div>
			</div>
			<div class="row">
				<div class="form-group col-xs-2">
					<label for="valorvenda">Valor da Venda : </label> 
					<input class="form-control" onKeyPress="return(MascaraMoeda(this,'','.',event))" id="valorvenda" name="valorvenda" />
				</div>
			</div>
			<div class="row">
				<div class="col-xs-12">
					<button name="acao" class="btn btn-primary" value="Incluir">Incluir</button>
					<a href="vendas" class="btn btn-default">Cancelar</a>
				</div>
			</div>
		</form>
		<br>
		<br>
		<c:if test="${carrinho.size gt 0}">
			<div class="table-responsive col-md-12">
				<table class="table table-striped">
					<thead>
						<tr>
							<th align=center>Código</th>
							<th align=center>Descrição</th>
							<th align=center>Valor</th>
							<th align=center>Qtde</th>
							<th align=center>Total</th>
							<th width="13%">Ação</th>
						</tr>
					</thead>
					<tbody>
						<c:forEach var="item" items="${carrinho.itens}">
							<tr id="linha${item.produto.id}">
								<td>&nbsp;${item.produto.codigo}</td>
								<td>&nbsp;${item.produto.descricao}</td>
								<td>&nbsp;${item.produto.valorvenda}</td>
								<td>&nbsp;${item.quantidade}</td>
								<td>&nbsp;${item.total}</td>
								<td width="13%">
									<button type="button" class="btn btn-danger btn-xs" id="excluir" value="${item.produto.id}">Excluir</button>
								</td>
							</tr>
						</c:forEach>
					</tbody>
				</table>
			</div>
		</c:if>
	</div>
</body>
</html>