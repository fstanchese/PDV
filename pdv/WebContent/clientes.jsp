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
<title>Cadastro de Clientes</title>
</head>
<body>
<script type="text/javascript">
	$(document).ready(function() {    
		$(function() {
			$.mask.definitions['~'] = '[+-]';
			//Inicio Mascara Telefone
			$('#fone').mask("(99) 9999-9999?9").blur(
				function(event) {
					var target, phone, element;
					target = (event.currentTarget) ? event.currentTarget
							: event.srcElement;
					phone = target.value
							.replace(/\D/g, '');
					element = $(target);
					element.unmask();
					if (phone.length > 10) {
						element
								.mask("(99) 99999-999?9");
					} else {
						element
								.mask("(99) 9999-9999?9");
					}
				});
		});
		$("#formClientes").validate({
			rules : {
				nome : "required",
				email : { email: true }
			},
			messages : {
				nome : "Este campo não pode ser vazio!",
				email : "Entre com um email válido!"
			}
		});
		$(document).on('click','#excluir',function () {
			$.Zebra_Dialog( '', 
				{
			   		'type': 'question',
	  		  		'title': 'Excluir Cliente ?',
					'keyboard' : false,
					'overlay_close' : false,
					'show_close_button' : false,
		 	  		'source': {'inline': $("input[name='ClienteStr1']").val()},	
		 	  		'buttons': 
					[
		 	      	  { caption:'Sim',callback:function() 
			 	      	  {
								$.ajax 
								(
									{
									type: 'POST',
									url: 'clientes',
									data:{id: $("#excluir").val(), acao:"teste"}
									}  
								);
			 	      	  }},
		 	     	  { caption:'Não',callback:function() {}}
		 	  		] 
				}
			);
		}); 
	});
	</script>
	<c:import url="cabecalho.jsp" />
	<div class="container">
		<h3 align="center">Cadastro de Clientes</h3>
		<form id="formClientes" name="f1" action="clientes" method="post" role="form">
			<input id="pId" type="hidden" name="id" value="${cliente.id}">
			<input id="pAcao" type="hidden" name="acao">
			<div class="col-md-12">
				<div class="row">
					<div class="form-group col-md-12">
						<label for="nome">Nome</label> 
						<input type="text" class="form-control" name="nome" id="nome" maxlength="100" value="${cliente.nome}">
					</div>
				</div>
				<div class="row">
					<div class="form-group col-md-4">
						<label for="fone">Celular</label> 
						<input type="tel" class="form-control" name="fone" id="fone" maxlength="15"	value="${cliente.fone}">
					</div>
					<div class="form-group col-md-4">
						<label for="email">E-Mail</label> 
						<input type="email" class="form-control" name="email" id="email" maxlength="60"	value="${cliente.email}">
					</div>
					<div class="form-group col-md-4">
						<label for="cpf">CPF : </label>
						<input type=text class="form-control" maxlength="15" size="15" name="cpf" value="${cliente.cpf}" />
					</div>
				</div>
				<div id="actions" class="row">
					<div class="col-md-12">
						<button name="action" class="btn btn-primary" value="Incluir">Incluir</button>
						<c:if test="${cliente.acao == 'Carregar'}">
							<button name="action" class="btn btn-primary" type="submit" value="Alterar">Alterar</button>
						</c:if>
						<a href="clientes" class="btn btn-default">Cancelar</a>
					</div>
				</div>
				<br>
			</div>
		</form>
	</div>
	<div class="container">
		<form name="f2" action="clientes" method="post" role="form">
			<div class="col-md-12">
				<div class="input-group h2">
					<input name="busca" class="form-control" id="search" type="text"
						placeholder="Pesquisar Clientes (deixe vazio para trazer todos)">
					<span class="input-group-btn">
						<button name="action" class="btn btn-primary" type="submit"
							value="Pesquisar">
							<span class="glyphicon glyphicon-search"></span>
						</button>
					</span>
				</div>
			</div>
			<c:if test="${clientes[0].id > 0}">
				<c:if test="${cliente.acao != 'Carregar'}">
					<br>
					<br>
					<div class="table-responsive col-md-12">
						<table class="table table-striped">
							<thead>
								<tr>
									<th align=center>Nome</th>
									<th align=center>Celular</th>
									<th align=center>E-Mail</th>
									<th align=center>CPF</th>
									<th width="13%">Ação</th>
								</tr>
							</thead>
							<tbody>
								<c:forEach var="cliente" items="${clientes}">
									<tr>
										<td>&nbsp;${cliente.nome}</td>
										<td>&nbsp;${cliente.fone}</td>
										<td>&nbsp;${cliente.email}</td>
										<td>&nbsp;${cliente.cpf}</td>
										<td align="center" width="13%">
										<a class="btn btn-success btn-xs" onclick="javascript:document.f1.acao.value='Carregar';document.f1.id.value=${cliente.id};document.f1.submit();">Alterar</a>
										<button type="button" class="btn btn-danger btn-xs" id="excluir" value="${cliente.id}">Excluir</button>
										<input name="ClienteStr${cliente.id}" type="hidden"  value="${cliente.nome}">
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
			   $.bootstrapGrowl("${mensagem}", { type:'${acao}' ,align:'center'});
			});
		});
	</script>	
	</c:if>
</body>
</html>