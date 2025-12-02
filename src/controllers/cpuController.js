var cpuModel = require("../models/cpuModel");

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
        cpuModel.porcentagemUsoMaximaMedia(idEmpresa, idMaquina, intervalo),
        cpuModel.frequenciaCPUMaximaMedia(idEmpresa, idMaquina, intervalo),
        cpuModel.temperaturaCPUMaximaMedia(idEmpresa, idMaquina, intervalo),
    ])
        .then(([resPorcetUsoMaxMed, resFreqMaxMed, resTempMaxMed]) => {
            const porcentagem_uso_maxima_media = (resPorcetUsoMaxMed && resPorcetUsoMaxMed[0]) ? resPorcetUsoMaxMed[0].porcentagem_uso_maxima_media : 0;
            const porcentagem_freq_maxima_media = (resFreqMaxMed && resFreqMaxMed[0]) ? resFreqMaxMed[0].porcentagem_freq_maxima_media : 0;
            const utilizacao_temp_maxima_media = (resTempMaxMed && resTempMaxMed[0]) ? resTempMaxMed[0].utilizacao_temp_maxima_media : 0;

            return res.status(200).json({
                porcentagem_uso_maxima_media,
                porcentagem_freq_maxima_media,
                utilizacao_temp_maxima_media
            });
        })
        .catch(erro => {
            console.error("Erro ao buscar KPIs", erro);
            res.status(500).json({ erro: erro.sqlMessage || erro.message || erro });
        });
}

// ======= BUSCANDO MAQUINAS PARA O SELECT OPTION =======
function buscarPorEmpresa(req, res) {
    var idEmpresa = req.params.idEmpresa;

    switch (undefined) {
        case idEmpresa:
            res.status(400).send("id Empresa está undefined!");
            break;
        default:
            break;
    }

    maquinaModel.buscarPorEmpresa(idEmpresa)
    .then((response) => {
        console.log(response.data)
        res.json(response)
    })
    .catch((error) => {
        res.status(500).json(error.sqlMessage)
    })
}


module.exports = {
    pegarKpis,
    buscarPorEmpresa
};