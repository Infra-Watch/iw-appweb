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

function buscarPorEmpresa(req, res) {
    var idEmpresa = req.params.idEmpresa;

    switch (undefined) {
        case idEmpresa:
            res.status(400).send("id Empresa está undefined!");
            break;
        default:
            break;
    }

    acessosModel.buscarPorEmpresa(idEmpresa)
    .then((response) => {
        console.log(response.data)
        res.json(response)
    })
    .catch((error) => {
        res.status(500).json(error.sqlMessage)
    })
}

function atualizar(req, res) {
    let idEmpresa = req.body.idEmpresaServer
    let idCategoria = req.body.idCategoriaServer
    let categoria = req.body.categoriaServer
    let descricao = req.body.descricaoServer
    let permissoes = req.body.permissoesServer


    switch (undefined) {
        case idEmpresa:
            res.status(400).send("id Empresa está undefined!");
            break;
        case idCategoria:
            res.status(400).send("id Categoria está undefined!");
            break;
        default:
            break;
    }
    
    if (categoria === undefined) {
    categoria = null;
    } else {
    categoria = `'${categoria}'`;
    }

    if (descricao === undefined) {
    descricao = null;
    } else {
    descricao = `'${descricao}'`;
    }

    if (permissoes === undefined) {
    permissoes = null;
    } else {
    permissoes = `'${permissoes}'`;
    }

    acessosModel.atualizar(
        idEmpresa,
        idCategoria,
        categoria,
        descricao,
        permissoes
    ).then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao deletar o post: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}


function remover(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var idCategoria = req.params.idCategoria;

    switch (undefined) {
        case idEmpresa:
            res.status(400).send("id Empresa está undefined!");
            break;
        case idCategoria:
            res.status(400).send("id Categoria está undefined!");
            break;
        default:
            break;
    }

    acessosModel.remover(idEmpresa, idCategoria)
    .then((response) => {
        console.log(response.data)
        res.json(response)
    })
    .catch((error) => {
        res.status(500).json(error.sqlMessage)
    })
}

module.exports = {
    cadastrar,
    buscarPorEmpresa,
    atualizar,
    remover
}