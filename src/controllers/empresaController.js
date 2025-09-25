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
  var razaosocial = req.body.razaosocialServer;
  var nomefantasia = req.body.nomefantasiaServer;
  var inscestadual = req.body.inscestadualServer;
  var cnpj = req.body.cnpjServer;
  var cep = req.body.cepServer;
  var uf = req.body.ufServer;
  var cidade = req.body.cidadeServer;
  var bairro = req.body.bairroServer;
  var logradouro = req.body.logradouroServer;
  var numero = req.body.numeroServer;
  var complemento = req.body.complementoServer;
  var codigo_ativacao = Number((Math.random()*65536).toFixed()).toString(16);

  empresaModel.buscarDuplicidade(cnpj, inscestadual,razaosocial).then((resultado) => {
    if (resultado.length > 0) {
      res
        .status(401)
        .json({ mensagem: `a empresa já existe` });
    } else {
      empresaModel.cadastrarEmpresa(razaosocial, nomefantasia, inscestadual, cnpj, codigo_ativacao).then(() => {
        empresaModel.buscarFkEmpresa(cnpj).then((resposta) => {
          var fkEmpresa = resposta[0].idEmpresa;
          empresaModel.cadastrarEndereco(fkEmpresa, cep, uf, cidade, bairro,  logradouro, numero, complemento).then((resultado) => {
            res.status(201).json(resultado);
          })
      })
      })
    }
  });
}


module.exports = {
  buscarPorId,
  cadastrar,
  listar,
};
