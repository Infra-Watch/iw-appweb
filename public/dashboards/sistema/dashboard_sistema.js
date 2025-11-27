const idEmpresa = sessionStorage.ID_EMPRESA;
const intervalo = sessionStorage.INTERVALO_DIAS != undefined ? sessionStorage.INTERVALO_DIAS: 1;

const selectMaquinas = document.getElementById('maquina-exibe')
const painelGeral = document.getElementById('graficos')

window.addEventListener('load', () => {
	exibirMaquinas();
	plotarDashboard();
});

selectMaquinas.addEventListener('change', () => {
	plotarDashboard();
});

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
				document.getElementById("kpi-maquinas-ativas").textContent=`${kpis.maquinas_ativas}/${kpis.maquinas_totais}`
				document.getElementById("kpi-trafego-total").textContent=`${kpis.trafego_total_24h} Kbps`
				document.getElementById("kpi-maquina-critica").textContent=`${kpis.nome_maquina}`
				document.getElementById("qtd_ultimos_alertas").textContent=`${kpis.total_alertas}`
			})
			.catch((erro) => {
				console.error(erro);
			});
}

function plotarDashboard () {
	if (selectMaquinas.value == 0) {
		painelGeral.innerHTML = `<h1>Selecione uma máquina para visualizar os detalhes</h1>`
		return false;
	} else {
		exibirKpis();
		exibirAlertas();
		exibirComponentes();
	}
};

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
			maquinas.forEach(maquina => {
				selectMaquinas.innerHTML += `<option value="${maquina.idMaquina}">${maquina.nome_maquina} | ${maquina.mac_address}</option>`
			});
		})
		.catch((erro) => {
			console.error(erro);
		});
}



