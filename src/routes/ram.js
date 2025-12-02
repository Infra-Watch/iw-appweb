    var express = require("express");
    var router = express.Router();

    var ramController = require("../controllers/ramController");

    router.get("/kpis/:idEmpresa/:idMaquina", function(req,res){
        ramController.pegarKpis(req,res);
    });

    router.get("/componentes/:idEmpresa/:idMaquina/:intervalo", function (req,res) {
        ramController.buscarComponentes(req,res);
    });

    router.get("/historico-porcentagem/:idEmpresa/:idMaquina/:dias", function(req, res) {
        ramController.buscarHistoricoPorcentagem(req, res);
    });

    router.get("/historico-gb/:idEmpresa/:idMaquina/:dias", function(req, res) {
        ramController.buscarHistoricoGb(req, res);
    });

    router.get("/previsao-uso-ram/:idEmpresa/:idMaquina/:dias", function(req, res) {
        ramController.buscarPrevisaoUsoRam(req, res);
    });

    module.exports = router;