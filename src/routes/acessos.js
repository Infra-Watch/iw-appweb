var express = require("express");
var router = express.Router();

var acessosController = require("../controllers/acessosController");

router.post("/cadastrar", function (req, res) {
    acessosController.cadastrar(req, res);
});

router.get("/buscarPorEmpresa/:idEmpresa", function (req, res) {
    acessosController.buscarPorEmpresa(req, res);
});

module.exports = router;