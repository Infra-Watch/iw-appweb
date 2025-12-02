function graficos(componentes) {
    //DEFINIR VARIÁVEIS
    // CPU
    let ultimaPorcentagemCPU = getUltimaLeitura(componentes.cpu_uso_porcentagem);
    let valoresPorcentagemCPU = getLeituras(componentes.cpu_uso_porcentagem)
    let valoresTemperaturaCPU = getLeituras(componentes.cpu_temp_c)
    let valoresFrequenciaCPU = getLeituras(componentes.cpu_freq_mhz)
    let horasTemperaturaCPU = getHoras(componentes.cpu_temp_c)
    let horasFrequenciaCPU = getHoras(componentes.cpu_freq_mhz)
    // let parametrosTemperaturaCPU = getParametros(componentes.cpu_temp_c)
    // let parametrosFrequenciaCPU = getParametros(componentes.cpu_freq_mhz)
    // RAM
    let ultimaPorcentagemRAM = getUltimaLeitura(componentes.ram_uso_porcentagem);
    let valoresPorcentagemRAM = getLeituras(componentes.ram_uso_porcentagem)
    let valoresUsoGbRAM = getLeituras(componentes.ram_uso_gb)
    let horasUsoGbRAM = getHoras(componentes.ram_uso_gb)
    // let parametrosUsoGbRAM = getParametros(componentes.ram_uso_gb)
    // DISCO
    let ultimaPorcentagemDisco = getUltimaLeitura(componentes.disco_uso_porcentagem);
    let valoresPorcentagemDisco = getLeituras(componentes.disco_uso_porcentagem)
    let valoresLeituraDisco = getLeituras(componentes.disco_velocidade_leitura)
    let valoresEscritaDisco = getLeituras(componentes.disco_velocidade_escrita)
    let horasVelocidadeDisco = getHoras(componentes.disco_velocidade_leitura)
    // let parametrosLeituraDisco = getParametros(componentes.disco_velocidade_leitura)
    // let parametrosEscritaDisco = getParametros(componentes.disco_velocidade_escrita)
    // REDE
    let valoresEntradaRede = getLeituras(componentes.transferencia_entrada_kbps)
    let valoresSaidaRede = getLeituras(componentes.transferencia_saida_kbps)
    let horasEntradaRede = getHoras(componentes.transferencia_entrada_kbps)
    let horasSaidaRede = getHoras(componentes.transferencia_saida_kbps)
    // let parametrosEntradaRede = getParametros(componentes.transferencia_entrada_kbps)
    // let parametrosSaidaRede = getParametros(componentes.transferencia_saida_kbps)
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
            },
            animations: {
                enabled: false
            },
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
            zoom: {
                enabled: true
            }
        },
        colors: ["#9900a3ff", "#FFFF00", "#FF0000"],
        series: [{
            name: 'Temperatura CPU',
            data: valoresTemperaturaCPU,
        },
        // {
        //     name: 'Atenção',
        //     data: Array(valoresTemperaturaCPU.length).fill(parametrosTemperaturaCPU.atencao),
        // },
        // {
        //     name: 'Crítico',
        //     data: Array(valoresTemperaturaCPU.length).fill(parametrosTemperaturaCPU.critico),
        // }
        ],
        xaxis: {
            categories: horasTemperaturaCPU,
            range: 9
        }
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
            zoom: {
                enabled: true
            }
        },
        colors: ["#9900a3ff", "#FFFF00", "#FF0000"],
        series: [{
            name: 'Frequência da CPU (MHz)',
            data: valoresFrequenciaCPU,
        },
        // {
        //     name: 'Atenção',
        //     data: Array(valoresFrequenciaCPU.length).fill(parametrosFrequenciaCPU.atencao),
        // },
        // {
        //     name: 'Crítico',
        //     data: Array(valoresFrequenciaCPU.length).fill(parametrosFrequenciaCPU.critico),
        // }
        ],
        xaxis: {
            categories: horasFrequenciaCPU,
            range: 9
        }
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
            },
            animations: {
                enabled: false
            },
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
            zoom: {
                enabled: true
            }
        },
        colors: ["#0099FF", "#FFFF00", "#FF0000"],
        series: [{
            name: 'Mbps Enviados',
            data: valoresSaidaRede,
        },
        // {
        //     name: 'Atenção',
        //     data: Array(valoresSaidaRede.length).fill(parametrosSaidaRede.atencao),
        // },
        // {
        //     name: 'Crítico',
        //     data: Array(valoresSaidaRede.length).fill(parametrosSaidaRede.critico),
        // }
        ],
        xaxis: {
            categories: horasSaidaRede,
            range: 9
        }
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
            zoom: {
                enabled: true
            }
        },
        colors: ["#0099FF", "#FFFF00", "#FF0000"],
        series: [{
            name: 'Mbps Recebidos',
            data: valoresEntradaRede,
        },
        // {
        //     name: 'Atenção',
        //     data: Array(valoresEntradaRede.length).fill(parametrosEntradaRede.atencao),
        // },
        // {
        //     name: 'Crítico',
        //     data: Array(valoresEntradaRede.length).fill(parametrosEntradaRede.critico),
        // }
        ],
        xaxis: {
            categories: horasEntradaRede,
            range: 9
        }
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
            },
            animations: {
                enabled: false
            },
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
            zoom: {
                enabled: true
            }
        },
        series: [{
            name: 'Em uso',
            data: valoresUsoGbRAM,
        },
        // {
        //     name: 'Atenção',
        //     data: Array(valoresUsoGbRAM.length).fill(parametrosUsoGbRAM.atencao),
        // },
        // {
        //     name: 'Crítico',
        //     data: Array(valoresUsoGbRAM.length).fill(parametrosUsoGbRAM.critico),
        // }
        ],
        colors: ["#25bb00ff", "#FFFF00", "#FF0000"],
        xaxis: {
            categories: horasUsoGbRAM,
            range: 9
        }
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
            zoom: {
                enabled: true
            }
        },
        series: [
        {
            name: 'Taxa de Leitura',
            data: valoresLeituraDisco,
        },
        {
            name: 'Taxa de Escrita',
            data: valoresEscritaDisco,
        },
        // {
        //     name: 'Atenção Leitura',
        //     data: Array(valoresLeituraDisco.length).fill(parametrosLeituraDisco.atencao),
        // },
        // {
        //     name: 'Crítico Leitura',
        //     data: Array(valoresLeituraDisco.length).fill(parametrosLeituraDisco.critico),
        // },
        // {
        //     name: 'Atenção Escrita',
        //     data: Array(valoresEscritaDisco.length).fill(parametrosEscritaDisco.atencao),
        // },
        // {
        //     name: 'Crítico Escrita',
        //     data: Array(valoresEscritaDisco.length).fill(parametrosEscritaDisco.critico),
        // }
        ],
        colors: ["#0e1d36", "#cde1ff", "#FFFF00", "#FF0000", "#FFFF00", "#FF0000"],
        xaxis: {
            categories: horasVelocidadeDisco,
            range: 9
        }
    };
    grafico_6.innerHTML = '';
    let chart_6 = new ApexCharts(grafico_6, options_6);
    chart_6.render();
}

function getHoras(json) {
    return json['leituras'].map((p)=>{
        let data = new Date(p.data_hora);
        let horas = String(data.getHours()).padStart(2, '0');
        let minutos = String(data.getMinutes()).padStart(2, '0');
        let segundos = String(data.getSeconds()).padStart(2, '0');
        return `${horas}:${minutos}:${segundos}`;
    })
}

function getLeituras(json) {
    return json['leituras'].map((p)=>{return Math.round(p.valor)})
}

function getParametros(json) {
    let parametros = { 'atencao': null, 'critico': null };
    
    json['parametros']?.forEach((p) => {
        if (p.nivel === 1) {
            parametros['atencao'] = p.valor;
        } else if (p.nivel === 2) {
            parametros['critico'] = p.valor;
        }
    });
    
    return parametros;
}
function getUltimaLeitura(json) {
    return json['leituras']?.at(-1)?.valor ?? 0
}

function dataFormatada(dataString) {
	const data = new Date(dataString);
	return data.toLocaleString();
}