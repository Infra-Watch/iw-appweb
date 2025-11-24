const idEmpresa = sessionStorage.ID_EMPRESA;
const intervalo = sessionStorage.INTERVALO_DIAS != undefined ? sessionStorage.INTERVALO_DIAS: 1;

window.addEventListener('load', () => {
	if (idEmpresa == undefined) {
		exibeErro('Todos os campos devem ser preenchidos!');
		return false;
	} else {
		plotarDashboard();
	}
});

function plotarDashboard () {
	exibirMaquinas();
	exibirKpis();
	exibirAlertas();
	exibirComponentes();
};


function exibirComponentes() {
	let idMaquina = 1;
	fetch(`/componentes/buscarPorMaquina/${idEmpresa}/${idMaquina}/${intervalo}`
	, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		}
	})
	.then((response) => {
		if (response.ok) {
			return response.json();
		} else {
			exibeErro('Não foi possível exibir alertas');
			return response.text().then(texto => console.error(texto));
		}
	})
	.then((json) => {
		if(!json)return;
		console.log(json)
		let componentes = json[0];
		console.log(componentes)
		let query_status = json[1];
		componentes.forEach((componente) => {
			console.log(componente)
			JSON.parse(componente.parametros).forEach((parametro) => {
				console.log(parametro)
			})
			JSON.parse(componente.leituras).forEach((leitura) => {
				console.log(leitura)
			})
			// document.getElementById('lista-alertas').innerHTML += `
            // // <article class="alerta">
            // //   <p id="alerta_${alerta.idAlerta}">
            // //     Máquina: <span>${alerta.maquina}</span> <br>
            // //     Nível: <span style="color: ${cor_alerta(alerta.nivel_num)};">${alerta.nivel_label}</span> <br>
            // //     Componente: <span>${alerta.componente}</span> <br>
            // //     Registro: <span>${alerta.leitura}</span> <br>
            // //     Horário: <span>${dataFormatada(alerta.data_hora)}</span>
            // //   </p>
            // // </article>
			// // `
		})
	})
	.catch((error) => {
		console.error(error);
	})
}

function exibirKpis() {
	fetch(`/maquinas/buscarKpisGeral/${idEmpresa}/${intervalo}`
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
					exibeErro('Não foi possível exibir KPIs');
					return resposta.text().then(texto => console.error(texto));
					
				}
			})
			.then((json) => {
				if(!json)return;
				let kpis = json[0][0];
				let query_status = json[1];
				console.log(json)
				console.log(kpis)
				// document.getElementById("kpi-maquinas-ativas").textContent=`${kpis.maquinas_ativas}/${kpis.maquinas_totais}`
				// document.getElementById("kpi-trafego-total").textContent=`${kpis.trafego_total_24h} Kbps`
				// document.getElementById("kpi-maquina-critica").textContent=`${kpis.nome_maquina}`
				// document.getElementById("qtd_ultimos_alertas").textContent=`${kpis.total_alertas}`
			})
			.catch((erro) => {
				console.error(erro);
			});
}
function exibirMaquinas() {
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
				return resposta.json();
			} else {
				exibeErro('Não foi possível exibir máquinas');
				return resposta.text().then(texto => console.error(texto));
			
			}
		})
		.then((json) => {
			if(!json)return;
			let maquinas = json[0];
			let query_status = json[1];
			console.log(json)
			console.log(maquinas)
			// if (maquinas.length > 0) {
			// 	maquinas.forEach(maquina => {
			// 		let alertas = maquina.qtd_alertas_24h;
			// 		let ativacao = maquina.ativacao;
			// 		let card = lista_maquinas.appendChild(document.createElement("article"));
			// 		card.setAttribute('class', 'card-maquina');
			// 		card.setAttribute('mac_address', maquina.mac_address);
	
			// 		let cardTitle = card.appendChild(document.createElement("h3"));
			// 		cardTitle.textContent += maquina.nome_maquina;
			// 		cardTitle.innerHTML += elem_bolinha(alertas, ativacao);
	
			// 		card.innerHTML += elem_status(alertas, ativacao);
			// 	});
			// } else {
			// 	let card = lista_maquinas.appendChild(document.createElement("article"));
			// 	card.setAttribute('class', 'card-maquina');
				
			// 	let cardTitle = card.appendChild(document.createElement("h3"));
			// 	cardTitle.textContent = "Você ainda não possui máquinas monitoradas"
			// }
		})
		.catch((erro) => {
			console.error(erro);
		});
}

function exibirAlertas() {
	fetch(`/alertas/buscarPorEmpresa/${idEmpresa}/${intervalo}`
	, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		}
	})
	.then((response) => {
		if (response.ok) {
			return response.json();
		} else {
			exibeErro('Não foi possível exibir alertas');
			return response.text().then(texto => console.error(texto));
		}
	})
	.then((json) => {
		if(!json)return;
		console.log(json)
		let alertas = json[0];
		console.log(alertas)
		// let query_status = json[1];
		// alertas.forEach((alerta) => {
		// 	document.getElementById('lista-alertas').innerHTML += `
        //     <article class="alerta">
        //       <p id="alerta_${alerta.idAlerta}">
        //         Máquina: <span>${alerta.maquina}</span> <br>
        //         Nível: <span style="color: ${cor_alerta(alerta.nivel_num)};">${alerta.nivel_label}</span> <br>
        //         Componente: <span>${alerta.componente}</span> <br>
        //         Registro: <span>${alerta.leitura}</span> <br>
        //         Horário: <span>${dataFormatada(alerta.data_hora)}</span>
        //       </p>
        //     </article>
		// 	`
		// })
	})
	.catch((error) => {
		console.error(error);
	})
}

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

function cor_alerta(nivel){
	if (nivel == 2) {
		return 'red'
	}
	if (nivel == 1) {
		return 'yellow'
	}
}

function dataFormatada (dataString) {
	const data = new Date(dataString);
	return data.toLocaleString();
}

function exibeErro(str) {alert(str)}