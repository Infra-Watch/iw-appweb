var express = require("express");
var router = express.Router();

var ramController = require("../controllers/ramController");

router.get("/kpis/:idEmpresa/:idMaquina", function(req,res){
    ramController.pegarKpis(req,res);
})

module.exports = router;