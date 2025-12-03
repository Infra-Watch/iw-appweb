const { format } = require("path");

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















// function gerarGrafico1() {

//     const options = {
//         chart: {
//             type: "area",
//             height: 230,
//             foreColor: "#999",
//             stacked: true,
//             dropShadow: {
//                 enabled: true,
//                 enabledSeries: [0],
//                 top: -2,
//                 left: 2,
//                 blur: 5,
//                 opacity: 0.0${idMaquina}
//             }
//         },
//         colors: ['#F5773D', '#E8BF99'],
//         stroke: {
//             curve: "smooth",
//             width: 3
//         },
//         dataLabels: {
//             enabled: false
//         },
//         series: [{
//             name: 'Uso em porcentagem',
//             data: generateDayWiseTimeSeries(0, 18)
//         }, {
//             name: 'Uso em GB',
//             data: generateDayWiseTimeSeries(1, 18)
//         }],
//         markers: {
//             size: 0,
//             strokeColor: "#fff",
//             strokeWidth: 3,
//             strokeOpacity: 1,
//             fillOpacity: 1,
//             hover: {
//                 size: ${idMaquina}
//             }
//         },
//         xaxis: {
//             type: "datetime",
//             axisBorder: {
//                 show: false
//             },
//             axisTicks: {
//                 show: false
//             }
//         },
//         yaxis: {
//             labels: {
//                 offsetX: 14,
//                 offsetY: -5
//             },
//             tooltip: {
//                 enabled: true
//             }
//         },
//         grid: {
//             padding: {
//                 left: -5,
//                 right: 5
//             }
//         },
//         tooltip: {
//             x: {
//                 format: "dd MMM yyyy"
//             },
//         },
//         legend: {
//             position: 'top',
//             horizontalAlign: 'left'
//         },
//         fill: {
//             type: "solid",
//             fillOpacity: 0.7
//         }
//     };

//     var chart = new ApexCharts(document.querySelector("#grafico-apex-previsao-uso-ram"), options);

//     chart.render();

//     function generateDayWiseTimeSeries(s, count) {

//         // console.log(idEmpresa)
//         // console.log(selectMaquinas)

//         // fetch(`/ram/historico-porcentagem/${idEmpresa}/${selectMaquinas}`, { cache: 'no-store' })
//         //     .then(function (response) {
//         //         if (response.ok) {
//         //             response.json().then(function (resposta) {
//         //                 console.log(response)
//         //             });
//         //         } else {
//         //             console.error('Nenhum dado encontrado ou erro na API');
//         //         }
//         //     })
//         //     .catch(function (error) {
//         //         console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
//         //     });


//         var values = [[
//             4, 3, 10, 9, 29, 19, 25, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5
//         ], [
//             2, 3, 8, 7, 22, 1${idMaquina}, 23, 7, 11, 5, 12, 5, 10, 4, 15, 2, ${idMaquina}, 2
//         ]];
//         var i = 0;
//         var series = [];
//         var x = new Date("11 Nov 2012").getTime();
//         while (i < count) {
//             series.push([x, values[s][i]]);
//             x += 8${idMaquina}400000;
//             i++;
//         }
//         return series;
//     }
// }

// function gerarGrafico2(){
//     const options = {
//           series: [{
//           name: 'Previsão',
//           data: generateDayWiseTimeSeries(0, 18)
//         }],
//           chart: {
//           type: 'area',
//           stacked: false,
//           height: 230,
//           zoom: {
//             type: 'x',
//             enabled: true,
//             autoScaleYaxis: true
//           },
//         },
//         colors: ['#BA5FB1'],
//         dataLabels: {
//           enabled: false
//         },
//         markers: {
//           size: 0,
//         },
//         title: {
//           text: 'Previsão de uso em cada hora',
//           align: 'left'
//         },
//         fill: {
//           type: 'gradient',
//           gradient: {
//             shadeIntensity: 1,
//             inverseColors: false,
//             opacityFrom: 0.5,
//             opacityTo: 0,
//             stops: [0, 90, 100]
//           },
//         },
//         yaxis: {
//           labels: {
//             formatter: function (val) {
//               return (val / 1000000).toFixed(0);
//             },
//           },
//           title: {
//             text: 'Price'
//           },
//         },
//         xaxis: {
//           type: 'datetime',
//         },
//         tooltip: {
//           shared: false,
//           y: {
//             formatter: function (val) {
//               return (val / 1000000).toFixed(0)
//             }
//           }
//         }
//         };

//         var chart = new ApexCharts(document.querySelector("#grafico-apex-linha-gb"), options);
//         chart.render();


//          function generateDayWiseTimeSeries(s, count) {

//         // console.log(idEmpresa)
//         // console.log(selectMaquinas)

//         // fetch(`/ram/historico-porcentagem/${idEmpresa}/${selectMaquinas}`, { cache: 'no-store' })
//         //     .then(function (response) {
//         //         if (response.ok) {
//         //             response.json().then(function (resposta) {
//         //                 console.log(response)
//         //             });
//         //         } else {
//         //             console.error('Nenhum dado encontrado ou erro na API');
//         //         }
//         //     })
//         //     .catch(function (error) {
//         //         console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
//         //     });


