var express = require("express");
var router = express.Router();

var sistemaController = require("../controllers/sistemaController");

router.get("/kpis/:idEmpresa/:idMaquina", function(req,res){
    sistemaController.pegarKpis(req,res);
})

module.exports = router;