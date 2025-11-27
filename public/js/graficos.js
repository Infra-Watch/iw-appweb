function graficos(componentes) {
    // console.log(jsonComponentes(componentes));
    componentes = jsonComponentes(componentes);

    //DEFINIR VARIÁVEIS
    // CPU
    let ultimaPorcentagemCPU = getUltimaLeitura(componentes.cpu_uso_porcentagem);
    let valoresPorcentagemCPU = getLeituras(componentes.cpu_uso_porcentagem)
    let valoresTemperaturaCPU = getLeituras(componentes.cpu_temp_c)
    let valoresFrequenciaCPU = getLeituras(componentes.cpu_freq_mhz)
    // RAM
    let ultimaPorcentagemRAM = getUltimaLeitura(componentes.ram_uso_porcentagem);
    let valoresPorcentagemRAM = getLeituras(componentes.ram_uso_porcentagem)
    let valoresUsoGbRAM = getLeituras(componentes.ram_uso_gb)    
    // DISCO
    let ultimaPorcentagemDisco = getUltimaLeitura(componentes.disco_uso_porcentagem);
    let valoresPorcentagemDisco = getLeituras(componentes.disco_uso_porcentagem)
    let valoresLeituraDisco = getLeituras(componentes.disco_velocidade_leitura)
    let valoresEscritaDisco = getLeituras(componentes.disco_velocidade_escrita)
    // REDE
    let valoresEntradaRede = getLeituras(componentes.transferencia_entrada_kbps)
    let valoresSaidaRede = getLeituras(componentes.transferencia_saida_kbps)
    // SISTEMA
    let ultimaProcessos = getUltimaLeitura(componentes.processos);
    let ultimaServicos = getUltimaLeitura(componentes.servicos);
    let ultimaThreads = getUltimaLeitura(componentes.threads);
    let valoresProcessos = getLeituras(componentes.processos)
    let valoresServicos = getLeituras(componentes.servicos)
    let valoresThreads = getLeituras(componentes.threads)
   
   
    // CPU
    // GRÁFICO GAUGE CHART CPU
    let gauge_cpu = document.getElementById("chart-apex-gauge-cpu");
    let options_gauge_cpu = {
        series: [ultimaPorcentagemCPU],
        chart: {
            type: 'radialBar',
            offsetY: -30,
            sparkline: {
                enabled: true
            }
        },
        plotOptions: {
            radialBar: {
                startAngle: -90,
                endAngle: 90,
                track: {
                    background: "#e7e7e7",
                    margin: 5, // margin is in pixels
                    dropShadow: {
                        enabled: true,

                        color: '#444',
                        opacity: 1,
                    }
                },
                dataLabels: {
                    name: {
                        show: false
                    },
                    value: {
                        offsetY: -2,
                        fontSize: '22px'
                    }
                }
            }
        },
        grid: {
            padding: {
                top: -10
            }
        },
        colors: ["#ff0000ff"],
        labels: ['Average Results'],
    };
    gauge_cpu.innerHTML = '';
    let chart_gauge = new ApexCharts(gauge_cpu, options_gauge_cpu);
    chart_gauge.render();

    // GRÁFICO 1
    let grafico_1 = document.getElementById("chart-apex-temp-cpu");
    let options_1 = {
        chart: {
            type: 'line',
            width: 300,
            height: 110,
        },
        colors: ["#9900a3ff"],
        series: [{
            name: 'Temperatura CPU',
            data: valoresTemperaturaCPU,
        }]
    };
    grafico_1.innerHTML = '';
    let chart_1 = new ApexCharts(grafico_1, options_1);
    chart_1.render();

    // GRÁFICO 2
    let grafico_2 = document.getElementById("chart-apex-freq-cpu");
    let options_2 = {
        chart: {
            type: 'line',
            width: 300,
            height: 110,
        },
        colors: ["#9900a3ff"],
        series: [{
            name: 'Frequência da CPU (MHz)',
            data: valoresFrequenciaCPU,
        }]
    };
    grafico_2.innerHTML = '';
    let chart_2 = new ApexCharts(grafico_2, options_2);
    chart_2.render();


    // DISCO / REDE
    // GRÁFICO GAUGE CHART DISCO
    let gauge_disco = document.getElementById("chart-apex-gauge-disco");
    let options_gauge_disco = {
        series: [ultimaPorcentagemDisco],
        chart: {
            type: 'radialBar',
            offsetY: -30,
            sparkline: {
                enabled: true
            }
        },
        plotOptions: {
            radialBar: {
                startAngle: -90,
                endAngle: 90,
                track: {
                    background: "#e7e7e7",
                    margin: 5,
                    dropShadow: {
                        enabled: true,
                        color: '#444',
                        opacity: 1,
                        blur: 2
                    }
                },
                dataLabels: {
                    name: {
                        show: false
                    },
                    value: {
                        offsetY: -2,
                        fontSize: '22px'
                    }
                }
            }
        },
        grid: {
            padding: {
                top: -10
            }
        },
        labels: ['Average Results'],
    };
    gauge_disco.innerHTML = '';
    let chart_gauge_disco = new ApexCharts(gauge_disco, options_gauge_disco);
    chart_gauge_disco.render();

    // GRÁFICO 3
    let grafico_3 = document.getElementById("chart-apex-env-mbps");
    let options_3 = {
        chart: {
            type: 'line',
            width: 300,
            height: 110,
        },
        series: [{
            name: 'Mbps Enviados',
            data: valoresSaidaRede,
        }]
    };
    grafico_3.innerHTML = '';
    let chart_3 = new ApexCharts(grafico_3, options_3);
    chart_3.render();

    // GRÁFICO 4
    let grafico_4 = document.getElementById("chart-apex-rec-mbps");
    let options_4 = {
        chart: {
            type: 'line',
            width: 300,
            height: 110,
        },
        series: [{
            name: 'Mbps Recebidos',
            data: valoresEntradaRede,
        }]
    };
    grafico_4.innerHTML = '';
    let chart_4 = new ApexCharts(grafico_4, options_4);
    chart_4.render();


    // RAM
    // GRÁFICO GAUGE CHART RAM
    let gauge_ram = document.getElementById("chart-apex-gauge-ram");
    let options_gauge_ram = {
        series: [ultimaPorcentagemRAM],
        chart: {
            type: 'radialBar',
            offsetY: -30,
            sparkline: {
                enabled: true
            }
        },
        plotOptions: {
            radialBar: {
                startAngle: -90,
                endAngle: 90,
                track: {
                    background: "#e7e7e7",
                    margin: 5,
                    dropShadow: {
                        enabled: true,
                        color: '#444',
                        opacity: 1,
                        blur: 2
                    }
                },
                dataLabels: {
                    name: {
                        show: false
                    },
                    value: {
                        offsetY: -2,
                        fontSize: '22px'
                    }
                }
            }
        },
        grid: {
            padding: {
                top: -10
            }
        },
        labels: ['Average Results'],
        colors: ["#25bb00ff"]

    };
    gauge_ram.innerHTML = '';
    let chart_gauge_ram = new ApexCharts(gauge_ram, options_gauge_ram);
    chart_gauge_ram.render();

    // GRÁFICO 5
    let grafico_5 = document.getElementById("chart-apex-uso-ram");
    let options_5 = {
        chart: {
            type: 'line',
            width: 300,
            height: 110,
        },
        series: [{
            name: 'Em uso',
            data: valoresUsoGbRAM,
        }],
        colors: ["#25bb00ff"]
    };
    grafico_5.innerHTML = '';
    let chart_5 = new ApexCharts(grafico_5, options_5);
    chart_5.render();

    // GRÁFICO 6
    let grafico_6 = document.getElementById("chart-apex-vel-disco");
    let options_6 = {
        chart: {
            type: 'line',
            width: 300,
            height: 110,
        },
        series: [
        {
            name: 'Taxa de Leitura',
            data: valoresLeituraDisco,
        },
        {
            name: 'Taxa de Escrita',
            data: valoresEscritaDisco,
        }
        ],
        colors: ["#0e1d36", "#cde1ff"]
    };
    grafico_6.innerHTML = '';
    let chart_6 = new ApexCharts(grafico_6, options_6);
    chart_6.render();
}

function jsonComponentes(arrayComponentes) {
    let json = {}
    arrayComponentes.forEach(componente => {
        json[componente.nome] = JSON.parse(componente.leituras)
    });
    return json;
}

function getHoras(array) {
    return array.map((p)=>{return p.data_hora})
}

function getLeituras(array) {
    return array.map((p)=>{return Math.round(p.valor)})
}

function getUltimaLeitura(array) {
    return array.at(-1).valor
}