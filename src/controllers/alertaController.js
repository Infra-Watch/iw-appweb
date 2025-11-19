var alertaModel = require("../models/alertaModel")

function buscarPorEmpresa(req, res) {
    var idEmpresa = req.params.idEmpresa;

    switch (undefined) {
        case idEmpresa:
            res.status(400).send("id Empresa está undefined!");
            break;
        default:
            break;
    }

    alertaModel.buscarPorEmpresa(idEmpresa)
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

module.exports = {
    buscarPorEmpresa,
    buscarPorMaquina
}