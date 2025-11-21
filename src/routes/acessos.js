var express = require("express");
var router = express.Router();

var acessosController = require("../controllers/acessosController");


router.post("/cadastrar", function (req, res) {
    acessosController.cadastrar(req, res);
});

module.exports = router;