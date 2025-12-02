var maquinaModel = require("../models/maquinaModel");
var cpuModel = require("../models/cpuModel");

// ======= BUSCANDO MAQUINAS PARA O SELECT OPTION =======
function buscarPorEmpresa(req, res) {
    var idEmpresa = req.params.idEmpresa;

    if (!idEmpresa) {
        return res.status(400).json({ mensagem: "idEmpresa não informado" });
    }

    maquinaModel.buscarPorEmpresa(idEmpresa)
        .then((rows) => {
            res.json(rows);
        })

        .catch((error) => {
            res.status(500).json(error.sqlMessage)
        })
}


// ======= KPIs =======
function pegarKpis(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var idMaquina = req.params.idMaquina;
    var intervalo = parseInt(req.query.intervalo || "1", 10);

    if (isNaN(intervalo) || intervalo <= 0) intervalo = 1;

    if (!idEmpresa || !idMaquina) {
        return res.status(400).json({ mensagem: "idEmpresa ou idMaquina default" });
    }

    idEmpresa = Number(idEmpresa);
    idMaquina = Number(idMaquina);

    Promise.all([
        cpuModel.porcentagemUsoMedia(idEmpresa, idMaquina, intervalo),
        cpuModel.frequenciaMedia(idEmpresa, idMaquina, intervalo),
        cpuModel.temperaturaMedia(idEmpresa, idMaquina, intervalo),
    ])
        .then(([uso, freq, temp]) => {
            return res.status(200).json({
                porcentagem_uso_media: uso[0]?.porcentagem_uso_medio || 0,
                frequencia_media: freq[0]?.frequencia_media || 0,
                temperatura_media: temp[0]?.temperatura_media || 0
            });
        })

        .catch(erro => {
            console.error("Erro ao buscar KPIs", erro);
            res.status(500).json({ erro: erro.sqlMessage || erro.message || erro });
        });
}


// ======= GRÁFICOS =======
function pegarGraficos(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var idMaquina = req.params.idMaquina;
    var idRecurso = req.params.idRecurso;

    if (!idEmpresa || !idMaquina || !idRecurso) {
        return res.status(400).json({ mensagem: "idEmpresa ou idMaquina ou idRecurso estão default" });
    }

    idEmpresa = Number(idEmpresa);
    idMaquina = Number(idMaquina);
    idRecurso = Number(idRecurso);

    Promise.all([
        cpuModel.usoAtual(idEmpresa, idMaquina, intervalo),
        cpuModel.frequenciaAtual(idEmpresa, idMaquina, intervalo),
        cpuModel.temperaturaAtual(idEmpresa, idMaquina, intervalo),
    ]).then(([usoAtual, freqAtual, tempAtual]) => {
        return res.status(200).json({
            usoAtual: uso[0]?.usoAtual || 0,
            fruquencia_media: freq[0]?.frequencia_media || 0,
            temperatura_media: temp[0]?.temperatura_media || 0
        });
    })

        .catch(erro => {
            console.error("Erro ao buscar KPIs", erro);
            res.status(500).json({ erro: erro.sqlMessage || erro.message || erro });
        });
}


module.exports = {
    buscarPorEmpresa,
    pegarKpis,
    pegarGraficos
};