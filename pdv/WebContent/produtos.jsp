<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<html>
<head>
<link href="resources/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<link href="resources/css/bootstrap-theme.min.css" rel="stylesheet"	type="text/css" />
<link href="resources/css/zebra.dialog.css" rel="stylesheet" type="text/css" />
<link href="resources/css/custom.css" rel="stylesheet" type="text/css" />
<link href="resources/css/style.css" rel="stylesheet" type="text/css" />
<script src="resources/js/jquery.min.js" type="text/javascript"></script>
<script src="resources/js/bootstrap.min.js" type="text/javascript"></script>
<script src="resources/js/jquery.maskedinput-1.3.1.min.js" type="text/javascript"></script>
<script src="resources/js/jquery.validate.js" type="text/javascript"></script>
<script src="resources/js/jquery.bootstrap-growl.js" type="text/javascript"></script>
<script src="resources/js/zebra.dialog.js" type="text/javascript"></script>
<script src="resources/js/zebra.dialog.src.js" type="text/javascript"></script>
<meta charset="UTF-8">
<title>Cadastro de Produtos</title>
</head>
<body>
	<script type="text/javascript">
		$(document).ready(function() {
			$("#formProduto").validate({
				rules : {
					codigo : "required",
					descricao : { required:true,minlength: 3 },
					valorvenda : { required:true, min:0.01, max:9999.99 },
					qtde : { required:true, min:0, max:999 }
				},
				messages : {
					codigo : "Este campo não pode ser vazio!",
					descricao : "Este campo não pode ser vazio!",
					valorvenda : "Minimo R$ 0,01 Máximo R$ 9.999,99 !",
					qtde : "Minimo 0 Máximo 999 !"
				}
			});
		});
		$(document).on('click','#excluir',function () {
			$.Zebra_Dialog( '', 
				{
			   		'type': 'question',
	  		  		'title': 'Excluir Produto ?',
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
									url: 'produtos',
									data:{id: $("#excluir").val(), acao:"Excluir"}
									}  
								).done(function () { $("#linha"+$("#excluir").val()).hide() });
			 	      	  }},
		 	     	  { caption:'Não',callback:function() {}}
		 	  		] 
				}
			);
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
		<h3 align="center">Cadastro de Produtos</h3>
		<form id="formProduto" name="f1" action="produtos" method="post"
			role="form">
			<input id="pId" type="hidden" name="id" value="${produto.id}">
			<input id="pAcao" type="hidden" name="acao">
			<div class="row">
				<div class="form-group col-xs-3">
					<label for="codigo">Código : </label> <input class="form-control"
						type=text maxlength="10" id="codigo" name="codigo"
						value="${produto.codigo}" />
				</div>
			</div>
			<div class="row">
				<div class="form-group col-xs-9">
					<label for="descricao">Descrição : </label> <input
						class="form-control" type=text maxlength="100" id="descricao"
						name="descricao" value="${produto.descricao}" />
				</div>
			</div>
			<div class="row">
				<div class="form-group col-xs-3">
					<label for="valorvenda">Valor Venda : </label> <input
						class="form-control"
						onKeyPress="return(MascaraMoeda(this,'','.',event))"
						id="valorvenda" name="valorvenda" value="${produto.valorvenda}" />
				</div>
				<div class="form-group col-xs-3">
					<label for="qtde">Quantidade Estoque : </label> <input
						class="form-control" id="qtde" name="qtde" value="${produto.qtde}" />
				</div>
			</div>
			<div class="row">
				<div class="col-xs-12">
					<button name="action" class="btn btn-primary" value="Incluir">Incluir</button>
					<c:if test="${produto.acao == 'Carregar'}">
						<button name="action" class="btn btn-primary" type="submit"
							value="Alterar">Alterar</button>
					</c:if>
					<a href="produtos" class="btn btn-default">Cancelar</a>
				</div>
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
									<th align=center>Código</th>
									<th align=center>Descrição</th>
									<th align=center>Valor Venda</th>
									<th align=center>Estoque</th>
									<th width="13%">Ação</th>
								</tr>
							</thead>
							<tbody>
								<c:forEach var="produto" items="${produtos}">
									<tr id="linha${produto.id}">
										<td>&nbsp;${produto.codigo}</td>
										<td>&nbsp;${produto.descricao}</td>
										<td>&nbsp;${produto.valorvenda}</td>
										<td>&nbsp;${produto.qtde}</td>
										<td width="13%">
											<a class="btn btn-success btn-xs" onclick="javascript:document.f1.acao.value='Carregar';document.f1.id.value=${produto.id};document.f1.submit();">Alterar</a>
											<button type="button" class="btn btn-danger btn-xs" id="excluir" value="${produto.id}">Excluir</button>
										</td>
									</tr>
								</c:forEach>
							</tbody>
						</table>
					</div>
				</c:if>
			</c:if>
		</form>
	</div>
	<c:if test="${not empty acao}">
		<script type="text/javascript">
		$(document).ready(function() { 
			$(function() {
			    setTimeout(function() {
			         $.bootstrapGrowl("${mensagem}", { type:'${acao}' ,align:'center'});
			      }, 40);	
			});
		});
	</script>
	</c:if>
</body>
</html>