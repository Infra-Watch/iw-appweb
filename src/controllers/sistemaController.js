var sistemaModel = require("../models/sistemaModel");

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
        sistemaModel.processosMaximo(idEmpresa,idMaquina,intervalo),
        sistemaModel.processosMedia(idEmpresa,idMaquina,intervalo),
        sistemaModel.threadsMaximo(idEmpresa,idMaquina,intervalo),
        sistemaModel.threadsMedia(idEmpresa,idMaquina,intervalo),
        sistemaModel.servicosMaximo(idEmpresa,idMaquina,intervalo),
        sistemaModel.servicosMedia(idEmpresa,idMaquina,intervalo)
    ])
    .then(([resProcessoMax, resProcessoMed, resThreadsMax, resThreadsMed, resServicosMax, resServicosMed]) => {
        const qtd_processo_maximo = (resProcessoMax && resProcessoMax[0]) ? resProcessoMax[0].qtd_processo_maximo : 0;
        const qtd_processo_media = (resProcessoMed && resProcessoMed[0]) ? resProcessoMed[0].qtd_processo_media : 0;
        const qtd_threads_maximo = (resThreadsMax && resThreadsMax[0]) ? resThreadsMax[0].qtd_threads_maximo : 0;
        const qtd_threads_media = (resThreadsMed && resThreadsMed[0]) ? resThreadsMed[0].qtd_threads_media : 0;
         const qtd_servicos_maximo = (resServicosMax && resServicosMax[0]) ? resProcessoMax[0].qtd_servicos_maximo : 0;
        const qtd_servicos_media = (resServicosMed && resServicosMed[0]) ? resServicosMed[0].qtd_servicos_media : 0;

        return res.status(200).json({
            qtd_processo_maximo,
            qtd_processo_media,
            qtd_threads_maximo,
            qtd_threads_media,
            qtd_servicos_maximo,
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