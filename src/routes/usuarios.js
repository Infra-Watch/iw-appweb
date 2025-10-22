var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
})

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.get("/buscarPorId/:idUsuario/:idEmpresa", function (req, res) {
    usuarioController.buscarPorId(req, res);
});

router.get("/buscarPorEmpresaECategoria/:id", function (req, res) {
    usuarioController.buscarPorEmpresaECategoria(req, res);
});

router.put("/atualizarNome", function (req,res) {
    usuarioController.atualizarNome(req,res);
});

router.put("/atualizarEmail", function (req,res) {
    usuarioController.atualizarEmail(req,res);
});

router.put("/atualizarSenha", function (req,res) {
    usuarioController.atualizarSenha(req,res);
});

router.put("/atualizarCategoriaAcesso", function (req,res) {
    usuarioController.atualizarCategoriaAcesso(req,res);
});

router.delete("/remover/:id", function (req,res) {
    usuarioController.remover(req, res);
});

module.exports = router;