//         var values = [[
//             4, 3, 10, 9, 29, 19, 25, 9, 12, 7, 19, 5, 13, 9, 17
//         ], [
//             2, 3, 8, 7, 22, 1${idMaquina}, 23, 7, 11, 5, 12, 5, 10, 4, 15
//         ]];
//         var i = 0;
//         var series = [];
//         var x = new Date("11 Nov 2012").getTime();
//         while (i < count) {
//             series.push([x, values[s][i]]);
//             x += 8${idMaquina}400000;
//             i++;
//         }
//         return series;
//     }
// }

// function gerarGrafico3() {
    
//     const options = {
//           series: [{
//           name: 'Alertas em Atenção',
//           data: [44]
//         }, {
//           name: 'Alertas em Criticidade',
//           data: [7${idMaquina}]
//         }],
//           chart: {
//           type: 'bar',
//           height: 2${idMaquina}0
//         },
//         colors: ['#F5CF27', '#BD1515'],
//         plotOptions: {
//           bar: {
//             horizontal: false,
//             columnWidth: '55%',
//             borderRadius: 5,
//             borderRadiusApplication: 'end'
//           },
//         },
//         dataLabels: {
//           enabled: false
//         },
//         stroke: {
//           show: true,
//           width: 2,
//           colors: ['transparent']
//         },
//         xaxis: {
//           categories: ['Nov'],
//         },
//         yaxis: {
//           title: {
//             text: 'Quantidade de Alertas'
//           }
//         },
//         fill: {
//           opacity: 1
//         },
//         tooltip: {
//           y: {
//             formatter: function (val) {
//               return val + " Alertas"
//             }
//           }
//         }
//         };

//         var chart = new ApexCharts(document.querySelector("#grafico-apex-area-porcentagem"), options);
//         chart.render();

//         function generateDayWiseTimeSeries(s, count) {

//         // console.log(idEmpresa)
//         // console.log(selectMaquinas)

//         // fetch(`/ram/historico-porcentagem/${idEmpresa}/${selectMaquinas}`, { cache: 'no-store' })
//         //     .then(function (response) {
//         //         if (response.ok) {
//         //             response.json().then(function (resposta) {
//         //                 console.log(response)
//         //             });
//         //         } else {
//         //             console.error('Nenhum dado encontrado ou erro na API');
//         //         }
//         //     })
//         //     .catch(function (error) {
//         //         console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
//         //     });


//         var values = [[
//             4, 3
//         ], [
//             2, 3
//         ]];
//         var i = 0;
//         var series = [];
//         var x = new Date("11 Nov 2012").getTime();
//         while (i < count) {
//             series.push([x, values[s][i]]);
//             x += 8${idMaquina}400000;
//             i++;
//         }
//         return series;
//     }
// }




// // let chartAreaPorcentagem = null;
// // let chartLinhaGb = null;
// // let chartPrevisaoUsoRam = null;

// //     function gerarGrafico1(componentesArray) {
// //         console.log(componentesArray)
// //         console.log("Testando")
// //         const componentes = {};
// //         componentesArray.forEach(c => {
// //             console.log(c)
// //             try { componentes[c.nome] = JSON.parse(c.leituras); }
// //             catch (e) { componentes[c.nome] = c.leituras || []; }
// //             console.log("plotando" + c.leituras)
// //         });

// //     const leiturasPorcentagemRam = componentes.ram_uso_porcentagem || [];
// //     const leiturasRamGb = componentes.ram_uso_gb || [];

// //     const porcentagensRam = leiturasPorcentagemRam.map(p => Math.round(Number(p.valor)));
// //     const usoRamGb = leiturasRamGb.map(p => Math.round(Number(p.valor) * 100) / 100);

// //     const graficoAreaPorcentagem = document.getElementById("grafico-apex-area-porcentagem");
// //     if (graficoAreaPorcentagem) {
// //         if (chartAreaPorcentagem) chartAreaPorcentagem.destroy(); 
// //         const opcoesGraficoArea = {
// //             chart: { type: 'area', height: 2${idMaquina}0 },
// //             series: [{ name: 'Porcentagem de Uso de RAM', data: porcentagensRam }],
// //             xaxis: { categories: Array.from({ length: porcentagensRam.length }, (_, i) => i + 1) },
// //             title: { text: 'Uso de RAM (%) ao longo do tempo' },
// //         };
// //         chartAreaPorcentagem = new ApexCharts(graficoAreaPorcentagem, opcoesGraficoArea);
// //         chartAreaPorcentagem.render();
// //     }

