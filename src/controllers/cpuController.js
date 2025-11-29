var cpuModel = require("../models/cpuModel");

function pegarKpis(req, res){
    var idEmpresa = req.params.idEmpresa;
    var idMaquina = req.params.idMaquina;
    var intervalo = parseInt(req.query.intervalo || "1", 10);
    
    if(isNaN(intervalo) || intervalo <= 0 ) intervalo = 1;

    if(!idEmpresa || !idMaquina){
        return res.status(400).json({mensagem: "idEmpresa ou idMaquina default"});
    }

    idEmpresa = Number(idEmpresa);
    idMaquina = Number(idMaquina);
    
    Promise.all([
        cpuModel.porcentagemUsoMaximaMedia(idEmpresa,idMaquina,intervalo),
        cpuModel.frequenciaCPUMaximaMedia(idEmpresa,idMaquina,intervalo),
        cpuModel.temperaturaCPUMaximaMedia(idEmpresa,idMaquina,intervalo),
    ])
    .then(([resPorcetUsoMaxMed, resFreqMaxMed, resMaxMed, resTempMaxMed]) => {
        const porcentagem_uso_maxima_media = (resPorcentMax && resPorcentMax[0]) ? resPorcentMax[0].porcentagem_uso_maxima : 0;
        const porcentagem_freq_maxima_media = (resPorcentMed && resPorcentMed[0]) ? resPorcentMed[0].porcentagem_uso_media : 0;
        const utilizacao_temp_maxima_media = (resGbMax && resGbMax[0]) ? resGbMax[0].utilizacao_gb_maxima : 0;

        return res.status(200).json({
            porcentagem_uso_maxima_media,
            porcentagem_freq_maxima_media,
            utilizacao_temp_maxima_media
        });
    })
    .catch(erro => {
        console.error("Erro ao buscar KPIs", erro);
        res.status(500).json({ erro: erro.sqlMessage || erro.message || erro});
    });
}

module.exports = {
    pegarKpis
};