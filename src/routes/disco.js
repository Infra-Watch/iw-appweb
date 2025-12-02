var express = require("express");
var router = express.Router();

var discoController = require("../controllers/discoController");

router.get("/kpis/:idEmpresa/:idMaquina", function(req, res) {
    discoController.pegarKpis(req, res);
});

router.get("/grafico_alertas/:idEmpresa/:idMaquina", function(req, res) {
    discoController.pegarDadosGraficoAlertas(req, res);
});

router.get("/grafico_leitura/:idEmpresa/:idMaquina", function(req, res) {
    discoController.pegarDadosGraficoLeitura(req, res);
})

module.exports = router;