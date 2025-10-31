const botao_entrar = document.getElementById('login-button');
function exibeErro(str) {alert(str)}

const entrar = (emailVar, senhaVar) => {
	console.log('LOGIN: ', emailVar);
	console.log('SENHA: ', senhaVar);

	fetch('/usuarios/autenticar', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			emailServer: emailVar,
			senhaServer: senhaVar,
		}),
	})
		.then(function (resposta) {
			if (resposta.ok) {
				console.log(resposta);

				resposta.json().then((json) => {
					console.log(json);
					console.log(JSON.stringify(json));

					sessionStorage.ID_USUARIO = json.idUsuario;
                    sessionStorage.ID_EMPRESA = json.idEmpresa;
                    sessionStorage.NOME_USUARIO = json.nome;
                    sessionStorage.EMAIL_USUARIO = json.email;
                    sessionStorage.STATUS_ATIVACAO = json.status_ativacao;
                    sessionStorage.PERMISSOES= json.permissoes;

					alert(`Login realizado com sucesso!\nBoas Vindas ${sessionStorage.NOME_USUARIO}!`)
					setTimeout(() => {
						switch (sessionStorage.PERMISSOES) {
							case '1000':
								window.location = './html_colaborador_infrawatch/perfil_colaborador.html';
								break;
							case '0111':
								window.location = './html_user_perfil_adm/perfil_adm.html';
								break;
							default:
								window.location = 'index.html';
								break;
						}
					}, 10);
				});
			} else {
				exibeErro('Login e/ou senha inválidos!');
				console.log('Houve um erro ao tentar realizar o login!');
				resposta.text().then((texto) => {
					console.error(texto);
				});
			}
		})
		.catch((erro) => {
			console.log(erro);
		});

	return false;
};

botao_entrar.addEventListener('click', () => {
	let emailVar = document.getElementById('id-login-input-email').value;
	let senhaVar = document.getElementById('id-login-input-password').value;

	if (emailVar == '' || senhaVar == '') {
		exibeErro('Todos os campos devem ser preenchidos!');
		return false;
	} else {
		entrar(emailVar, senhaVar);
	}
	
});