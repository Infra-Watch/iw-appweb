var ramModel = require("../models/ramModel");

function pegarKpis(req, res){
    var idEmpresa = req.params.idEmpresa;
    var idMaquina = req.params.idMaquina;
    var intervalo = parseInt(req.query.intervalo || "1", 10);
    if(isNaN(intervalo) || intervalo <= 0 ) intervalo = 1;

    if(!idEmpresa || !idMaquina){
        return res.status(400).json({mensagem: "idEmpresa oi idMaquina default"});
    }

    idEmpresa = Number(idEmpresa);
    idMaquina = Number(idMaquina);
    Promise.all([
        ramModel.porcentagemUsoMaxima(idEmpresa,idMaquina,intervalo),
        ramModel.porcentagemUsoMedia(idEmpresa,idMaquina,intervalo),
        ramModel.utilizacaoGbMaxima(idEmpresa,idMaquina,intervalo),
        ramModel.utilizacaoGbMaxima(idEmpresa,idMaquina,intervalo)
    ])
    .then(([resPorcentMax, resPorcentMed, resGbMax, resGbMed]) => {
        const porcentagem_uso_maxima = (resPorcentMax && resPorcentMax[0]) ? resPorcentMax[0].porcentagem_uso_maxima : 0;
        const porcentagem_uso_media = (resPorcentMed && resPorcentMed[0]) ? resPorcentMed[0].porcentagem_uso_media : 0;
        const utilizacao_gb_maxima = (resGbMax && resGbMax[0]) ? resGbMax[0].utilizacao_gb_maxima : 0;
        const utilizacao_gb_media = (resGbMed && resGbMed[0]) ? resGbMed[0].utilizacao_gb_media : 0;

        return res.status(200).json({
            porcentagem_uso_maxima,
            porcentagem_uso_media,
            utilizacao_gb_maxima,
            utilizacao_gb_media
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