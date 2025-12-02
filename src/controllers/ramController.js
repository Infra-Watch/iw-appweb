var ramModel = require("../models/ramModel");

function pegarKpis(req, res){
    var idEmpresa = req.params.idEmpresa;
    var idMaquina = req.params.idMaquina;

    console.log(idEmpresa)
    console.log(idMaquina)
    
    if(!idEmpresa || !idMaquina){
        return res.status(400).json({mensagem: "idEmpresa ou idMaquina default"});
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

function buscarComponentes(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var idMaquina = req.params.idMaquina;
    var intervalo = req.params.intervalo;

    if (!idEmpresa || !idMaquina) {
        return res.status(400).json({ mensagem: "idEmpresa ou idMaquina inválidos" });
    }

    idEmpresa = Number(idEmpresa);
    idMaquina = Number(idMaquina);
    intervalo = Number(intervalo) || 1;

    ramModel.buscarComponentes(idEmpresa, idMaquina, intervalo)
        .then(resultado => {
            if (!resultado || resultado.length === 0) {
                return res.status(200).json([]);
            }
            return res.status(200).json(resultado);
        })
        .catch(erro => {
            console.error("Erro ao buscar componentes:", erro);
            res.status(500).json({ erro: erro.sqlMessage || erro });
        });
}

function buscarHistoricoPorcentagem(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var idMaquina = req.params.idMaquina;
    var dias = req.params.dias || 7;

    ramModel.historicoPorcentagem(idEmpresa, idMaquina, dias)
        .then(resultado => {
            return res.status(200).json(resultado);
        })
        .catch(erro => {
            res.status(500).json({ erro: erro.sqlMessage || erro.message || erro });
        });
}

function buscarHistoricoGb(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var idMaquina = req.params.idMaquina;
    var dias = req.params.dias || 7;

    ramModel.historicoGb(idEmpresa, idMaquina, dias)
        .then(resultado => {
            return res.status(200).json(resultado);
        })
        .catch(erro => {
            res.status(500).json({ erro: erro.sqlMessage || erro.message || erro });
        });
}

function buscarPrevisaoUsoRam(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var idMaquina = req.params.idMaquina;
    var dias = req.params.dias || 7;

    ramModel.previsaoUsoRamPorHora(idEmpresa, idMaquina, dias)
        .then(resultado => {
            return res.status(200).json(resultado);
        })
        .catch(erro => {
            res.status(500).json({ erro: erro.sqlMessage || erro.message || erro });
        });
}

module.exports = {
    pegarKpis,
    buscarComponentes,
    buscarHistoricoPorcentagem,
    buscarHistoricoGb,
    buscarPrevisaoUsoRam
};

