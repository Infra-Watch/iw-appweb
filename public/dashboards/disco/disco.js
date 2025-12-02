const idEmpresa = sessionStorage.ID_EMPRESA;
const intervalo = sessionStorage.INTERVALO_DIAS != undefined ? sessionStorage.INTERVALO_DIAS : 1;
const selectMaquinas = document.getElementById('maquina-exibe')

const kpiUso = document.getElementById('dado-kpi-uso')
const kpiLeitura = document.getElementById('dado-kpi-velocidade-leitura')
const kpiEscrita = document.getElementById('dado-kpi-velocidade-escrita')

let ultimosDias = []
let alertasCriticos = []
let alertasImportantes = []
let velocidade_leitura = []
let velocidade_escrita = []
let hora_captura_transf = []

var grafico_transf = null

selectMaquinas.addEventListener('change', () => {
    document.getElementById('grafico1').innerHTML = ''
    document.getElementById('grafico2').innerHTML = ''
    plotarDados();
})

function plotarDados() {
    if (selectMaquinas.value != 0) {
        atualizarKPIs();
        const intervaloKpi = setInterval(atualizarKPIs, 3000)
        carregarDadosGraficos();
    } else {
        kpiUso.innerHTML = "--% | --%"
        kpiEscrita.innerHTML = '--mb/s | --mb/s'
        kpiLeitura.innerHTML = '--mb/s | --mb/s'
    }
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

function atualizarKPIs() {
    const idMaquina = selectMaquinas.value
    fetch(`/disco/kpis/${idEmpresa}/${idMaquina}`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    kpiUso.innerHTML = `${resposta.uso_atual_porcentagem}% | ${resposta.uso_maximo_porcentagem}%`
                    kpiLeitura.innerHTML = `${resposta.velocidade_leitura_atual}mb/s | ${resposta.velocidade_leitura_media}mb/s`
                    kpiEscrita.innerHTML = `${resposta.velocidade_escrita_atual}mb/s | ${resposta.velocidade_escrita_media}mb/s`
                });
            } else {
                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

function carregarDadosGraficos() {
    const idMaquina = selectMaquinas.value
    fetch(`/disco/grafico_alertas/${idEmpresa}/${idMaquina}`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    ultimosDias = []
                    const formatarData = data => {
                        const date = new Date(data);
                        const dia = date.getDate().toString();
                        const mes = (date.getMonth() + 1).toString();
                        const ano = date.getFullYear().toString();
                        return `${dia}/${mes}/${ano}`;
                    };

                    for (let i = 0; i < resposta.length; i++) {
                        ultimosDias.push(formatarData(resposta[i].dia))
                        alertasCriticos.push(resposta[i].qtd_critico)
                        alertasImportantes.push(resposta[i].qtd_atencao)
                    }
                    plotarGraficoAlertas();
                });
            } else {
                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });

    fetch(`/disco/grafico_leitura/${idEmpresa}/${idMaquina}`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    hora_captura_transf = []
                    velocidade_leitura = []
                    velocidade_escrita = []

                    for (let i = 0; i < resposta.length; i++) {
                        hora_captura_transf.push(resposta[i].momento_grafico)
                        velocidade_leitura.push(resposta[i].velocidade_leitura)
                        velocidade_escrita.push(resposta[i].velocidade_escrita)
                    }

                    plotarGraficoDisco();
                    const intervaloPlotar = setInterval(() => {
                        plotarGraficoDisco()
                    }, 3000)
                });
            } else {
                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

function plotarGraficoDisco() {
    if (grafico_transf == null) {
        var optGraficoTransferencia = {
            series: [{
                name: "Velocidade de Leitura (MB/s)",
                data: velocidade_leitura
            },
            {
                name: 'Velocidade de Escrita (MB/s)', 
                data: velocidade_escrita
            }],
            chart: {
                height: 450,
                type: 'line',
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'straight'
            },
            title: {
                text: 'Velocidade de Transferência (I/O) do Disco (mb/s)',
                align: 'left'
            },
            grid: {
                row: {
                    colors: ['#f3f3f3', 'transparent'],
                    opacity: 0.5
                },
            },
            xaxis: {
                categories: hora_captura_transf,
                title: {
                    text: 'Horário da Captura'
                }
            },
            yaxis: {
                title: {
                    text: 'Velocidade (MB/s)'
                }
            }
        };

        grafico_transf = new ApexCharts(document.getElementById("grafico2"), optGraficoTransferencia);
        grafico_transf.render();
    } else {
        grafico_transf.updateOptions({
            series: [{
                name: "Velocidade de Leitura (MB/s)",
                data: velocidade_leitura,
            },
            {
                name: "Velocidade de Escrita (MB/s)",
                data: velocidade_escrita,
            }],
            xaxis: {
                categories: hora_captura_transf,
            },
        })
    }

}

function plotarGraficoAlertas() {
    var optContagemAlertas = {
        series: [{
            name: 'CRÍTICO',
            data: alertasCriticos
        }, {
            name: 'IMPORTANTE',
            data: alertasImportantes
        }],
        chart: {
            type: 'bar',
            height: 450,
            stacked: true,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            }
        },
        title: {
            text: 'Contagem de Alertas de Disco por Nível (7 Dias)',
            align: 'left'
        },
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0
                }
            }
        }],
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 10,
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'last',
                dataLabels: {
                    total: {
                        enabled: true,
                        style: {
                            fontSize: '13px',
                            fontWeight: 900
                        }
                    }
                }
            },
        },
        xaxis: {
            type: 'number',
            categories: ultimosDias,
        },
        legend: {
            position: 'right',
            offsetY: 40
        },
        fill: {
            opacity: 1,
            colors: ['#ff0000ff', '#ffee00aa']
        }
    };

    var grafico_nivel_alerta = new ApexCharts(document.getElementById("grafico1"), optContagemAlertas);
    grafico_nivel_alerta.render();
}