var empresaModel = require("../models/empresaModel");

function listar(req, res) {
  empresaModel.listar().then((resultado) => {
    res.status(200).json(resultado);
  });
}

function buscarPorId(req, res) {
  var id = req.params.id;

  empresaModel.buscarPorId(id).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function cadastrar(req, res) {
  var razaosocial = req.body.razaoSocialServer;
  var nomefantasia = req.body.nomeFantasiaServer;
  var cnpj = req.body.cnpjServer;
  var estado = req.body.estadoServer;
  var cidade = req.body.cidadeServer;
  var cep = req.body.cepServer;
  var numero = req.body.numeroServer;
  var complemento = req.body.complementoServer;
  var nome = req.body.nomeServer;
  var email = req.body.emailServer;
  var telefone = req.body.telefoneServer;
  //  var codigo_ativacao = Number((Math.random()*65536).toFixed()).toString(16);

  empresaModel.cadastrarEmpresa(
    razaosocial,
    nomefantasia, 
    cnpj, 
    estado, 
    cidade, 
    cep, 
    numero, 
    complemento, 
    nome, 
    email, 
    telefone)
    .then(() => {
      
  })
}

module.exports = {
  buscarPorId,
  cadastrar,
  listar,
};
