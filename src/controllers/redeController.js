var redeModel = require("../models/redeModel");

function buscarPorMaquina(req, res){
    var idEmpresa = req.params.idEmpresa;
    var idMaquina = req.params.idMaquina;

    const exemploKbpsEntrada = Array.from({length: 100}, () => Math.round(50 + Math.random() * 20));
    const exemploKbpsSaida = Array.from({length: 100}, () => Math.round(30 + Math.random() * 30));


    function gerarDadosExemplo() {
        const capturas = [];

        for (let hora = 0; hora < 24; hora++) {
            for (let i = 0; i < 4; i++) {
                capturas.push({
                    hora: hora,
                    kbpsEntrada: Math.random() * 20 + 50,
                    kbpsSaida: Math.random() * 30 + 30,
                });
            }
        }

        return capturas;
    }

    if(idEmpresa == undefined || idMaquina == undefined){
        return res.status(400).json({mensagem: "idEmpresa ou idMaquina undefined"});
    }

    // return res.status(200).json({
    //     throughput: exemploKbpsEntrada[exemploKbpsEntrada.length-1] + exemploKbpsSaida[exemploKbpsSaida.length-1],
    //     saidaMedia: exemploKbpsSaida.reduce((acumulador, atual) => acumulador + atual, 0)/exemploKbpsSaida.length,
    //     entradaMedia: exemploKbpsEntrada.reduce((acumulador, atual) => acumulador + atual, 0)/exemploKbpsEntrada.length,
    //     saidaMaxima: Math.max(...exemploKbpsSaida),
    //     entradaMaxima: Math.max(...exemploKbpsEntrada),
    //     histEntrada: createHistogramData(exemploKbpsEntrada),
    //     histSaida: createHistogramData(exemploKbpsSaida),
    //     barras: createBarSeries(gerarDadosExemplo()),
    // });
    redeModel.buscarDadosRedePorMaquina(idEmpresa, idMaquina)
    .then((response) => {
        let query_status = response.pop()
        let kpis = formatKpis(response)
        return res.status(200).json({
            throughput: kpis.throughput,
            saidaMedia: kpis.saidaMedia,
            entradaMedia: kpis.entradaMedia,
            saidaMaxima: kpis.saidaMaxima,
            entradaMaxima: kpis.entradaMaxima,
            histEntrada: createHistogramData(exemploKbpsEntrada),
            histSaida: createHistogramData(exemploKbpsSaida),
            // histEntrada: createHistogramData(extrairLeituras(response[2])),
            // histSaida: createHistogramData(extrairLeituras(response[3])),
            barras: createBarSeries(response[4]),
        });
    })
    .catch((error) => {
        res.status(500).json(error.sqlMessage)
    })
}

function buscarTodas(req, res){
    var idEmpresa = req.params.idEmpresa;

    const exemploKbpsEntrada = Array.from({length: 100}, () => Math.round(300 + Math.random() * 120));
    const exemploKbpsSaida = Array.from({length: 100}, () => Math.round(180 + Math.random() * 180));


    function gerarDadosExemplo() {
        const capturas = [];

        for (let hora = 0; hora < 24; hora++) {
            for (let i = 0; i < 4; i++) {
                capturas.push({
                    hora: hora,
                    kbpsEntrada: Math.random() * 120 + 300,
                    kbpsSaida: Math.random() * 180 + 180,
                });
            }
        }

        return capturas;
    }

    if(idEmpresa == undefined){
        return res.status(400).json({mensagem: "idEmpresa undefined"});
    }
    
    // return res.status(200).json({
    //     throughput: exemploKbpsEntrada[exemploKbpsEntrada.length-1] + exemploKbpsSaida[exemploKbpsSaida.length-1],
    //     saidaMedia: exemploKbpsSaida.reduce((acumulador, atual) => acumulador + atual, 0)/exemploKbpsSaida.length,
    //     entradaMedia: exemploKbpsEntrada.reduce((acumulador, atual) => acumulador + atual, 0)/exemploKbpsEntrada.length,
    //     saidaMaxima: Math.max(...exemploKbpsSaida),
    //     entradaMaxima: Math.max(...exemploKbpsEntrada),
    //     histEntrada: createHistogramData(exemploKbpsEntrada),
    //     histSaida: createHistogramData(exemploKbpsSaida),
    //     barras: createBarSeries(gerarDadosExemplo()),
    // });
    redeModel.buscarDadosRedePorEmpresa(idEmpresa)
    .then((response) => {
        let query_status = response.pop()
        let kpis = formatKpis(response)
        return res.status(200).json({
            throughput: kpis.throughput,
            saidaMedia: kpis.saidaMedia,
            entradaMedia: kpis.entradaMedia,
            saidaMaxima: kpis.saidaMaxima,
            entradaMaxima: kpis.entradaMaxima,
            histEntrada: createHistogramData(exemploKbpsEntrada),
            histSaida: createHistogramData(exemploKbpsSaida),
            // histEntrada: createHistogramData(extrairLeituras(response[2])),
            // histSaida: createHistogramData(extrairLeituras(response[3])),
            barras: createBarSeries(response[4]),
        });
    })
    .catch((error) => {
        res.status(500).json(error.sqlMessage)
    })
}

function extrairLeituras(arrayJson) {
    return arrayJson
        .filter(json => json.leitura!=null && json.leitura!=undefined && json.leitura!=0)
        .map(json => json.leitura)
}

function formatKpis(response) {
    return {
        throughput: Math.round(response[0][0].throughput),
        saidaMedia: Math.round(response[1][0].saidaMedia),
        entradaMedia: Math.round(response[1][0].entradaMedia),
        saidaMaxima: Math.round(response[1][0].saidaMaxima),
        entradaMaxima: Math.round(response[1][0].entradaMaxima),
    }
}

function createHistogramData(data, intervalo=5) {

    const min = Math.round(Math.min(...data));
    const max = Math.round(Math.max(...data));
    const frequencia = [];
    const categorias = [];

    for (let i = min; i <= max; i += intervalo) {
        const separador = i + intervalo;
        const count = data.filter(item => item >= i && item < separador).length;
        frequencia.push(count);
        categorias.push(`${i}-${separador}`);
    }
    return { frequencia, categorias };
}

function createBarSeries(capturas) {   
    const dadosProcessados = convertKbpsToKB(capturas, 900);

    const categorias = [];
    const serieEntrada = [];
    const serieSaida = [];
    const serieTotal = [];

    for (let h = 0; h < 24; h++) {
        categorias.push(`${h.toString().padStart(2, '0')}h`);
        serieEntrada.push(Math.round(dadosProcessados[h].entrada));
        serieSaida.push(Math.round(dadosProcessados[h].saida));
        serieTotal.push(Math.round(dadosProcessados[h].total));
    }
    return {
        serieEntrada,
        serieSaida,
        serieTotal,
        categorias
    }
}

function convertKbpsToKB(capturas, intervaloSegundos = 2) {
    const dadosPorHora = {};

    for (let h = 0; h < 24; h++) {
        dadosPorHora[h] = {
            entrada: 0,
            saida: 0,
            total: 0
        };
    }

    capturas.forEach(captura => {
        const hora = captura.hora;

        const kbEntrada = (captura.kbpsEntrada * intervaloSegundos) / 8;
        const kbSaida = (captura.kbpsSaida * intervaloSegundos) / 8;

        dadosPorHora[hora].entrada += kbEntrada;
        dadosPorHora[hora].saida += kbSaida;
        dadosPorHora[hora].total += kbEntrada + kbSaida;
    });

    return dadosPorHora;
}

module.exports = {
    buscarPorMaquina,
    buscarTodas
};