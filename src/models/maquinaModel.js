var database = require("../database/config")

function cadastrar(idEmpresa, macAddress, apelido) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", idEmpresa, macAddress, apelido);

    var instrucaoSql = `CALL cadastrar_maquina(${idEmpresa},"${macAddress}", "${apelido}")`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idEmpresa,macAddress,apelido]);
}


module.exports = {
    cadastrar
};