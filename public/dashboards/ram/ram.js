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

    const url = `/ram/kpis/${idEmpresa}/${idMaquina}`;
    console.log(url)

    fetch(url)
        .then(res => {
            if (!res.ok) return null;
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
            } else {
                document.querySelectorAll('.kpis .kpi').forEach(block => {
                    const text = (block.innerHTML || '').toLowerCase();
                    const b = block.querySelector('b');
                    if (!b) return;
                    if (text.includes('Porcentagem de uso máxima')) b.innerHTML = `${percentMax.toFixed(2)}%`
                    if (text.includes('Porcentagem de uso médio')) b.innerHTML = `${percentMed.toFixed(2)}%`
                    if (text.includes('Utilização em gigabytes máxima')) b.innerHTML = `${gigaMax.toFixed(2)} GB`
                    if (text.includes('Utilização em gigabytes médai')) b.innerHTML = `${gigaMed.toFixed(2)} GB`
                })
            }
            fetch(`/ram/componentes/${idEmpresa}/${idMaquina}/${intervalo}`)
                .then(resComp => resComp.ok ? resComp.json() : null)
                .then(componentesJson => {
                    if (componentesJson && componentesJson.length) {
                        gerarGraficosRam(componentesJson);
                    } else {
                        console.warn('Não há componentes para plotar gráficos de RAM');
                    }
                })
                .catch(console.error);
        })
        .catch(err => {
            console.error(err);
            bkp.forEach(b => b.innerHTML = 'erro');
        });
}

let chartAreaPorcentagem = null;
let chartLinhaGb = null;
let chartPrevisaoUsoRam = null;

function gerarGraficosRam(componentesArray) {
    const componentes = {};
    componentesArray.forEach(c => {
        try { componentes[c.nome] = JSON.parse(c.leituras); }
        catch (e) { componentes[c.nome] = c.leituras || []; }
    });

    const leiturasPorcentagemRam = componentes.ram_uso_porcentagem || [];
    const leiturasRamGb = componentes.ram_uso_gb || [];

    const porcentagensRam = leiturasPorcentagemRam.map(p => Math.round(Number(p.valor)));
    const usoRamGb = leiturasRamGb.map(p => Math.round(Number(p.valor) * 100) / 100);

    // --- Gráfico Área (% RAM) ---
    const graficoAreaPorcentagem = document.getElementById("grafico-apex-area-porcentagem");
    if (graficoAreaPorcentagem) {
        if (chartAreaPorcentagem) chartAreaPorcentagem.destroy(); // limpa anterior
        const opcoesGraficoArea = {
            chart: { type: 'area', height: 260 },
            series: [{ name: 'Porcentagem de Uso de RAM', data: porcentagensRam }],
            xaxis: { categories: Array.from({ length: porcentagensRam.length }, (_, i) => i + 1) },
            title: { text: 'Uso de RAM (%) ao longo do tempo' },
        };
        chartAreaPorcentagem = new ApexCharts(graficoAreaPorcentagem, opcoesGraficoArea);
        chartAreaPorcentagem.render();
    }

    // --- Gráfico Linha (GB RAM) ---
    const graficoLinhaGb = document.getElementById("grafico-apex-linha-gb");
    if (graficoLinhaGb) {
        if (chartLinhaGb) chartLinhaGb.destroy(); // limpa anterior
        const opcoesGraficoLinha = {
            chart: { type: 'line', height: 260 },
            series: [{ name: 'Utilização de RAM (GB)', data: usoRamGb }],
            xaxis: { categories: Array.from({ length: usoRamGb.length }, (_, i) => i + 1) },
            title: { text: 'Utilização de RAM (GB) ao longo do tempo' },
        };
        chartLinhaGb = new ApexCharts(graficoLinhaGb, opcoesGraficoLinha);
        chartLinhaGb.render();
    }

    // --- Gráfico Previsão ---
    const graficoPrevisaoUsoRam = document.getElementById("grafico-apex-previsao-uso-ram");
    if (graficoPrevisaoUsoRam) {
        if (chartPrevisaoUsoRam) chartPrevisaoUsoRam.destroy(); // limpa anterior
        const xs = [], ys = [];
        leiturasPorcentagemRam.forEach(l => {
            const d = new Date(l.data_hora);
            if (!isNaN(d)) {
                xs.push(d.getTime() / (1000 * 60 * 60));
                ys.push(Number(l.valor));
            }
        });

        const horasPrevisao = 24;
        const labelsPrevisao = [], valoresPrevisao = [];
        if (xs.length >= 2) {
            const { m, b } = regressaoLinear(xs, ys);
            const ultimaHora = xs[xs.length - 1];
            for (let i = 1; i <= horasPrevisao; i++) {
                const t = ultimaHora + i;
                const previsao = m * t + b;
                const previsaoClamped = Math.max(0, Math.min(100, Math.round(previsao * 100) / 100));
                labelsPrevisao.push(`+${i}h`);
                valoresPrevisao.push(previsaoClamped);
            }
        } else {
            const ultimoValor = ys.length ? ys[ys.length - 1] : 0;
            for (let i = 1; i <= horasPrevisao; i++) {
                labelsPrevisao.push(`+${i}h`);
                valoresPrevisao.push(ultimoValor);
            }
        }

        const opcoesGraficoPrevisao = {
            chart: { type: 'line', height: 260 },
            series: [{ name: 'Previsão % Uso RAM', data: valoresPrevisao }],
            xaxis: { categories: labelsPrevisao },
            title: { text: 'Previsão de Uso (RAM) por Hora - próximas 24h (modelo linear simples)' },
            yaxis: { min: 0, max: 100 },
        };
        chartPrevisaoUsoRam = new ApexCharts(graficoPrevisaoUsoRam, opcoesGraficoPrevisao);
        chartPrevisaoUsoRam.render();
    }
}
