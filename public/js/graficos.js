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
                    color: '#ff0000ff',
                    opacity: 0,
                    
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
    colors: ["#9900a3ff"],

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
        data: [10, 35, 30, 50, 82, 35, 65, 120],
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
        data: [50, 56, 45, 39, 52, 45, 55, 50],
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
        data: [51, 54, 46, 49, 50, 55, 53, 50],
    }]
};
let chart_4 = new ApexCharts(grafico_4, options_4);
chart_4.render();


