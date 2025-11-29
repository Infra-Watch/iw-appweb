var express = require("express");
var router = express.Router();

var cpuController = require("../controllers/cpuController");

router.get("/kpis/:idEmpresa/:idMaquina", function(req,res){
    ramController.pegarKpis(req,res);
})

module.exports = router;