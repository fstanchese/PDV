<html>
<head>
<link href="resources/css/bootstrap.min.css" rel="stylesheet"
	type="text/css" />
<link href="resources/css/signin.css" rel="stylesheet" type="text/css" />
<meta charset="UTF-8">
<title>Pagina de Login</title>
</head>
<div class="container">
	<form class="form-signin" action="menuprincipal" method="post">
		<label for="login" class="sr-only">Email address</label> <input
			name="login" type="text" class="form-control" placeholder="Login"
			required autofocus> <label for="senha" class="sr-only">Senha</label>
		<input name="senha" type="password" id="senha" class="form-control"
			placeholder="Senha" required>

		<button class="btn btn-lg btn-primary btn-block" type="submit">Entrar</button>
	</form>
</div>
</body>
</html>