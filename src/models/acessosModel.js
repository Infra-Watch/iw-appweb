var database = require("../database/config")

function cadastrar(nome_acesso, descricao, codigo, fkEmpresa) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome_acesso, descricao, codigo, fkEmpresa);

    var instrucaoSql = `CALL criar_categoria_acesso("${nome_acesso}","${descricao}", "${codigo}", "${fkEmpresa}");`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [nome_acesso, descricao, codigo, fkEmpresa]);
}

function buscarPorEmpresa(idEmpresa) {
  var instrucaoSql = `CALL buscar_categoria_acesso(${idEmpresa})`;

  return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar,
    buscarPorEmpresa
};