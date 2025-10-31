// CPU
// GRÁFICO GAUGE CHART CPU
let gauge_cpu = document.getElementById("chart-apex-gauge-cpu");
let options_gauge_cpu = {
    series: [95],
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
        data: [10, 25, 30, 22, 18, 15, 15, 39],
    }]
};
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
        data: [10, 35, 30, 50, 82, 35, 65, 120],
    }]
};
let chart_2 = new ApexCharts(grafico_2, options_2);
chart_2.render();


// REDE
// GRÁFICO GAUGE CHART REDE
let gauge_rede = document.getElementById("chart-apex-gauge-rede");
let options_gauge_rede = {
    series: [76],
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
let chart_gauge_rede = new ApexCharts(gauge_rede, options_gauge_rede);
chart_gauge_rede.render();

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
        data: [150, 156, 145, 139, 152, 145, 155, 150],
    }]
};
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
        data: [151, 154, 146, 149, 150, 155, 153, 150],
    }]
};
let chart_4 = new ApexCharts(grafico_4, options_4);
chart_4.render();


// RAM
// GRÁFICO GAUGE CHART RAM
let gauge_ram = document.getElementById("chart-apex-gauge-ram");
let options_gauge_ram = {
    series: [76],
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
        data: [5.1, 6.3, 6.3, 6.3, 6.3, 6.3, 6.3, 6.2],
    }],
    colors: ["#25bb00ff"]
};
let chart_5 = new ApexCharts(grafico_5, options_5);
chart_5.render();

// GRÁFICO 6
let grafico_6 = document.getElementById("chart-apex-disp-ram");
let options_6 = {
    chart: {
        type: 'line',
        width: 300,
        height: 110,
    },
    series: [{
        name: 'Memória Disponível',
        data: [3.9, 2.7, 2.7, 2.7, 2.7, 2.7, 2.7, 2.7],
    }],
    colors: ["#25bb00ff"]
};
let chart_6 = new ApexCharts(grafico_6, options_6);
chart_6.render();


// PACOTES - Mbps
// GRÁFICO GAUGE Mbps
