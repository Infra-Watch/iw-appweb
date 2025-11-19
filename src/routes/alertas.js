var express = require("express");
var router = express.Router();

var alertaController = require("../controllers/alertaController");

router.get("/buscarPorEmpresa/:idEmpresa/:intervalo", function (req, res) {
    alertaController.buscarPorEmpresa(req, res);
});

module.exports = router;