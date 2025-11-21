var acessosModel = require("../models/acessosModel")

function cadastrar(req, res) {
    var nome_acesso = req.body.nomeAcessoServer;
    var descricao = req.body.descricaoServer;
    var codigo = req.body.codPermissoesServer;
    var fkEmpresa = req.body.fkEmpresaServer;

    switch (undefined) {
        case nome_acesso:
            res.status(400).send("O nome está undefined!");
            break;
        case descricao:
            res.status(400).send("A descrição está undefined!");
            break;
        case codigo:
            res.status(400).send("O Código está undefined!");
            break;
        case fkEmpresa:
            res.status(400).send("A fk da Empresa está undefined!");
            break;
        default:
            break;
    }
    acessosModel.cadastrar(nome_acesso, descricao, codigo, fkEmpresa)
        .then((resposta) => {
            res.json(resposta)
        })
        .catch(function (erro) {
            console.log(erro)
            console.log(
                "Erro ao cadastrar novo acesso: ",
                erro.sqlMessage
            );
            res.status(500).json(erro.sqlMessage)
        });
}

module.exports = {
    cadastrar
}