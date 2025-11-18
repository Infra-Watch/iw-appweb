const lista_maquinas = document.querySelector('.maquinas');
function exibeErro(str) {alert(str)}

function exibirMaquinas () {
	let idEmpresa = sessionStorage.ID_EMPRESA;
	fetch(`/maquinas/buscarPorEmpresa/${idEmpresa}`
	, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		}
	}
	)
		.then((resposta) => {
			if (resposta.ok) {
				console.log(resposta);
				return resposta.json();
			} else {
				exibeErro('Não foi possível exibir máquinas');
				return resposta.text().then(texto => console.error(texto));
			
			}
		})
		.then((json) => {
			if(!json)return;
			maquinas = json[0];
			query_status = json[1];
			console.log(maquinas);
			console.log(query_status);
			console.log(json);
			console.log(JSON.stringify(json));
			if (maquinas.length > 0) {
				maquinas.forEach(maquina => {
					let alertas = maquina.qtd_alertas_24h;
					let ativacao = maquina.ativacao;
					let card = lista_maquinas.appendChild(document.createElement("article"));
					card.setAttribute('class', 'card-maquina');
					card.setAttribute('mac_address', maquina.mac_address);
	
					let cardTitle = card.appendChild(document.createElement("h3"));
					cardTitle.textContent += maquina.nome_maquina;
					cardTitle.innerHTML += elem_bolinha(alertas, ativacao);
	
					card.innerHTML += elem_status(alertas, ativacao);
					console.log(maquina.nome_maquina)
				});
			} else {
				let card = lista_maquinas.appendChild(document.createElement("article"));
				card.setAttribute('class', 'card-maquina');
				
				let cardTitle = card.appendChild(document.createElement("h3"));
				cardTitle.textContent = "Você ainda não possui máquinas monitoradas"
			}
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

function elem_bolinha(qtd_alertas, ativacao) {
	let str = '';
	if (!ativacao) {
		str = ""
	} else if (qtd_alertas > 4) {
		str = `<img class="status-bolinha" src="assets/imagens/circulo-vermelha.png" alt="Status Crítico">`
	} else if (qtd_alertas > 2) {
		str =  `<img class="status-bolinha" src="assets/imagens/circulo-amarelo.png" alt="Status Atenção">`
	} else {
		str =  `<img class="status-bolinha" src="assets/imagens/circulo-verde.png" alt="Status Regular">`
	}
	return str
};
function elem_status(qtd_alertas, ativacao) {
	let str = ``;
	if (!ativacao) {
		str = `<p>Status: <span id="stts_inativo">Inativo</span></p>`
	} else if (qtd_alertas > 4) {
		str =  `<p>Status: <span id="stts_critico">Crítico</span></p>`
	} else if (qtd_alertas > 2) {
		str =  `<p>Status: <span id="stts_perigo">Atenção</span></p>`
	} else {
		str =  `<p>Status: <span id="stts_ok">Regular</span></p>`
	}
	return str
};