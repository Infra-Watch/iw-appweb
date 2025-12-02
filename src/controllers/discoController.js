var discoModel = require("../models/discoModel");

function pegarKpis(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var idMaquina = req.params.idMaquina;

    console.log(`Buscando KPIs de disco para Empresa: ${idEmpresa} e Máquina: ${idMaquina}`);

    if (!idEmpresa || !idMaquina) {
        return res.status(400).json({ mensagem: "idEmpresa ou idMaquina não fornecidos." });
    }

    // Converte para Number antes de usar
    idEmpresa = Number(idEmpresa);
    idMaquina = Number(idMaquina);

    // Promise.all executa todas as consultas de forma paralela
    Promise.all([
        discoModel.usoMaximoPorcentagem(idEmpresa, idMaquina),
        discoModel.usoAtualPorcentagem(idEmpresa, idMaquina),
        discoModel.velocidadeLeituraMaxima(idEmpresa, idMaquina),
        discoModel.velocidadeLeituraMedia(idEmpresa, idMaquina),
        discoModel.velocidadeLeituraAtual(idEmpresa, idMaquina),
        discoModel.velocidadeEscritaMaxima(idEmpresa, idMaquina),
        discoModel.velocidadeEscritaMedia(idEmpresa, idMaquina),
        discoModel.velocidadeEscritaAtual(idEmpresa, idMaquina),
    ])
        .then(([
            usoMax, usoAtual,
            leituraMax, leituraMed, leituraAtual,
            escritaMax, escritaMed, escritaAtual
        ]) => {
            const uso_maximo_porcentagem = (usoMax && usoMax[0]) ? usoMax[0].uso_maximo_porcentagem : 0;
            const uso_atual_porcentagem = (usoAtual && usoAtual[0]) ? usoAtual[0].uso_atual_porcentagem : 0;

            const velocidade_leitura_maxima = (leituraMax && leituraMax[0]) ? leituraMax[0].velocidade_leitura_maxima : 0;
            const velocidade_leitura_media = (leituraMed && leituraMed[0]) ? leituraMed[0].velocidade_leitura_media : 0;
            const velocidade_leitura_atual = (leituraAtual && leituraAtual[0]) ? leituraAtual[0].velocidade_leitura_atual : 0;

            const velocidade_escrita_maxima = (escritaMax && escritaMax[0]) ? escritaMax[0].velocidade_escrita_maxima : 0;
            const velocidade_escrita_media = (escritaMed && escritaMed[0]) ? escritaMed[0].velocidade_escrita_media : 0;
            const velocidade_escrita_atual = (escritaAtual && escritaAtual[0]) ? escritaAtual[0].velocidade_escrita_atual : 0;

            return res.status(200).json({
                uso_maximo_porcentagem,
                uso_atual_porcentagem,
                velocidade_leitura_maxima,
                velocidade_leitura_media,
                velocidade_leitura_atual,
                velocidade_escrita_maxima,
                velocidade_escrita_media,
                velocidade_escrita_atual
            });
        })
        .catch(erro => {
            console.error("Erro ao buscar KPIs de disco:", erro);
            res.status(500).json({ erro: erro.sqlMessage || erro.message || erro });
        });
}

function pegarDadosGraficoAlertas(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var idMaquina = req.params.idMaquina;
    discoModel
        .pegarDadosGraficoAlertas(idEmpresa, idMaquina)
        .then((resultado) => {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(200).json([])
            }
        })
        .catch((erro) => {
            res.status(500).json(erro.sqlMessage);
        });
}

function pegarDadosGraficoLeitura(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var idMaquina = req.params.idMaquina;
    discoModel
        .pegarDadosGraficoLeitura(idEmpresa, idMaquina)
        .then((resultado) => {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(200).json([])
            }
        })
        .catch((erro) => {
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    pegarKpis,
    pegarDadosGraficoAlertas,
    pegarDadosGraficoLeitura
};