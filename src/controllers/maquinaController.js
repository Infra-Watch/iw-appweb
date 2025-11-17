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

function atualizarStatus(req, res) {
    var idEmpresa = req.body.idEmpresa;
    var idMaquina = req.body.idMaquina;

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

function atualizarMacaddress(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var idMaquina = req.params.idMaquina;
    var macAddress = req.params.macAddressServer;

    switch (undefined) {
        case idEmpresa:
            res.status(400).send("id Empresa está undefined!");
            break;
        case idMaquina:
            res.status(400).send("id Maquina está undefined!");
            break;
        case macAddress:
            res.status(400).send("Mac Address está undefined!");
            break;       
        default:
            break;
    }
}

function atualizarApelido(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var idMaquina = req.params.idMaquina;
    var apelido = req.body.apelidoServer;

    switch (undefined) {
        case idEmpresa:
            res.status(400).send("id Empresa está undefined!");
            break;
        case idMaquina:
            res.status(400).send("id Maquina está undefined!");
            break;
        case apelido:
            res.status(400).send("Apelido está undefined!");
            break;
        default:
            break;
    }
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
}

module.exports = {
    cadastrar,
    buscarPorEmpresa,
    buscarPorMaquina,
    atualizarStatus,
    atualizarMacaddress,
    atualizarApelido,
    remover
}