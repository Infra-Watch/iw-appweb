var sistemaModel = require("../models/sistemaModel");

function pegarKpis(req, res){
    var idEmpresa = req.params.idEmpresa;
    var idMaquina = req.params.idMaquina;

    if(!idEmpresa || !idMaquina){
        return res.status(400).json({mensagem: "idEmpresa ou idMaquina default"});
    }

    idEmpresa = Number(idEmpresa);
    idMaquina = Number(idMaquina);
    Promise.all([
        sistemaModel.qtdProcessosMaxima(idEmpresa,idMaquina),
        sistemaModel.qtdProcessosMedia(idEmpresa,idMaquina),
        sistemaModel.qtdThreadsMaxima(idEmpresa,idMaquina),
        sistemaModel.qtdThreadsMedia(idEmpresa,idMaquina),
        sistemaModel.qtdServicosMaxima(idEmpresa,idMaquina),
        sistemaModel.qtdServicosMedia(idEmpresa,idMaquina)
    ])
    .then(([qtdProcessosMax, qtdProcessosMed, qtdThreadsMax, qtdThreadsMed, qtdServicosMax, qtdServicosMed]) => {
        const qtd_processos_maxima = (qtdProcessosMax && qtdProcessosMax[0]) ? qtdProcessosMax[0].qtd_processos_maxima : 0;
        const qtd_processos_media = (qtdProcessosMed && qtdProcessosMed[0]) ? qtdProcessosMed[0].qtd_processos_media : 0;
        const qtd_threads_maxima = (qtdThreadsMax && qtdThreadsMax[0]) ? qtdThreadsMax[0].qtd_threads_maxima : 0;
        const qtd_threads_media = (qtdThreadsMed && qtdThreadsMed[0]) ? qtdThreadsMed[0].qtd_threads_media : 0;
        const qtd_servicos_maxima = (qtdServicosMax && qtdServicosMax[0]) ? qtdServicosMax[0].qtd_servicos_maxima : 0;
        const qtd_servicos_media = (qtdServicosMed && qtdServicosMed[0]) ? qtdServicosMed[0].qtd_servicos_media : 0;

        return res.status(200).json({
            qtd_processos_maxima,
            qtd_processos_media,
            qtd_threads_maxima,
            qtd_threads_media,
            qtd_servicos_maxima,
            qtd_servicos_media
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