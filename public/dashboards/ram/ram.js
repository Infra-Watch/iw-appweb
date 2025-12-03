const idEmpresa = sessionStorage.ID_EMPRESA;
const intervalo = sessionStorage.INTERVALO_DIAS != undefined ? sessionStorage.INTERVALO_DIAS : 1;
const selectMaquinas = document.getElementById('maquina-exibe')

window.addEventListener('load', () => {
    exibirMaquinas();
    plotarDashboard();
});

selectMaquinas.addEventListener('change', () => {
    plotarDashboard();
});

function plotarDashboard() {
    if (selectMaquinas.value == 0) {
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
    var idMaquina = selectMaquinas.value;
    var idMaquina = Number(idMaquina)
    if (!idMaquina || idMaquina == 0) return;
    console.log(idMaquina)
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
            console.log(typeof idEmpresa)
            console.log(typeof idMaquina)
            console.log(typeof intervalo)
            fetch(`/ram/componentes/${idEmpresa}/${idMaquina}/${intervalo}`)
                .then(resComp => resComp.ok ? resComp.json() : null)
                .then(componentesJson => {
                    console.log(componentesJson)
                    if (componentesJson && componentesJson.length) {
                        plotHistoricoPorcentagem( idMaquina); 
                         plotHistoricoGb( idMaquina); 
                         plotPrevisaoRam( idMaquina); 
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

let chartPercent = null;
let chartGb = null;
let chartPrev = null;

function conversaoChaveValor(json, campoValor) {
    const serie = [];                               
    for (let i = 0; i < json.length; i++) {       
        const item = json[i];                       
        const ts = new Date(item.data_hora || item.hora).getTime();  
        const val = Number(item[campoValor]);                       
        serie.push([ts, val]);                                   
    }                                                            
    return serie;                                               
}

async function plotHistoricoGb(idMaquina) {
    const url = `/ram/historico-gb/${idEmpresa}/${idMaquina}/${intervalo}`;

    try {
        const res = await fetch(url);
        if (!res.ok) return;

        const json = await res.json();
        if (!json.length) return;

        const dados = conversaoChaveValor(json, "valor");

        if (chartGb) chartGb.destroy();

        chartGb = new ApexCharts(
            document.querySelector("#grafico-apex-linha-gb"),
            {
                chart: { type: "area", height: 230,foreColor: "#999", stacked: false},
                series: [{ name: "Uso de RAM (GB)", data: dados }],
                xaxis: { type: "datetime" },
                dataLabels: { enabled: false },
                colors: ['#5FB7BA'],
                title: {text: 'Uso de Ram em gigabytes(GB) por horário' , align: 'left'}
            }
        );

        chartGb.render();
    } catch (err) {
        console.error("Erro:", err);
    }
}

async function plotHistoricoPorcentagem(idMaquina) {
    const url = `/ram/historico-porcentagem/${idEmpresa}/${idMaquina}/${intervalo}`;

    try {
        const res = await fetch(url);
        if (!res.ok) return;

        const json = await res.json();
        if (!json.length) return;

        const dados = conversaoChaveValor(json, "valor");

        if (chartPercent) chartPercent.destroy();

        chartPercent = new ApexCharts(
            document.querySelector("#grafico-apex-area-porcentagem"),
            {
                chart: { type: "area", height: 230 },
                series: [{ name: "Previsão de uso por hora", data: dados }],
                xaxis: { type: "datetime" },
                dataLabels: { enabled: false },
                colors: ['#5FB7BA'],
                title: {text: 'Porcentagem de uso por horário' , align: 'left'}

            }
        );

        chartPercent.render();
    } catch (err) {
        console.error("Erro:", err);
    }
}

   async function plotPrevisaoRam(idMaquina) {
    const url = `/ram/previsao-uso-ram/${idEmpresa}/${idMaquina}/${intervalo}`;

    try {
        const res = await fetch(url);
        if (!res.ok) return;

        const json = await res.json();
        if (!json.length) return;

        const dados = conversaoChaveValor(json, "media_leitura");

        if (chartPrev) chartPrev.destroy();

        chartPrev = new ApexCharts(
            document.querySelector("#grafico-apex-previsao-uso-ram"),
            {
                chart: { type: "bar", height: 250 },
                series: [{ name: "Previsão (%)", data: dados }],
                xaxis: { type: "datetime" },
                dataLabels: { enabled: false },
                colors: ['#5FB7BA'],
                title: {text: 'Média do uso (%) por dia', align: 'center'}
            }
        );

        chartPrev.render();
    } catch (err) {
        console.error("Erro:", err);
    }
}
