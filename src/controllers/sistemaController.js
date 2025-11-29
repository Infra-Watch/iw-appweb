var sistemaModel = require("../models/sistemaModel");

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
        sistemaModel.qtdProcessosMaxima(idEmpresa,idMaquina,intervalo),
        sistemaModel.qtdProcessosMedia(idEmpresa,idMaquina,intervalo),
        sistemaModel.qtdThreadsMaxima(idEmpresa,idMaquina,intervalo),
        sistemaModel.qtdThreadsMedia(idEmpresa,idMaquina,intervalo),
        sistemaModel.qtdServicosMaxima(idEmpresa,idMaquina,intervalo),
        sistemaModel.qtdServicosMedia(idEmpresa,idMaquina,intervalo)
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