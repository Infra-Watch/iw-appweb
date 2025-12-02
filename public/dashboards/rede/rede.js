const idEmpresa = sessionStorage.ID_EMPRESA;
const intervalo = sessionStorage.INTERVALO_DIAS != undefined ? sessionStorage.INTERVALO_DIAS : 1;

const selectMaquinas = document.getElementById('maquina-exibe')
const throughput = document.getElementById('kpi-throughput')
const saidaMedia = document.getElementById('kpi-saidaMedia')
const saidaMaxima = document.getElementById('kpi-saidaMaxima')
const entradaMedia = document.getElementById('kpi-entradaMedia')
const entradaMaxima = document.getElementById('kpi-entradaMaxima')
var graficoBarras;
var graficoHistSaida;
var graficoHistEntrada;

var intervaloAtualizacao;

window.addEventListener('load', () => {
    exibirMaquinas();
    iniciarGraficos();
});

selectMaquinas.addEventListener('change', () => {
    atualizarGraficos();
});

async function iniciarGraficos() {
    await exibirDadosGeral();
    intervaloAtualizacao = setInterval(atualizarGraficos, 10000);
}

async function atualizarGraficos () {
    const idMaquina = selectMaquinas.value
    console.log(idMaquina)
    graficoBarras.destroy()
    graficoHistSaida.destroy()
    graficoHistEntrada.destroy()

    if (idMaquina == 0) {
        await exibirDadosGeral();
    } else {
        await exibirDadosMaquina(idMaquina);
    }
}

async function exibirDadosGeral() {
    fetch(`/rede/buscarTodas/${idEmpresa}`
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
            console.log(json)
            const serieEntrada = json.barras.serieEntrada
            const serieSaida = json.barras.serieSaida
            const serieTotal = json.barras.serieTotal
            const categorias = json.barras.categorias

            const histEntrada = json.histEntrada
            const histSaida = json.histSaida

            configBarPlot(serieEntrada, serieSaida, serieTotal, categorias);
            configHistEntrada(histEntrada.frequencia, histEntrada.categorias);
            configHistSaida(histSaida.frequencia, histSaida.categorias);
            
            graficoBarras.render();
            graficoHistSaida.render();
            graficoHistEntrada.render();

            throughput.textContent = json.throughput
            saidaMedia.textContent = json.saidaMedia
            saidaMaxima.textContent = json.saidaMaxima
            entradaMedia.textContent = json.entradaMedia
            entradaMaxima.textContent = json.entradaMaxima
        })
        .catch((erro) => {
            console.error(erro);
        });
}

async function exibirDadosMaquina(idMaquina) {
    fetch(`/rede/buscarPorMaquina/${idEmpresa}/${idMaquina}`
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
            console.log(json)
            const serieEntrada = json.barras.serieEntrada
            const serieSaida = json.barras.serieSaida
            const serieTotal = json.barras.serieTotal
            const categorias = json.barras.categorias

            const histEntrada = json.histEntrada
            const histSaida = json.histSaida

            configBarPlot(serieEntrada, serieSaida, serieTotal, categorias);
            configHistEntrada(histEntrada.frequencia, histEntrada.categorias);
            configHistSaida(histSaida.frequencia, histSaida.categorias);
            
            graficoBarras.render();
            graficoHistSaida.render();
            graficoHistEntrada.render();

            throughput.textContent = json.throughput
            saidaMedia.textContent = json.saidaMedia
            saidaMaxima.textContent = json.saidaMaxima
            entradaMedia.textContent = json.entradaMedia
            entradaMaxima.textContent = json.entradaMaxima
        })
        .catch((erro) => {
            console.error(erro);
        });
}

// function plotarGraficos() {
//     if (selectMaquinas.value == 0) {
//         painelGraficos.style.display = 'none'
//         painelAlertas.style.display = 'none'
//         avisoDefault.style.display = 'block'
//     } else {
//         avisoDefault.style.display = 'none'
//         painelGraficos.style.display = 'flex'
//         painelAlertas.style.display = 'flex'
//         exibirKpis();
//         exibirAlertas();
//         exibirComponentes();
//     }
// };

function configBarPlot(serieEntrada, serieSaida, serieTotal, categorias) {

    const options = {
        series: [{
            name: 'Entrada',
            data: serieEntrada
        }, {
            name: 'Saída',
            data: serieSaida
        }, {
            name: 'Total',
            data: serieTotal
        }],
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: true
            },
            title: {
                text: 'Gráfico de barras | Kb médio por hora',
                align: 'left',
                margin: 10,
                offsetX: 0,
                offsetY: 0,
                floating: false,
                style: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                    fontFamily: undefined,
                    color: '#263238'
                },
            },
            animations: {
                enabled: false,
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '70%',
                endingShape: 'rounded'
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: categorias,
            title: {
                text: 'Hora do Dia',
                style: {
                    fontSize: '14px',
                    fontWeight: 600
                }
            }
        },
        yaxis: {
            title: {
                text: 'Kilobytes (KB)',
                style: {
                    fontSize: '14px',
                    fontWeight: 600
                }
            },
            labels: {
                formatter: function (value) {
                    return value.toLocaleString('pt-BR');
                }
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val.toLocaleString('pt-BR') + ' KB'
                }
            }
        },
        colors: ['#008FFB', '#00E396', '#FEB019'],
        legend: {
            position: 'top',
            horizontalAlign: 'center',
            fontSize: '14px'
        }
    };

    graficoBarras = new ApexCharts(document.querySelector("#grafico1"), options);
}

function configHistSaida(frequencia, categorias) {

    const options = {
        series: [{
            name: "Frequência",
            data: frequencia
        }],
        chart: {
            type: 'bar',
            height: 180,
            toolbar: {
                show: true
            },
            animations: {
                enabled: false,
            }
        },
        plotOptions: {
            bar: {
                columnWidth: '100%'
            },
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: categorias,
            title: {
                text: 'KBps'
            }
        },
        yaxis: {
            title: {
                text: 'Frequência'
            }
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + " ocorrências"
                }
            }
        }
    };

    graficoHistSaida = new ApexCharts(document.querySelector("#grafico4"), options);
}

function configHistEntrada(frequencia, categorias) {

    const options = {
        series: [{
            name: "Frequência",
            data: frequencia
        }],
        chart: {
            type: 'bar',
            height: 180,
            toolbar: {
                show: true
            },
            animations: {
                enabled: false,
            }
        },
        plotOptions: {
            bar: {
                columnWidth: '100%'
            },
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: categorias,
            title: {
                text: 'KBps'
            }
        },
        yaxis: {
            title: {
                text: 'Frequência'
            }
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + " ocorrências"
                }
            }
        }
    };

    graficoHistEntrada = new ApexCharts(document.querySelector("#grafico3"), options);
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

function dataFormatada(dataString) {
    const data = new Date(dataString);
    return data.toLocaleString();
}

function exibeErro(str) { alert(str) }
