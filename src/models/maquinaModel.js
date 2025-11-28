var database = require("../database/config")

function cadastrar(idEmpresa, macAddress, apelido) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", idEmpresa, macAddress, apelido);

    var instrucaoSql = `CALL cadastrar_maquina(${idEmpresa},"${macAddress}", "${apelido}");`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarPorEmpresa(idEmpresa) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", idEmpresa);

    var instrucaoSql = `CALL buscar_maquinas(${idEmpresa});`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarKpisGeral(idEmpresa, intervalo) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", idEmpresa, intervalo);

    var instrucaoSql = `CALL buscar_kpis_geral(${idEmpresa}, ${intervalo});`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function atualizar(idEmpresa, idMaquina, ativacao, mac_address, apelido) {
  var instrucaoSql = `CALL atualizar_maquina(${idEmpresa}, ${idMaquina}, ${ativacao}, ${mac_address}, ${apelido})`;

  return database.executar(instrucaoSql);
}

function remover(idEmpresa, idMaquina) {
  var instrucaoSql = `CALL remover_maquina(${idEmpresa}, ${idMaquina})`;

  return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar,
    buscarPorEmpresa,
    buscarKpisGeral,
    atualizar,
    remover
};