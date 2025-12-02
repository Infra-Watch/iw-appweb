var express = require("express");
var router = express.Router();

var redeController = require("../controllers/redeController");

router.get("/buscarPorMaquina/:idEmpresa/:idMaquina", function(req,res){
    redeController.buscarPorMaquina(req,res);
})

router.get("/buscarTodas/:idEmpresa", function(req,res){
    redeController.buscarTodas(req,res);
})

module.exports = router;