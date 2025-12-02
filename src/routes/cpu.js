var express = require("express");
var router = express.Router();

var cpuController = require("../controllers/cpuController");

// KPIs
router.get("/kpis/:idEmpresa/:idMaquina", function(req,res){
    cpuController.pegarKpis(req,res);
})

// MÁQUINAS
router.get("/buscarPorEmpresa/:idEmpresa", function (req, res) {
    cpuController.buscarPorEmpresa(req, res);
});

// GRÁFICOS
router.get("/buscarGraficos/:idEmpresa/:idMaquina/:idRecurso", function (req, res) {
    cpuController.pegarGraficos(req, res);
});

module.exports = router;