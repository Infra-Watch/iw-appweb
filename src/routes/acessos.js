var express = require("express");
var router = express.Router();

var acessosController = require("../controllers/acessosController");

router.post("/cadastrar", function (req, res) {
    acessosController.cadastrar(req, res);
});

router.get("/buscarPorEmpresa/:idEmpresa", function (req, res) {
    acessosController.buscarPorEmpresa(req, res);
});

router.put("/atualizar", function (req, res) {
    acessosController.atualizar(req, res);
});

router.delete("/remover/:idEmpresa/:idCategoria", function (req, res) {
    acessosController.remover(req, res);
});

module.exports = router;