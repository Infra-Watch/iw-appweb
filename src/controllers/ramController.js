var ramModel = require("../models/ramModel");

function pegarKpis(req, res){
    var idEmpresa = req.params.idEmpresa;
    var idMaquina = req.params.idMaquina;

    console.log(idEmpresa)
    console.log(idMaquina)
    
    if(!idEmpresa || !idMaquina){
        return res.status(400).json({mensagem: "idEmpresa oi idMaquina default"});
    }
    
    idEmpresa = Number(idEmpresa);
    idMaquina = Number(idMaquina);
    
    console.log(idEmpresa)
    console.log(idMaquina)

    Promise.all([
        ramModel.porcentagemUsoMaxima(idEmpresa,idMaquina),
        ramModel.porcentagemUsoMedia(idEmpresa,idMaquina),
        ramModel.utilizacaoGbMaxima(idEmpresa,idMaquina),
        ramModel.utilizacaoGbMedia(idEmpresa,idMaquina)
    ])
    .then(([porMax, porMed, utiMax, utiMed]) => {
        const porcentagem_uso_maxima = (porMax && porMax[0]) ? porMax[0].porcentagem_uso_maxima : 0;
        const porcentagem_uso_media = (porMed && porMed[0]) ? porMed[0].porcentagem_uso_media : 0;
        const utilizacao_gb_maxima = (utiMax && utiMax[0]) ? utiMax[0].utilizacao_gb_maxima : 0;
        const utilizacao_gb_media = (utiMed && utiMed[0]) ? utiMed[0].utilizacao_gb_media : 0;

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