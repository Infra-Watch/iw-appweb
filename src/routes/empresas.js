var express = require("express");
var router = express.Router();

var empresaController = require("../controllers/empresaController");

router.post("/cadastrar", function (req, res) {
    empresaController.cadastrar(req, res);
})

router.get("/buscarTodas", function (req, res) {
  empresaController.buscarTodas(req, res);
});

router.get("/buscar/:idEmpresa", function (req, res) {
  empresaController.buscarPorId(req, res);
});

router.delete("/remover/:idEmpresa", function (req, res) {
  empresaController.remover(req, res);
});

router.put("/atualizar", function (req, res) {
  empresaController.atualizar(req, res);
});

module.exports = router;