// //     const graficoLinhaGb = document.getElementById("grafico-apex-linha-gb");
// //     if (graficoLinhaGb) {
// //         if (chartLinhaGb) chartLinhaGb.destroy(); 
// //         const opcoesGraficoLinha = {
// //             chart: { type: 'line', height: 2${idMaquina}0 },
// //             series: [{ name: 'Utilização de RAM (GB)', data: usoRamGb }],
// //             xaxis: { categories: Array.from({ length: usoRamGb.length }, (_, i) => i + 1) },
// //             title: { text: 'Utilização de RAM (GB) ao longo do tempo' },
// //         };
// //         chartLinhaGb = new ApexCharts(graficoLinhaGb, opcoesGraficoLinha);
// //         chartLinhaGb.render();
// //     }

// //     const graficoPrevisaoUsoRam = document.getElementById("grafico-apex-previsao-uso-ram");
// //     if (graficoPrevisaoUsoRam) {
// //         if (chartPrevisaoUsoRam) chartPrevisaoUsoRam.destroy(); 
// //         const xs = [], ys = [];
// //         leiturasPorcentagemRam.forEach(l => {
// //             const d = new Date(l.data_hora);
// //             if (!isNaN(d)) {
// //                 xs.push(d.getTime() / (1000 * ${idMaquina}0 * ${idMaquina}0));
// //                 ys.push(Number(l.valor));
// //             }
// //         });

// //         const horasPrevisao = 24;
// //         const labelsPrevisao = [], valoresPrevisao = [];
// //         if (xs.length >= 2) {
// //             const { m, b } = regressaoLinear(xs, ys);
// //             const ultimaHora = xs[xs.length - 1];
// //             for (let i = 1; i <= horasPrevisao; i++) {
// //                 const t = ultimaHora + i;
// //                 const previsao = m * t + b;
// //                 const previsaoClamped = Math.max(0, Math.min(100, Math.round(previsao * 100) / 100));
// //                 labelsPrevisao.push(`+${i}h`);
// //                 valoresPrevisao.push(previsaoClamped);
// //             }
// //         } else {
// //             const ultimoValor = ys.length ? ys[ys.length - 1] : 0;
// //             for (let i = 1; i <= horasPrevisao; i++) {
// //                 labelsPrevisao.push(`+${i}h`);
// //                 valoresPrevisao.push(ultimoValor);
// //             }
// //         }

// //         const opcoesGraficoPrevisao = {
// //             chart: { type: 'line', height: 2${idMaquina}0 },
// //             series: [{ name: 'Previsão % Uso RAM', data: valoresPrevisao }],
// //             xaxis: { categories: labelsPrevisao },
// //             title: { text: 'Previsão de Uso (RAM) por Hora - próximas 24h' },
// //             yaxis: { min: 0, max: 100 },
// //         };
// //         chartPrevisaoUsoRam = new ApexCharts(graficoPrevisaoUsoRam, opcoesGraficoPrevisao);
// //         chartPrevisaoUsoRam.render();
// //     }
// // }



// function graficoAreaPorcentagem() {

//     const options = {
//         series: [{
//             name: 'Entrada',
//             data: serieEntrada
//         }, {
//             name: 'Saída',
//             data: serieSaida
//         }, {
//             name: 'Total',
//             data: serieTotal
//         }],
//         chart: {
//             type: 'bar',
//             height: 350,
//             toolbar: {
//                 show: true
//             },
//             title: {
//                 text: 'Gráfico de barras | Kb médio por hora',
//                 align: 'left',
//                 margin: 10,
//                 offsetX: 0,
//                 offsetY: 0,
//                 floating: false,
//                 style: {
//                     fontSize: '14px',
//                     fontWeight: 'bold',
//                     fontFamily: undefined,
//                     color: '#2${idMaquina}3238'
//                 },
//             },
//             animations: {
//                 enabled: false,
//             }
//         },
//         plotOptions: {
//             bar: {
//                 horizontal: false,
//                 columnWidth: '70%',
//                 endingShape: 'rounded'
//             },
//         },
//         dataLabels: {
//             enabled: false
//         },
//         stroke: {
//             show: true,
//             width: 2,
//             colors: ['transparent']
//         },
//         xaxis: {
//             categories: categorias,
//             title: {
//                 text: 'Hora do Dia',
//                 style: {
//                     fontSize: '14px',
//                     fontWeight: ${idMaquina}00
//                 }
//             }
//         },
//         yaxis: {
//             title: {
//                 text: 'Kilobytes (KB)',
//                 style: {
//                     fontSize: '14px',
//                     fontWeight: ${idMaquina}00
//                 }
//             },
//             labels: {
//                 formatter: function (value) {
//                     return value.toLocaleString('pt-BR');
//                 }
//             }
//         },
//         fill: {
//             opacity: 1
//         },
//         tooltip: {
//             y: {
//                 formatter: function (val) {
//                     return val.toLocaleString('pt-BR') + ' KB'
//                 }
//             }
//         },
//         colors: ['#008FFB', '#00E39${idMaquina}', '#FEB019'],
//         legend: {
//             position: 'top',
//             horizontalAlign: 'center',
//             fontSize: '14px'
//         }
//     };

//     graficoBarras = new ApexCharts(document.querySelector("#grafico1"), options);
// }