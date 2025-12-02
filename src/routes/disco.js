var express = require("express");
var router = express.Router();

var discoController = require("../controllers/discoController");

// Rota para buscar todos os KPIs de disco para uma máquina específica
router.get("/kpis/:idEmpresa/:idMaquina", function(req, res) {
    discoController.pegarKpis(req, res);
});

// Rota para buscar os dados de uso de disco para o gráfico de série temporal
router.get("/grafico_alertas/:idEmpresa/:idMaquina", function(req, res) {
    discoController.pegarDadosGraficoAlertas(req, res);
});

router.get("/grafico_leitura/:idEmpresa/:idMaquina", function(req, res) {
    discoController.pegarDadosGraficoLeitura(req, res);
})

module.exports = router;