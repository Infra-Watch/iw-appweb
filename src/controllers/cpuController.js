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


// GRÁFICOS
function pegarGraficos(req, res) {
    let { idEmpresa, idMaquina } = req.params;

    if (!idEmpresa || !idMaquina) {
        return res.status(400).json({
            mensagem: "idEmpresa ou idMaquina inválidos"
        });
    }

    idEmpresa = Number(idEmpresa);
    idMaquina = Number(idMaquina);

    Promise.all([
        cpuModel.usoAtual(idEmpresa, idMaquina),
        cpuModel.frequenciaAtual(idEmpresa, idMaquina),
        cpuModel.temperaturaAtual(idEmpresa, idMaquina)
    ])
        .then(([uso, freq, temp]) => {
            res.status(200).json({
                uso: { atual: uso[0]?.ultima_leitura || 0, },
                frequencia: { atual: freq[0]?.ultima_leitura || 0, },
                temperatura: { atual: temp[0]?.ultima_leitura || 0, }
            });
        })
        .catch((erro) => {
            console.error("Erro ao buscar gráficos:", erro);
            res.status(500).json({
                mensagem: "Erro ao consultar gráficos",
                erro: erro.sqlMessage
            });
        });
}


module.exports = {
    buscarPorEmpresa,
    pegarKpis,
    pegarGraficos
};