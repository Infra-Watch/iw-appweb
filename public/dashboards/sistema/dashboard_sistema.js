const idEmpresa = sessionStorage.ID_EMPRESA;
const intervalo = sessionStorage.INTERVALO_DIAS != undefined ? sessionStorage.INTERVALO_DIAS : 1;

const selectMaquinas = document.getElementById('maquina-exibe')
const painelGeral = document.getElementById('graficos')

window.addEventListener('load', () => {
	exibirMaquinas();
	plotarDashboard();
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

function exibirKpis() {
	const idMaquina = selectMaquinas.value;
	if (!idMaquina || idMaquina == 0) return;

	const bkp = document.querySelectorAll('.kpis .kpi b');

	bkp.forEach(b => b.innerHTML = '...');

	const url = `/sistema/kpis/${idEmpresa}/${idMaquina}?intervalo=${intervalo}`;

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

			if (bkp.length >= 4) {
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



