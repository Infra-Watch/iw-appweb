var empresaModel = require("../models/empresaModel");

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

function buscarTodas(req, res) {
    empresaModel.buscarTodas()
    .then((response) => {
        console.log(response.data)
        res.json(response)
    })
    .catch((error) => {
        res.status(500).json(error.sqlMessage)
    })
}

function buscarPorId(req, res) {
    var idEmpresa = req.params.idEmpresa;

    switch (undefined) {
        case idEmpresa:
            res.status(400).send("id Empresa está undefined!");
            break;
        default:
            break;
    }

    empresaModel.buscarPorId(idEmpresa)
    .then((response) => {
        console.log(response.data)
        res.json(response)
    })
    .catch((error) => {
        res.status(500).json(error.sqlMessage)
    })
}

module.exports = {
  buscarPorId,
  buscarTodas,
  cadastrar,
};
