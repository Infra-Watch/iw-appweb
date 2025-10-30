const botao_cadastrar_usuario = document.getElementById('id_botao_cadastrar');

function exibeErro(str) {alert(str)}

botao_cadastrar_usuario.addEventListener('click', () => {

    let nome = document.getElementById('nome').value;
    let email = document.getElementById('email').value;
    let senha = document.getElementById('senha').value;
    let confirmSenha = document.getElementById('Confirmasenha').value;
    let chave_acesso = document.getElementById('chave_acesso').value;

    const validacaoSenha = /[a-zA-Z]/.test(senha) && /[0-9]/.test(senha) && /[^a-zA-Z0-9]/.test(senha);
	const senhasIguais = senha === confirmSenha;

    if (nome == '' || email == '' || senha == '' || confirmSenha == '' || chave_acesso == '') {
		exibeErro('Todos os campos devem ser preenchidos!');
		return false;
	} else if (nome.length < 3) {
		exibeErro('O nome deve ter pelo menos 3 caracteres!');
		return false;
	} else if (!email.includes('@') || !email.includes('.com')) {
		exibeErro('Email inválido!');
		return false;
	} else if (senha.length < 5) {
		exibeErro('Senha curta!<br> Pelo menos 5 caracteres!');
		return false;
	} else if (!validacaoSenha) {
		exibeErro('Senha fraca!<br> Insira pelo menos: 1 letra, 1 número e 1 caractere especial.');
		return false;
	} else if (!senhasIguais) {
		exibeErro('As senhas devem ser iguais!');
		return false;
	} else {
		setTimeout(() => {
			divMsgErro.style.display = 'none';
		}, 4000);
	}

	fetch('/usuarios/cadastrar', {
		method: 'Post',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
            nomeServer: nome,
			emailServer: email,
			senhaServer: senha,
            chave_acessoServer: chave_acesso
		}),
	})
		.then(function (resposta) {
			console.log('resposta: ', resposta);

			if (resposta.ok) {
				alert('Cadastro realizado com sucesso! Redirecionando para o login...');
				setTimeout(() => {
					window.location.href = 'login.html';
				}, '2000');
			} else {
				throw 'Houve um erro ao tentar realizar o cadastro!';
			}
		})
		.catch(function (resposta) {
			console.log(`#ERRO: ${resposta}`);
			alert(`#ERRO: ${resposta}`);
		});
});