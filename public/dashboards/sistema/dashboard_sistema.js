const idEmpresa = sessionStorage.ID_EMPRESA;
const intervalo = sessionStorage.INTERVALO_DIAS != undefined ? sessionStorage.INTERVALO_DIAS : 1;

const selectMaquinas = document.getElementById('maquina-exibe')
const painelGeral = document.getElementById('main-painel-graficos')

window.addEventListener('load', () => {
	exibirMaquinas().then(() => {
		plotarDashboard();
	});
});

selectMaquinas.addEventListener('change', () => {
	plotarDashboard();
});

function plotarDashboard() {
	if (selectMaquinas.value == 0) {
		painelGeral.innerHTML = `<h1>Selecione uma máquina para visualizar os detalhes</h1>`
		return false;
	} else {
		exibirKpis();
	}
};

function exibirMaquinas() {
	return fetch(`/maquinas/buscarPorEmpresa/${idEmpresa}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		}
	})
		.then((resposta) => {
			if (resposta.ok) {
				return resposta.json();
			} else {
				exibeErro('Não foi possível exibir máquinas');
				return resposta.text().then(texto => console.error(texto));
			}
		})
		.then((json) => {
			if (!json) return;
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
			if (!json) return;
			console.log(json)
			let alertas = json[0];
			console.log(alertas)
			let query_status = json[1];
			alertas.forEach((alerta) => {
				document.getElementById('lista-alertas').innerHTML += `
            <article class="alerta">
             <p id="alerta_${alerta.idAlerta}">
               Máquina: <span>${alerta.maquina}</span> <br>
                Nível: <span style="color: ${cor_alerta(alerta.nivel_num)};">${alerta.nivel_label}</span> <br>
                Componente: <span>${alerta.componente}</span> <br>
                Registro: <span>${alerta.leitura}</span> <br>
                 Horário: <span>${dataFormatada(alerta.data_hora)}</span>
               </p>
             </article>
		 	`
			})
		})
		.catch((error) => {
			console.error(error);
		})
}

function exibirKpis() {
	const idMaquina = selectMaquinas.value;
	if (!idMaquina || idMaquina == 0) return;

	const bkp = document.querySelectorAll('.kpis .kpi b');

	bkp.forEach(b => b.innerHTML = '...');

	const url = `/sistema/kpis/${idEmpresa}/${idMaquina}`;

	fetch(url)
		.then(res => {
			if (!res.ok) return null;
			return res.json();
		})
		.then(json => {
			if (!json) {
				bkp.forEach(b => b.innerHTML = '-');
				return;
			}

			const processosMax = Number(json.qtd_processos_maxima) || 0;
			const processosMed = Number(json.qtd_processos_media) || 0;
			const threadsMax = Number(json.qtd_threads_maxima) || 0;
			const threadsMed = Number(json.qtd_threads_media) || 0;
			const servicosMax = Number(json.qtd_servicos_maxima) || 0;
			const servicosMed = Number(json.qtd_servicos_media) || 0;

			if (bkp.length >= 6) {
				bkp[0].innerHTML = `${processosMax}`
				bkp[1].innerHTML = `${processosMed}`
				bkp[2].innerHTML = `${threadsMax}`
				bkp[3].innerHTML = `${threadsMed}`
				bkp[4].innerHTML = `${servicosMax}`
				bkp[5].innerHTML = `${servicosMed}`
			} else {
				document.querySelectorAll('.kpis .kpi').forEach(block => {
					const text = (block.innerHTML || '').toLowerCase();
					const b = block.querySelector('b');
					if (!b) return;
					if (text.includes('Quantidade de Processos máxima')) b.innerHTML = `${processosMax}`
					if (text.includes('Quantidade de Processos média')) b.innerHTML = `${processosMed}`
					if (text.includes('Quantidade de Threads máxima')) b.innerHTML = `${threadsMax}`
					if (text.includes('Quantidade de Threads média')) b.innerHTML = `${threadsMed}`
					if (text.includes('Quantidade de Serviços máxima')) b.innerHTML = `${servicosMax}`
					if (text.includes('Quantidade de Serviços média')) b.innerHTML = `${servicosMed}`
				})
			}
		})
		.catch(err => {
			console.error(err);
			bkp.forEach(b => b.innerHTML = 'erro');
		});
}

function graficos(componentes) {
	let ultimaProcessos = getUltimaLeitura(componentes.processos);
	let ultimaServicos = getUltimaLeitura(componentes.servicos);
	let ultimaThreads = getUltimaLeitura(componentes.threads);
	let valoresProcessos = getLeituras(componentes.processos)
	let valoresServicos = getLeituras(componentes.servicos)
	let valoresThreads = getLeituras(componentes.threads)

	letoptions_sistema = document.getElementById("chart-apex-processos-sistema");
	let options_sistema = {
		series: [{
			name: 'Frequência',
			type: 'column',
			data: [valoresProcessos]
		}, {
			name: 'Social Media',
			type: 'line',
			data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
		}],
		chart: {
			height: 350,
			type: 'line',
		},
		stroke: {
			width: [0, 4]
		},
		title: {
			text: 'Traffic Sources'
		},
		dataLabels: {
			enabled: true,
			enabledOnSeries: [1]
		},
		labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
		yaxis: [{
			title: {
				text: 'Website Blog',
			},

		}, {
			opposite: true,
			title: {
				text: 'Social Media'
			}
		}]
	};

	var chart = new ApexCharts(options_sistema, options_sistema);
	chart.render();

	let grafico_servicos = document.getElementById("chart-apex-servicos-sistema");
	let options_sistema2 = {
		series: [{
			data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
		}],
		chart: {
			type: 'bar',
			height: 350
		},
		plotOptions: {
			bar: {
				borderRadius: 4,
				borderRadiusApplication: 'end',
				horizontal: true,
			}
		},
		dataLabels: {
			enabled: false
		},
		xaxis: {
			categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
				'United States', 'China', 'Germany'
			],
		}
	};

	var chart = new ApexCharts(grafico_servicos, options_sistema2);
	chart.render();

	let grafico_threads = document.getElementById("chart-apex-threads-sistema");
	let options_sistema3 = {
		series: [{
			name: 'Frequência',
			type: 'column',
			data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
		}, {
			name: 'Social Media',
			type: 'line',
			data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
		}],
		chart: {
			height: 350,
			type: 'line',
		},
		stroke: {
			width: [0, 4]
		},
		title: {
			text: 'Traffic Sources'
		},
		dataLabels: {
			enabled: true,
			enabledOnSeries: [1]
		},
		labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
		yaxis: [{
			title: {
				text: 'Website Blog',
			},

		}, {
			opposite: true,
			title: {
				text: 'Social Media'
			}
		}]
	};

	var chart = new ApexCharts(grafico_threads, options_sistema3);
	chart.render();
}