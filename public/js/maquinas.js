const lista_maquinas = document.querySelector('maquinas');
function exibeErro(str) {alert(str)}

function exibirMaquinas () {
	let idEmpresa = sessionStorage.ID_EMPRESA;
	fetch(`maquinas/buscarPorEmpresa/${idEmpresa}`
	, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		}
	}
	)
		.then((resposta) => {
			if (resposta.ok) {
				return resposta.json();
			} else {
				exibeErro('Não foi possível exibir máquinas');
				return resposta.text().then(texto => console.error(texto));
			
			}
		})
		.then((json) => {
			if(!json)return;
			console.log(json);
			console.log(JSON.stringify(json));
		})
		.catch((erro) => {
			console.log(erro);
		});
};

window.addEventListener('load', () => {
	let idEmpresa = sessionStorage.ID_EMPRESA;

	if (idEmpresa == '') {
		exibeErro('Todos os campos devem ser preenchidos!');
		return false;
	} else {
		exibirMaquinas();
	}
});