var maquinaModel = require("../models/maquinaModel")

function cadastrar(req, res) {
    var idEmpresa = req.body.idEmpresaServer;
    var macAddress = req.body.macAddressServer;
    var apelido = req.body.apelidoServer;

    switch (undefined) {
        case idEmpresa:
            res.status(400).send("id Empresa está undefined!");
            break;
        case macAddress:
            res.status(400).send("Mac Address está undefined!");
            break;
        case apelido:
            res.status(400).send("Apelido está undefined!");
            break;
        default:
            break;
    
    }
    maquinaModel.cadastrar(idEmpresa,macAddress,apelido)
    .then((resposta) => {
        res.json(resposta)
    })
    .catch(function(erro){
        console.log(erro)
        console.log(
            "Erro ao cadastrar máquina: ",
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

    maquinaModel.buscarPorEmpresa(idEmpresa)
    .then((response) => {
        console.log(response.data)
        res.json(response)
    })
    .catch((error) => {
        res.status(500).json(error.sqlMessage)
    })
}

function buscarKpisGeral(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var intervalo = req.params.intervalo;

    switch (undefined) {
        case idEmpresa:
            res.status(400).send("id Empresa está undefined!");
            break;
        case intervalo:
            res.status(400).send("id Empresa está undefined!");
            break;
        default:
            break;
    }

    maquinaModel.buscarKpisGeral(idEmpresa, intervalo)
    .then((response) => {
        console.log(response.data)
        res.json(response)
    })
    .catch((error) => {
        res.status(500).json(error.sqlMessage)
    })
}

function buscarPorMaquina(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var idMaquina = req.params.idMaquina;

    switch (undefined) {
        case idEmpresa:
            res.status(400).send("id Empresa está undefined!");
            break;
        case idMaquina:
            res.status(400).send("id Maquina está undefined!");
            break;
        default:
            break;
    }
}

function atualizar(req, res) {
    let idEmpresa = req.body. idEmpresaServer
    let idMaquina = req.body. idMaquinaServer
    let ativacao = req.body. ativacaoServer
    let mac_address = req.body. mac_addressServer
    let apelido = req.body. apelidoServer

    switch (undefined) {
        case idEmpresa:
            res.status(400).send("id Empresa está undefined!");
            break;
        case idMaquina:
            res.status(400).send("id Maquina está undefined!");
            break;
        default:
            break;
    }

    if (ativacao === undefined) {
    ativacao = null;
    } else {
    ativacao = `'${ativacao}'`;
    }

    if (mac_address === undefined) {
    mac_address = null;
    } else {
    mac_address = `'${mac_address}'`;
    }

    if (apelido === undefined) {
    apelido = null;
    } else {
    apelido = `'${apelido}'`;
    }

    maquinaModel.atualizar(
        idEmpresa,
        idMaquina,
        ativacao,
        mac_address,
        apelido
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
    var idMaquina = req.params.idMaquina;

    switch (undefined) {
        case idEmpresa:
            res.status(400).send("id Empresa está undefined!");
            break;
        case idMaquina:
            res.status(400).send("id Maquina está undefined!");
            break;
        default:
            break;
    }

    maquinaModel.remover(idEmpresa, idMaquina)
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
    buscarPorMaquina,
    atualizar,
    remover,
    buscarKpisGeral
}