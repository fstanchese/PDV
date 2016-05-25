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
<link href="resources/css/zebra.dialog.css" rel="stylesheet" type="text/css" />
<meta charset="UTF-8">
<title>Vendas</title>
</head>
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
	border: 2px solid #ddd;
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
<body>
<script type="text/javascript">
$(function() {
		$('.scrollTable').scrolltable({
			stripe : true,
			oddClass : 'odd',
			maxHeight: 425
		});
});
function validarCPF( cpf ){
	var filtro = /^\d{3}.\d{3}.\d{3}-\d{2}$/i;
	if(cpf=="") return true;
	if(!filtro.test(cpf))
	{
		window.alert("CPF inválido. Tente novamente.");
		document.getElementById('cpf').value = "";
		return false;
	}
    iCpf = cpf;
	cpf = remove(cpf, ".");
	cpf = remove(cpf, "-");
	
	if(cpf.length != 11 || cpf == "00000000000" || cpf == "11111111111" ||
		cpf == "22222222222" || cpf == "33333333333" || cpf == "44444444444" ||
		cpf == "55555555555" || cpf == "66666666666" || cpf == "77777777777" ||
		cpf == "88888888888" || cpf == "99999999999")
	{
		$.Zebra_Dialog(iCpf, 
		{
			   		'type': 'information',
	  		  		'title': 'CPF Invalido',
					'keyboard' : false,
					'overlay_close' : false,
					'show_close_button' : false
		}
		);
		document.getElementById('cpf').value = "";
		return false;
   }

	soma = 0;
	for(i = 0; i < 9; i++)
	{
		soma += parseInt(cpf.charAt(i)) * (10 - i);
	}
	
	resto = 11 - (soma % 11);
	if(resto == 10 || resto == 11)
	{
		resto = 0;
	}
	if(resto != parseInt(cpf.charAt(9))){
		$.Zebra_Dialog(iCpf, 
		{
			   		'type': 'information',
	  		  		'title': 'CPF Invalido',
					'keyboard' : false,
					'overlay_close' : false,
					'show_close_button' : false
		}
		);		
		document.getElementById('cpf').value = "";
		return false;
	}
	
	soma = 0;
	for(i = 0; i < 10; i ++)
	{
		soma += parseInt(cpf.charAt(i)) * (11 - i);
	}
	resto = 11 - (soma % 11);
	if(resto == 10 || resto == 11)
	{
		resto = 0;
	}
	
	if(resto != parseInt(cpf.charAt(10))){
		$.Zebra_Dialog(iCpf, 
		{
			   		'type': 'information',
	  		  		'title': 'CPF Invalido',
					'keyboard' : false,
					'overlay_close' : false,
					'show_close_button' : false
		}
		);		
		document.getElementById('cpf').value = "";
		return false;
	}
	return true;
 }
 
function remove(str, sub) {
	i = str.indexOf(sub);
	r = "";
	if (i == -1) return str;
	{
		r += str.substring(0,i) + remove(str.substring(i + sub.length), sub);
	}
	
	return r;
}

/**
   * MASCARA ( mascara(o,f) e execmascara() ) CRIADAS POR ELCIO LUIZ
   * elcio.com.br
   */
function mascara(o,f){
	v_obj=o
	v_fun=f
	setTimeout("execmascara()",1)
}

function execmascara(){
	v_obj.value=v_fun(v_obj.value)
}

function cpf_mask(v){
	v=v.replace(/\D/g,"")                 //Remove tudo o que não é dígito
	v=v.replace(/(\d{3})(\d)/,"$1.$2")    //Coloca ponto entre o terceiro e o quarto dígitos
	v=v.replace(/(\d{3})(\d)/,"$1.$2")    //Coloca ponto entre o setimo e o oitava dígitos
	v=v.replace(/(\d{3})(\d)/,"$1-$2")   //Coloca ponto entre o decimoprimeiro e o decimosegundo dígitos
	return v
}
</script>
<c:import url="cabecalho.jsp" />
<div class="container">
	<div role="main" class="col-xs-2">
		<form id="formProduto" name="f1" action="vendas" method="post" role="form">
			<input id="pId" type="hidden" name="id">
			<div class="row">
				<div class="form-group col-xs-10">
					<label for="cpf">CPF : </label> 
					<input class="form-control" type="text" name="cpf" id="cpf" onblur="javascript:validarCPF(this.value);" onkeypress="javascript:mascara(this, cpf_mask);"  maxlength="14" />				
				</div>
			</div>					
			<div class="row">
				<div class="form-group col-xs-8">
					<label for="codigo">Código : </label> 
					<input class="form-control" type=text maxlength="10" id="codigo" name="codigo" autofocus/>
				</div>
			</div>
			<div class="row">
				<div class="form-group col-xs-8">
					<label for="qtde">Quantidade : </label> 
					<input class="form-control" id="qtde" name="qtde" maxlength="3"	value="1" />
				</div>
			</div>
			<div class="row">
				<div class="col-xs-12">
					<button name="acao" class="btn btn-primary" value="Incluir">Incluir</button>
					<a href="vendas" class="btn btn-default">Cancelar</a>
				</div>
			</div>
		</form>
		<br><br>
	</div>
	<aside role="complementary" class="col-xs-10">
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
			<c:if test="${carrinho.size gt 0}">
				<tbody>
				<fmt:setLocale value="pt_BR"/>
				<c:forEach var="itemCarrinho" items="${carrinho.itens}">
					<tr id="linha${itemCarrinho.produto.id}">
						<td>&nbsp;${itemCarrinho.produto.codigo}</td>
						<td>&nbsp;${itemCarrinho.produto.descricao}</td>
						<td>&nbsp;
							<fmt:formatNumber value="${itemCarrinho.produto.valorvenda}" type="currency"/>
						</td>
						<td>&nbsp;${itemCarrinho.quantidade}</td>
						<td>&nbsp;
							<fmt:formatNumber value="${itemCarrinho.total}" type="currency"/>
						</td>
						<td width="13%"><a href="vendas?acao=Excluir&id=${itemCarrinho.produto.id}" class="btn btn-danger btn-xs" id="excluir">Excluir</a></td>
					</tr>
				</c:forEach>
				</tbody>
				</table>
				<table class="scrollTable">
					<tr>
					<td width="77%" align="right">&nbsp;Total da Venda:</td>
					<td width="23%">&nbsp;<fmt:formatNumber value="${carrinho.total}" type="currency"/></td>
					</tr>
				</table>
			</c:if>
		</table>
	</div>
	</aside>
</div>
<script src="resources/js/jquery.min.js" type="text/javascript"></script>
<script src="resources/js/jquery-ui.min.js" type="text/javascript"></script>
<script src="resources/js/bootstrap.min.js" type="text/javascript"></script>
<script src="resources/js/jquery.scrolltable.js" type="text/javascript"></script>
<script src="resources/js/zebra.dialog.js" type="text/javascript"></script>
<script src="resources/js/zebra.dialog.src.js" type="text/javascript"></script>
</body>
</html>