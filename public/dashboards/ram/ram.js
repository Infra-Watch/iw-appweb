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

function plotarDashboard () {
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

function exibirKpis() {
	const idMaquina = selectMaquinas.value;
	if(!idMaquina || idMaquina == 0) return;

	const bkp = document.querySelectorAll('.kpis .kpi b');

	bkp.forEach(b => b.innerHTML = '...');

	const url = `/ram/kpis/${idEmpresa}/${idMaquina}?intervalo=${intervalo}`;

	fetch(url)
	.then(res => {
		if(!res.ok) return null;
		return res.json();
	})
	.then(json => {
		if (!json) {
			bkp.forEach(b => b.innerHTML = '-');
			return;
		}

		const percentMax = Number(json.porcentagem_uso_maxima) || 0;
		const percentMed = Number(json.porcentagem_uso_media) || 0;
		const gigaMax = Number(json.utilizacao_gb_maxima) || 0;
		const gigaMed = Number(json.utilizacao_gb_media) || 0;

		if (bkp.length >= 4) {
			bkp[0].innerHTML = `${percentMax.toFixed(2)}%`
			bkp[1].innerHTML = `${percentMed.toFixed(2)}%`
			bkp[2].innerHTML = `${gigaMax.toFixed(2)} GB`
			bkp[3].innerHTML = `${gigaMed.toFixed(2)} GB`
		}else{
			document.querySelectorAll('.kpis .kpi').forEach(block =>{
				const text = (block.innerHTML || '').toLowerCase();
				const b = block.querySelector('b');
				if (!b) return;
				if (text.includes('Porcentagem de uso máxima')) b.innerHTML = `${percentMax.toFixed(2)}%`
				if (text.includes('Porcentagem de uso médio')) b.innerHTML = `${percentMed.toFixed(2)}%`
				if(text.includes('Utilização em gigabytes máxima')) b.innerHTML = `${gigaMax.toFixed(2)} GB`
				if(text.includes('Utilização em gigabytes médai')) b.innerHTML = `${gigaMed.toFixed(2)} GB`
			})
		}
	})
	.catch(err => {
		console.error(err);
		bkp.forEach(b => b.innerHTML = 'erro');
	});
}



