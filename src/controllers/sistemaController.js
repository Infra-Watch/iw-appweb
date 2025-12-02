var sistemaModel = require("../models/sistemaModel");

function pegarKpis(req, res){
    var idEmpresa = req.params.idEmpresa;
    var idMaquina = req.params.idMaquina;

    if(!idEmpresa || !idMaquina){
        return res.status(400).json({mensagem: "idEmpresa ou idMaquina faltando"});
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
        return res.status(200).json({
            qtd_processos_maxima: (qtdProcessosMax[0] ? qtdProcessosMax[0].qtd_processos_maxima : 0),
            qtd_processos_media: (qtdProcessosMed[0] ? qtdProcessosMed[0].qtd_processos_media : 0),
            qtd_threads_maxima: (qtdThreadsMax[0] ? qtdThreadsMax[0].qtd_threads_maxima : 0),
            qtd_threads_media: (qtdThreadsMed[0] ? qtdThreadsMed[0].qtd_threads_media : 0),
            qtd_servicos_maxima: (qtdServicosMax[0] ? qtdServicosMax[0].qtd_servicos_maxima : 0),
            qtd_servicos_media: (qtdServicosMed[0] ? qtdServicosMed[0].qtd_servicos_media : 0)
        });
    })
    .catch(erro => {
        console.error("Erro ao buscar KPIs", erro);
        res.status(500).json({ erro: erro.sqlMessage || erro.message });
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

function buscarLeituras(req, res) {
    const idEmpresa = Number(req.params.idEmpresa);
    const idMaquina = Number(req.params.idMaquina);

    sistemaModel.leiturasPorMaquina(idEmpresa, idMaquina)
        .then(dados => res.status(200).json(dados))
        .catch(err => res.status(500).json({erro: err}));
}

module.exports = {
    pegarKpis,
    buscarLeituras,
    buscarComponentes
};
