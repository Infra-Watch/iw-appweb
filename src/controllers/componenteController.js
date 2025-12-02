var componenteModel = require("../models/componenteModel")


function buscarPorMaquina(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var idMaquina = req.params.idMaquina;
    var intervalo = req.params.intervalo;

    switch (undefined) {
        case idEmpresa:
            res.status(400).send("id Empresa está undefined!");
            break;
        case idMaquina:
            res.status(400).send("id Maquina está undefined!");
            break;
        default:
            break;
    }

    componenteModel.buscarPorMaquina(idEmpresa, idMaquina, intervalo)
    .then((response) => {

        let query_status = response.pop()

        response = formatarJsonComponentes(response)
        res.json(response)
    })
    .catch((error) => {
        res.status(500).json(error.sqlMessage)
    })
}

function formatarJsonComponentes(resultado) {
    return {
    cpu_uso_porcentagem: {
        info: resultado[0],
        parametros: resultado[1],
        leituras: resultado[2]
    },
    cpu_freq_mhz: {
        info: resultado[3],
        parametros: resultado[4],
        leituras: resultado[5]
    },
    cpu_temp_c: {
        info: resultado[6],
        parametros: resultado[7],
        leituras: resultado[8]
    },
    ram_uso_porcentagem: {
        info: resultado[9],
        parametros: resultado[10],
        leituras: resultado[11]
    },
    ram_uso_gb: {
        info: resultado[12],
        parametros: resultado[13],
        leituras: resultado[14]
    },
    disco_uso_porcentagem: {
        info: resultado[15],
        parametros: resultado[16],
        leituras: resultado[17]
    },
    disco_velocidade_escrita: {
        info: resultado[18],
        parametros: resultado[19],
        leituras: resultado[20]
    },
    disco_velocidade_leitura: {
        info: resultado[21],
        parametros: resultado[22],
        leituras: resultado[23]
    },
    transferencia_entrada_kbps: {
        info: resultado[24],
        parametros: resultado[25],
        leituras: resultado[26]
    },
    transferencia_saida_kbps: {
        info: resultado[27],
        parametros: resultado[28],
        leituras: resultado[29]
    },
    processos: {
        info: resultado[30],
        parametros: resultado[31],
        leituras: resultado[32]
    },
    servicos: {
        info: resultado[33],
        parametros: resultado[34],
        leituras: resultado[35]
    },
    threads: {
        info: resultado[36],
        parametros: resultado[37],
        leituras: resultado[38]
    }
};
}

module.exports = {
    buscarPorMaquina,
}