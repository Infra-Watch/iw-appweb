var express = require("express");
var router = express.Router();

var sistemaController = require("../controllers/sistemaController");

router.get("/kpis/:idEmpresa/:idMaquina", function(req,res){
    sistemaController.pegarKpis(req,res);
});

router.get("/leituras/:idEmpresa/:idMaquina", function(req, res){
    sistemaController.buscarLeituras(req, res);
});

router.get("/componentes/:idEmpresa/:idMaquina/:intervalo", function (req,res) {
    ramController.buscarComponentes(req,res);
});
module.exports = router;
