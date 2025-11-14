const lista_maquinas = document.querySelector('maquinas');
function exibeErro(str) {alert(str)}

const exibirMaquinas = (idEmpresa) => {
	fetch('/buscarPorEmpresa/:idEmpresa', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		}
	})
		.then(function (resposta) {
			if (resposta.ok) {
				console.log(resposta);

				resposta.json().then((json) => {
					console.log(json);
					console.log(JSON.stringify(json));
				});

			} else {
				exibeErro('Não foi possível exibir máquinas');
				console.log(resposta.status);
				console.log(resposta.statusText);
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

lista_maquinas.addEventListener('load', () => {
	let idEmpresa = sessionStorage.ID_EMPRESA;

	if (idEmpresa == '') {
		exibeErro('Todos os campos devem ser preenchidos!');
		return false;
	} else {
		exibirMaquinas(idEmpresa);
	}
});