var database = require("../database/config")

function buscarPorEmpresa(idEmpresa, intervalo) {
    var instrucaoSql = `CALL buscar_alertas(${idEmpresa}, ${intervalo})`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarPorEmpresa
};