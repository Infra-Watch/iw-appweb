const idEmpresa = sessionStorage.ID_EMPRESA;
const intervalo = sessionStorage.INTERVALO_DIAS != undefined ? sessionStorage.INTERVALO_DIAS: 1;

const selectMaquinas = document.getElementById('maquina-exibe')
const painelGeral = document.getElementById('main-painel-graficos')

window.addEventListener('load', () => {
	exibirMaquinas();
	plotarDashboard();
});

selectMaquinas.addEventListener('change', () => {
	plotarDashboard();
});

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

function exibirComponentes() {
	let idMaquina = selectMaquinas.value;
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
		painelGeral.innerHTML = painel;
		graficos(componentes);
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

const painel = `
            <section class="graficos">

                <!-- SIMULAÇÃO CPU -->
                <div class="graficos-componentes">

                    <article class="grafico-gauge-chart">

                        <p> Uso de <span id="componente"> CPU </span> % </p>

                        <div id="chart-apex-gauge-cpu"></div>

                    </article>

                    <article class="card-grafico">

                        <p> Temperatura da <span id="componente"> CPU </span> (°C) </p>

                        <div id="chart-apex-temp-cpu"></div>

                    </article>

                    <article class="card-grafico">

                        <p> Frequencia da <span id="componente"> CPU </span> (MHz) </p>

                        <div id="chart-apex-freq-cpu"></div>

                    </article>

                </div>

                <!-- SIMULAÇÃO REDE -->
                <div class="graficos-componentes">

                    <article class="grafico-gauge-chart">

                        <p> Uso de <span id="componente"> Disco </span> % </p>

                        <div id="chart-apex-gauge-disco"></div>

                    </article>

                    <article class="card-grafico">

                        <p> Velocidade de <span id="componente"> Disco </span> - Mbps </p>

                        <div id="chart-apex-vel-disco"></div>

                    </article>

                    <article class="card-grafico">

                        <p> Nível de <span id="componente"> Mbps Envidados </span> </p>

                        <div id="chart-apex-env-mbps"></div>

                    </article>


                </div>

                <!-- SIMULAÇÃO RAM -->
                <div class="graficos-componentes">

                    <article class="grafico-gauge-chart">

                        <p> Uso de <span id="componente"> RAM </span> % </p>

                        <div id="chart-apex-gauge-ram"></div>

                    </article>

                    <article class="card-grafico">

                        <p> Memória <span id="componente"> RAM </span> - Em uso </p>

                        <div id="chart-apex-uso-ram"></div>

                    </article>

                    <article class="card-grafico">

                        <p> Nível de <span id="componente"> Mbps Recebidos </span> </p>

                        <div id="chart-apex-rec-mbps"></div>

                    </article>

                </div>

            </section>


            <!-- ALERTAS -->
            <section id="alertas">

                <article class="kpi">

                    <img class="icons" src="assets/imagens/alarme.png ">

                    <div id="conteudo-kpi">
                        <h2> Alertas Totais: <span id="qtd_ultimos_alertas"> 1 </span> </h2>
                        <p> Tempo: últimas 24 horas </p>
                    </div>

                </article>

                <p>Todos os últimos alertas:</p>

                <article class="alerta">
                    <p>
                        Máquina: <span id="maquina_alerta"> 3 </span> <br>
                        Componente crítico: <span id="componente_critico"> CPU </span> <br>
                        Registro de pico: <span id="registro_pico"> 95% </span> <br>
                        Momento: <span id="momento_pico"> 13h53min </span>
                    </p>
                </article>

            </section>
`