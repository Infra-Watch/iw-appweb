var componenteModel = require("../models/componenteModel")


function buscarPorMaquina(req, res) {
    var idEmpresa = req.params.idEmpresa;
    var idMaquina = req.params.idMaquina;
    var intervalo = req.params.intervalo;

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

    componenteModel.buscarPorMaquina(idEmpresa, idMaquina, intervalo)
    .then((response) => {
        console.log(response.data)
        res.json(response)
    })
    .catch((error) => {
        res.status(500).json(error.sqlMessage)
    })
}

module.exports = {
    buscarPorMaquina,
}