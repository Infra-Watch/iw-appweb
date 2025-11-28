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

function remover(req, res) {
    var idEmpresa = req.params.idEmpresa;

    switch (undefined) {
        case idEmpresa:
            res.status(400).send("id Empresa está undefined!");
            break;
        default:
            break;
    }

    empresaModel.remover(idEmpresa)
    .then((response) => {
        console.log(response.data)
        res.json(response)
    })
    .catch((error) => {
        res.status(500).json(error.sqlMessage)
    })
}

function atualizar(req, res) {
    var idEmpresa = req.body.idEmpresaServer;
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

    if (idEmpresa === undefined || idEmpresa === "Não informado") {
        idEmpresa = null;
    } else {
        idEmpresa = `'${idEmpresa}'`;
    }

    if (razaosocial === undefined || razaosocial === "Não informado") {
        razaosocial = null;
    } else {
        razaosocial = `'${razaosocial}'`;
    }

    if (nomefantasia === undefined || nomefantasia === "Não informado") {
        nomefantasia = null;
    } else {
        nomefantasia = `'${nomefantasia}'`;
    }

    if (cnpj === undefined || cnpj === "Não informado") {
        cnpj = null;
    } else {
        cnpj = `'${cnpj}'`;
    }

    if (estado === undefined || estado === "Não informado") {
        estado = null;
    } else {
        estado = `'${estado}'`;
    }

    if (cidade === undefined || cidade === "Não informado") {
        cidade = null;
    } else {
        cidade = `'${cidade}'`;
    }

    if (cep === undefined || cep === "Não informado") {
        cep = null;
    } else {
        cep = `'${cep}'`;
    }

    if (numero === undefined || numero === "Não informado") {
        numero = null;
    } else {
        numero = `'${numero}'`;
    }

    if (complemento === undefined || complemento === "Não informado") {
        complemento = null;
    } else {
        complemento = `'${complemento}'`;
    }

    if (nome === undefined || nome === "Não informado") {
        nome = null;
    } else {
        nome = `'${nome}'`;
    }

    if (email === undefined || email === "Não informado") {
        email = null;
    } else {
        email = `'${email}'`;
    }

    if (telefone === undefined || telefone === "Não informado") {
        telefone = null;
    } else {
        telefone = `'${telefone}'`;
    }

    empresaModel.atualizarEmpresa(
        idEmpresa,
        razaosocial,
        cnpj, 
        nomefantasia, 
        nome,
        email, 
        telefone,
        cep,
        numero, 
        complemento, 
        cidade, 
        estado
    ).then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao deletar o post: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

module.exports = {
  buscarPorId,
  buscarTodas,
  cadastrar,
  atualizar,
  remover
};
