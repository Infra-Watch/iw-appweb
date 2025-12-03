const idEmpresa = sessionStorage.ID_EMPRESA;
const intervalo = sessionStorage.INTERVALO_DIAS != undefined ? sessionStorage.INTERVALO_DIAS : 1;

const selectMaquinas = document.getElementById('machines')
const painelGeral = document.getElementById('all-charts')

window.addEventListener('load', () => {
    exibirMaquinas();
    plotarDashboard();
});

selectMaquinas.addEventListener('change', () => {
    plotarDashboard();
});

function plotarDashboard() {
    if (selectMaquinas.value == 0) {
        painelGeral.innerHTML = `<h1> Selecione uma máquina para visualizar os detalhes! </h1>`
        return false;
    }
    exibirKpis();
    carregarGraficos();
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


// ATUALIZAÇÃO CONSTANTE DE DATA
const span = document.getElementById("date");
const agora = new Date();

const dataFormatada = agora.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
});

span.textContent = dataFormatada;


// ======= BUSCANDO KPIs =======
function exibirKpis() {
    const idMaquina = Number(selectMaquinas.value);

    if (!idMaquina) {
        console.warn("ID da máquina inválido:", selectMaquinas.value);
        return;
    }

    const bkp = document.querySelectorAll('#all-kpis .kpi b');
    bkp.forEach(b => b.innerHTML = '...');

    console.log(bkp);

    const url = `/cpu/kpis/${idEmpresa}/${idMaquina}?intervalo=1`;
    console.log(url);

    console.log("maquina selecionada = ", selectMaquinas.value);


    fetch(url)
        .then(res => res.ok ? res.json() : null)
        .then(json => {
            if (!json) {
                bkp.forEach(b => b.innerHTML = '_');
                return;
            }

            const usoMed = Number(json.porcentagem_uso_media) || 0;
            const freqMed = Number(json.frequencia_media) || 0;
            const tempMed = Number(json.temperatura_media) || 0;

            if (bkp.length >= 3) {
                bkp[0].innerHTML = `${usoMed.toFixed(2)}%`;
                bkp[1].innerHTML = `${freqMed.toFixed(2)}%`;
                bkp[2].innerHTML = `${tempMed.toFixed(2)}°C`;
            } else {
                document.querySelectorAll('#all-kpis .kpi').forEach(block => {
                    const text = (block.innerText || '').toLowerCase();
                    const b = block.querySelector('b');
                    if (!b) return;

                    if (text.includes('Porcentagem de Uso')) b.innerHTML = `${usoMed.toFixed(2)}%`;
                    if (text.includes('Frequência')) b.innerHTML = `${freqMed.toFixed(2)}%`;
                    if (text.includes('Temperatura')) b.innerHTML = `${tempMed.toFixed(2)}°C`;
                });
            }
        })
        .catch(err => {
            console.error(err);
            bkp.forEach(b => b.innerHTML = 'erro');
        });
}


// ======= BUSCANDO GRÁFICOS =======
function carregarGraficos() {
    const idMaquina = Number(selectMaquinas.value);

    fetch(`/cpu/graficos/${idEmpresa}/${idMaquina}`)
        .then(res => res.ok ? res.json() : null)
        .then(json => {
            if (!json) return;

            show_uso(
                json.uso.atual,
                json.uso.limite_amarelo,
                json.uso.limite_vermelho
            );

            show_frequencia(
                json.frequencia.atual,
                json.frequencia.limite_amarelo,
                json.frequencia.limite_vermelho
            );

            show_temperatura(
                json.temperatura.atual,
                json.temperatura.limite_amarelo,
                json.temperatura.limite_vermelho
            );
        })
        .catch(console.error);
}


//     ---       TODOS OS GRÁFICOS     ---


// ======= GRÁFICO DE PORCETAGEM DE USO =======
function show_uso(uso_atual, limite_amarelo_uso, limite_vermelho_uso) {

    const options_uso_cpu = {
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

        series: [{ data: [uso_atual] }],

        xaxis: { categories: ['Uso CPU'] },

        yaxis: { max: 100, min: 0 },

        dataLabels: { enabled: false },

        colors: ["#00E676"],

        annotations: {
            yaxis: [
                {
                    y: limite_amarelo_uso,
                    borderColor: '#FFB300',
                    label: { text: `Aquecendo (${limite_amarelo_uso}%)` }
                },
                {
                    y: limite_vermelho_uso,
                    borderColor: '#E53935',
                    label: { text: `Crítico (${limite_vermelho_uso}%)` }
                }
            ]
        }
    };

    if (window.graficoUso) window.graficoUso.destroy();

    window.graficoUso = new ApexCharts(
        document.querySelector("#porcetagem_uso"),
        options_uso_cpu
    );

    window.graficoUso.render();

    setInterval(async () => {
        const resposta = await fetch(`/cpu/kpis/${idEmpresa}/${idMaquina}`);
        const json = await resposta.json();

        const novoUso = json.ultima_leitura;

        let cor = "#00E676";
        if (novoUso >= limite_amarelo_uso && novoUso < limite_vermelho_uso) cor = "#FFB300";
        if (novoUso >= limite_vermelho_uso) cor = "#E53935";

        window.graficoUso.updateOptions({ colors: [cor] });
        window.graficoUso.updateSeries([{ data: [novoUso] }]);
    }, 1000);
}


