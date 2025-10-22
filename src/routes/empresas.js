var express = require("express");
var router = express.Router();

var empresaController = require("../controllers/empresaController");

router.post("/cadastrar", function (req, res) {
    empresaController.cadastrar(req, res);
})

router.get("/buscar/:idEmpresa", function (req, res) {
  empresaController.buscarPorId(req, res);
});

router.delete("/remover/:idEmpresa", function (req, res) {
  empresaController.remover(req, res);
});

module.exports = router;