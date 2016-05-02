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
<title>Vendas</title>
</head>
<body>
	<script type="text/javascript">
		$(document).ready(function() {

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
									url: 'vendas',
									data:{id: $("#excluir").val(), acao:"teste"}
									}  
								);
			 	      	  }},
		 	     	  { caption:'Não',callback:function() {}}
		 	  		] 
				}
			);
		}); 
	</script>
	<c:import url="cabecalho.jsp" />
	<div class="container">
		<h3 align="center">Vendas</h3>
		<form id="formProduto" name="f1" action="vendas" method="post" role="form">
			<input id="pId" type="hidden" name="id" value="${venda.id}">
			<input id="pAcao" type="hidden" name="acao">
  			<div class="row">
      		<div class="form-group col-xs-3">
				<label for="codigo">Codigo : </label> 
				<input class="form-control" type=text maxlength="10" id="codigo" name="codigo" value="${produto.codigo}" />
			</div>
			</div>
  			<div class="row">
      		<div class="form-group col-xs-9">
				<label for="descricao">Descrição : </label> 
				<input class="form-control" type=text  maxlength="100" id="descricao" name="descricao" value="${produto.descricao}" />
			</div>
			</div>
  			<div class="row">
      		<div class="form-group col-xs-3">
				<label for="valorvenda">Valor Venda : </label> 
				<input class="form-control"	 onKeyPress="return(MascaraMoeda(this,'','.',event))" id="valorvenda" name="valorvenda" value="${produto.valorvenda}" />
			</div>
      		<div class="form-group col-xs-3">
				<label for="qtde">Quantidade : </label> 
				<input class="form-control"	 id="qtde" name="qtde" value="${produto.qtde}" />
			</div>			</div>
  			<div class="row">
			<div class="col-xs-12">
				<button name="action" class="btn btn-primary" value="Incluir">Incluir</button>
				<a href="produtos" class="btn btn-default">Cancelar</a>
			</div>
			</div>
		</form>
	</div>
	<div class="container">
		<form name="f2" action="vendas" method="post" role="form">
			<div class="col-md-12">
				<div class="input-group h2">
					<input name="busca" class="form-control" id="search" type="text" placeholder="Pesquisar Produtos (deixe vazio para trazer todos)">
					<span class="input-group-btn">
						<button name="action" class="btn btn-primary" type="submit" value="Pesquisar">
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
									<tr>
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