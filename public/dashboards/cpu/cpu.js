const idEmpresa = sessionStorage.ID_EMPRESA;
const intervalo = sessionStorage.INTERVALO_DIAS != undefined ? sessionStorage.INTERVALO_DIAS: 1;

const selectMaquinas = document.getElementById('machines')
const painelGeral = document.getElementById('all-charts')

window.addEventListener('load', () => {
	exibirMaquinas();
	plotarDashboard();
});

selectMaquinas.addEventListener('change', () => {
	plotarDashboard();
});

function plotarDashboard () {
	if (selectMaquinas.value == 0) {
		painelGeral.innerHTML = `<h1> Selecione uma máquina para visualizar os detalhes! </h1>`
		return false;
	} else {
		exibirKpis();
	}
};

// ======= BUSCANDO MÁQUINAS PARA SELECT OPTION =======
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


// ======= BUSCANDO KPIs =======
function exibirKpis() {
	const idMaquina = selectMaquinas.value;
	if(!idMaquina || idMaquina == 0) return;

	const bkp = document.querySelectorAll('#all-kpis #kpi b');

	bkp.forEach(b => b.innerHTML = '...');

	const url = `/ram/kpis/${idEmpresa}/${idMaquina}`;
	console.log(url)

	fetch(url)
	.then(res => {
		if(!res.ok) return null;
		return res.json();
	})
	.then(json => {
		if (!json) {
			bkp.forEach(b => b.innerHTML = '_');
			return;
		}
		console.log(json);
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

// --------------------------------------------------
//                TODOS OS GRÁFICOS
// --------------------------------------------------

// ======= GRÁFICO DE PORCETAGEM DE USO =======
let usoAtual = 40;

var options_uso_cpu = {
    chart: {
        type: 'bar',
        height: 500,
        animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: { speed: 200 }
        },
        toolbar: { show: false }
    },

    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '60%',
            borderRadius: 4
        }
    },

    series: [{
        data: [usoAtual]
    }],

    xaxis: { categories: ['Uso CPU'] },

    yaxis: {
        max: 100,
        min: 0
    },

    dataLabels: { enabled: false },

    colors: ["#00E676"],

    annotations: {
        yaxis: [
            {
                y: 60,
                borderColor: '#FFB300',
                label: { text: 'Aquecendo (60%)' }
            },
            {
                y: 80,
                borderColor: '#E53935',
                label: { text: 'Crítico (80%)' }
            }
        ]
    }
};

var uso_cpu = new ApexCharts(document.querySelector("#porcetagem_uso"), options_uso_cpu);
uso_cpu.render();

setInterval(() => {
    usoAtual = Math.floor(Math.random() * 100);

    let cor = "#00E676";
    if (usoAtual >= 60 && usoAtual < 80) cor = "#FFB300";
    if (usoAtual >= 80) cor = "#E53935";

    uso_cpu.updateOptions({ colors: [cor] });
    uso_cpu.updateSeries([{ data: [usoAtual] }]);
}, 1000);


// ======= GRÁFICO DE FREQUÊNCIA ======= 
let data = [];
let lastDate = new Date().getTime();
const XAXISRANGE = 60000;

for (let i = 0; i < 10; i++) {
    data.push({
        x: lastDate,
        y: Math.floor(Math.random() * 80) + 10
    });
    lastDate += 1000;
}

function getNewPoint() {
    lastDate += 1000;
    const y = Math.floor(Math.random() * 90) + 10;

    data.push({ x: lastDate, y });
    if (data.length > 60) data.shift();

    return y;
}

var options_freq_cpu = {
    series: [{ data: data.slice() }],

    chart: {
        id: 'realtime',
        height: 239,
        width: 650,
        type: 'area',
        animations: {
            enabled: true,
            easing: 'linear',
            animateGradually: { enabled: false },
            dynamicAnimation: { enabled: false }
        },
        toolbar: { show: false },
        zoom: { enabled: false }
    },

    colors: ["#00E676"],

    dataLabels: { enabled: false },

    stroke: { curve: 'smooth' },

    title: { text: 'Frequência CPU', align: 'center' },

    markers: { size: 0 },

    xaxis: {
        type: 'datetime',
        range: XAXISRANGE
    },

    yaxis: {
        min: 0,
        max: 100
    },

    annotations: {
        yaxis: [
            {
                y: 60,
                borderColor: '#FFB300',
                label: { text: 'Aquecendo (60%)' }
            },
            {
                y: 80,
                borderColor: '#E53935',
                label: { text: 'Crítico (80%)' }
            }
        ]
    }
};

var freq_cpu = new ApexCharts(document.querySelector("#frequencia"), options_freq_cpu);
freq_cpu.render();

setInterval(() => {
    const ultimoValor = getNewPoint();

    let cor = "#00E676";
    if (ultimoValor >= 60 && ultimoValor < 80) cor = "#FFB300";
    if (ultimoValor >= 80) cor = "#E53935";

    freq_cpu.updateOptions({ colors: [cor] });

    freq_cpu.updateSeries([{ data }]);
}, 1000);


// ======= GRÁFICO TEMPERATURA =======
let temperaturaAtual = 55;

const options_temp_cpu = {
    chart: {
        type: 'line',
        height: 230,
        width: 650,
        animations: {
            enabled: true,
            easing: 'linear',
            animateGradually: { enabled: false },
            dynamicAnimation: { enabled: false }
        },
    },
    series: [{
        name: "CPU Temp (°C)",
        data: [temperaturaAtual]
    }],
    stroke: {
        width: 3,
        curve: 'smooth'
    },
    title: {
        text: 'Temperatura CPU',
        align: 'center'
    },
    zoom: { enabled: false },
    xaxis: { labels: { show: false } },
    yaxis: {
        min: 20,
        max: 100,
        tickAmount: 5,
        labels: { formatter: v => v + "°C" }
    },
    colors: ["#136ebdff"],
    annotations: {
        yaxis: [
            { y: 60, borderColor: '#FFB300', label: { text: 'Aquecendo (60°C)' } },
            { y: 80, borderColor: '#E53935', label: { text: 'Crítico (80°C)' } }
        ]
    }
};

const temp_cpu = new ApexCharts(document.querySelector("#temperatura"), options_temp_cpu);
temp_cpu.render();

setInterval(() => {
    temperaturaAtual = 40 + Math.random() * 45;

    let cor = "#00E676";
    if (temperaturaAtual >= 60 && temperaturaAtual < 80) cor = "#FFB300";
    if (temperaturaAtual >= 80) cor = "#E53935";

    temp_cpu.updateOptions({ colors: [cor] });

    const novaSerie = [
        ...options_temp_cpu.series[0].data,
        temperaturaAtual
    ].slice(-50);

    options_temp_cpu.series[0].data = novaSerie;

    temp_cpu.updateSeries([{ data: novaSerie }]);
}, 1000);