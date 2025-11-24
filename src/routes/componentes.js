var express = require("express");
var router = express.Router();

var componenteController = require("../controllers/componenteController");

router.get("/buscarPorMaquina/:idEmpresa/:idMaquina/:intervalo", function (req, res) {
    componenteController.buscarPorMaquina(req, res);
});

module.exports = router;