const idEmpresa = sessionStorage.ID_EMPRESA;
const intervalo = sessionStorage.INTERVALO_DIAS != undefined ? sessionStorage.INTERVALO_DIAS : 1;
const selectMaquinas = document.getElementById('maquina-exibe')

const kpiUso = document.getElementById('dado-kpi-uso')
const kpiLeitura = document.getElementById('dado-kpi-velocidade-leitura')
const kpiEscrita = document.getElementById('dado-kpi-velocidade-escrita')
const kpiAlertas24h = document.getElementById('dado-kpi-alertas')

const statusUso = document.getElementById('status-uso');
const statusLeitura = document.getElementById('status-leitura');
const statusEscrita = document.getElementById('status-escrita');


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
        carregarAlertas();
        const intervaloAlertas = setInterval(carregarAlertas, 3000)
    } else {
        kpiUso.innerHTML = "--% | --%"
        kpiEscrita.innerHTML = '--mb/s | --mb/s'
        kpiLeitura.innerHTML = '--mb/s | --mb/s'
        kpiAlertas24h.innerHTML = '-- alertas'
        statusUso.innerHTML = '--';
        statusLeitura.innerHTML = '--';
        statusEscrita.innerHTML = '--';
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
                    kpiUso.innerHTML = `${resposta.uso_atual_porcentagem}%` 
                    kpiLeitura.innerHTML = `${resposta.velocidade_leitura_atual}mb/s | ${resposta.velocidade_leitura_media}mb/s`
                    kpiEscrita.innerHTML = `${resposta.velocidade_escrita_atual}mb/s | ${resposta.velocidade_escrita_media}mb/s`
                    kpiAlertas24h.innerHTML = `${resposta.alertas24h[0].qtd_alertas_24h} alertas`
                    aplicarStatus(resposta.uso_atual_porcentagem, resposta.velocidade_leitura_atual, resposta.velocidade_escrita_atual)
                });
            } else {
                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

function aplicarStatus(uso, leitura, escrita) {
    let divStatusUso = document.getElementById('status-uso')
    let divStatusLeitura = document.getElementById('status-leitura')
    let divStatusEscrita = document.getElementById('status-escrita')

    divStatusUso.style.color = 'green'
    divStatusUso.style.fontWeight = 'bold'
    divStatusUso.innerHTML = "NORMAL"

    divStatusLeitura.style.color = 'green'
    divStatusLeitura.style.fontWeight = 'bold'
    divStatusLeitura.innerHTML = "NORMAL"

    divStatusEscrita.style.color = 'green'
    divStatusEscrita.style.fontWeight = 'bold'
    divStatusEscrita.innerHTML = "NORMAL"

    if (uso > 85) {
        divStatusUso.style.color = 'red'
        divStatusUso.style.fontWeight = 'bold'
        divStatusUso.innerHTML = "CRÍTICO"
    } else if (uso > 70) {
        divStatusUso.style.color = 'yellow'
        divStatusUso.style.fontWeight = 'bold'
        divStatusUso.innerHTML = "ATENÇÃO"
    }

    if (leitura < 5) {
        divStatusLeitura.style.color = 'red'
        divStatusLeitura.style.fontWeight = 'bold'
        divStatusLeitura.innerHTML = "CRÍTICO"
    } else if (leitura < 15) {
        divStatusLeitura.style.color = 'yellow'
        divStatusLeitura.style.fontWeight = 'bold'
        divStatusLeitura.innerHTML = "ATENÇÃO"
    }

    if (escrita < 5) {
        divStatusEscrita.style.color = 'red'
        divStatusEscrita.style.fontWeight = 'bold'
        divStatusEscrita.innerHTML = "CRÍTICO"
    } else if (escrita < 15) {
        divStatusEscrita.style.color = 'yellow'
        divStatusEscrita.style.fontWeight = 'bold'
        divStatusEscrita.innerHTML = "ATENÇÃO"
    }
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
            grid: {
                row: {
                    colors: ['#f3f3f3', 'transparent'],
                    opacity: 0.5
                },
            },
            xaxis: {
                categories: hora_captura_transf,
                labels: {
                    show: true,
                    rotate: -45,
                    rotateAlways: true
                },
                title: {
                    text: 'Horário da Captura'
                }
            },
            yaxis: {
                title: {
                    text: 'Velocidade (MB/s)'
                },
                labels: {
                    formatter: function (value) {
                        return value.toFixed(2);
                    }
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
            colors: ['#ff0000ff', 'orange']
        }
    };

    var grafico_nivel_alerta = new ApexCharts(document.getElementById("grafico1"), optContagemAlertas);
    grafico_nivel_alerta.render();
}

function carregarAlertas() {
    const idMaquina = selectMaquinas.value
    fetch(`/disco/alertas/${idEmpresa}/${idMaquina}`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    const alertasScroll = document.getElementById("box-container-alertas")
                    alertasScroll.innerHTML = ''
                    const formatarData = data => {
                        const date = new Date(data);
                        const dia = date.getDate().toString();
                        const mes = (date.getMonth() + 1).toString();
                        const ano = date.getFullYear().toString();
                        const hora = date.getHours().toString().padStart(2, '0');
                        const minutos = date.getMinutes().toString().padStart(2, '0');
                        const segundos = date.getSeconds().toString().padStart(2, '0');

                        return `${dia}/${mes}/${ano} - ${hora}:${minutos}:${segundos}`;
                    };

                    for (let i = 0; i < resposta.length; i++) {
                        let nivel = (resposta[i].nivel == 1 ? '<b style="color:orange">Importante</b>' : '<b style="color:red">Crítico</b>')
                        alertasScroll.innerHTML += `
                        <div class="alertas">
                            <span><b>Máquina:</b> ${resposta[i].apelido}</span>
                            <span><b>Nível: ${nivel}</b></span>
                            <span><b>Métrica:</b> ${resposta[i].descricao}</span>
                            <span><b>Registro:</b> ${resposta[i].leitura}${resposta[i].unidade_de_medida}</span>
                            <span><b>Horário:</b> ${formatarData(resposta[i].data_hora)}</span>
                        </div>
                        `
                    }
                });
            } else {
                console.error('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('nome-usuario').innerHTML = sessionStorage.getItem('NOME_USUARIO')
})