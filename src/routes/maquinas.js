var express = require("express");
var router = express.Router();

var maquinaController = require("../controllers/maquinaController");

router.post("/cadastrar", function (req, res) {
    maquinaController.cadastrar(req, res);
});

router.get("/buscarPorEmpresa/:idEmpresa", function (req, res) {
    maquinaController.buscarPorEmpresa(req, res);
});

router.get("/buscarKpisGeral/:idEmpresa/:intervalo", function (req, res) {
    maquinaController.buscarKpisGeral(req, res);
});

router.get("/buscarPorMaquina/:idEmpresa/:idMaquina", function (req, res) {
    maquinaController.buscarPorMaquina(req, res);
});

router.put("/atualizarStatus", function (req, res) {
    maquinaController.atualizarStatus(req, res);
});

router.put("/atualizarMacaddress", function (req, res) {
    maquinaController.atualizarMacaddress(req, res);
});

router.put("/atualizarApelido", function (req, res) {
    maquinaController.atualizarApelido(req, res);
});

router.delete("/remover", function (req, res) {
    maquinaController.remover(req, res);
});

module.exports = router;