// ======= GRÁFICO DE FREQUÊNCIA =======
function show_frequencia(frequencia_inicial, limite_amarelo_freq, limite_vermelho_freq) {

    let data = [{
        x: Date.now(),
        y: frequencia_inicial
    }];

    let lastDate = Date.now();
    const XAXISRANGE = 60000;

    const options_freq_cpu = {
        series: [{ data: data.slice() }],

        chart: {
            id: 'frequencia_cpu',
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
                    y: limite_amarelo_freq,
                    borderColor: '#FFB300',
                    label: { text: `Aquecendo (${limite_amarelo_freq}%)` }
                },
                {
                    y: limite_vermelho_freq,
                    borderColor: '#E53935',
                    label: { text: `Crítico (${limite_vermelho_freq}%)` }
                }
            ]
        }
    };

    const freq_cpu = new ApexCharts(
        document.querySelector("#frequencia"),
        options_freq_cpu
    );

    freq_cpu.render();

    setInterval(async () => {
        const resposta = await fetch(`/cpu/kpis/${idEmpresa}/${idMaquina}`);
        const json = await resposta.json();

        const freq_atual = json.ultima_leitura;

        lastDate += 1000;
        data.push({ x: lastDate, y: freq_atual });
        if (data.length > 60) data.shift();

        let cor = "#00E676";
        if (freq_atual >= limite_amarelo_freq && freq_atual < limite_vermelho_freq) cor = "#FFB300";
        if (freq_atual >= limite_vermelho_freq) cor = "#E53935";

        freq_cpu.updateOptions({ colors: [cor] });

        freq_cpu.updateSeries([{ data: data }]);

    }, 1000);
}


// ======= GRÁFICO TEMPERATURA =======
function show_temperatura(temp_inicial, limite_amarelo_temp, limite_vermelho_temp) {

    let data = [temp_inicial];

    const options_temp_cpu = {
        chart: {
            id: "temperatura_cpu",
            type: 'line',
            height: 230,
            width: 650,
            animations: {
                enabled: true,
                easing: 'linear',
                animateGradually: { enabled: false },
                dynamicAnimation: { enabled: false }
            },
            toolbar: { show: false },
            zoom: { enabled: false }
        },

        series: [{
            name: "CPU Temp (°C)",
            data: data.slice()
        }],

        stroke: {
            width: 3,
            curve: 'smooth'
        },

        title: {
            text: 'Temperatura CPU',
            align: 'center'
        },

        xaxis: { labels: { show: false } },

        yaxis: {
            min: 20,
            max: 100,
            tickAmount: 5,
            labels: { formatter: v => v + "°C" }
        },

        colors: ["#00E676"],

        annotations: {
            yaxis: [
                {
                    y: limite_amarelo_temp,
                    borderColor: '#FFB300',
                    label: { text: `Aquecendo (${limite_amarelo_temp}°C)` }
                },
                {
                    y: limite_vermelho_temp,
                    borderColor: '#E53935',
                    label: { text: `Crítico (${limite_vermelho_temp}°C)` }
                }
            ]
        }
    };

    const temp_cpu = new ApexCharts(
        document.querySelector("#temperatura"),
        options_temp_cpu
    );

    temp_cpu.render();

    setInterval(async () => {
        const resposta = await fetch(`/cpu/temperatura/${idEmpresa}/${idMaquina}`);
        const json = await resposta.json();

        const novaTemp = json.ultima_leitura;

        let cor = "#00E676";
        if (novaTemp >= limite_amarelo_temp && novaTemp < limite_vermelho_temp) cor = "#FFB300";
        if (novaTemp >= limite_vermelho_temp) cor = "#E53935";

        temp_cpu.updateOptions({ colors: [cor] });

        data.push(novaTemp);
        if (data.length > 50) data.shift();

        temp_cpu.updateSeries([{ data: data }]);
    }, 1000);
}