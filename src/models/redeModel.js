var database = require("../database/config");

function buscarDadosRedePorMaquina(idEmpresa, idMaquina) {
    const instrucaoSql = `CALL buscar_redeMaquina(${idMaquina}, ${idEmpresa});`;
    
    console.log("Executando (buscarDadosRedePorMaquina):\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarDadosRedePorEmpresa(idEmpresa) {
    const instrucaoSql = `CALL buscar_redeTotal(${idEmpresa});`;
    
    console.log("Executando (buscarDadosRedePorEmpresa):\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarDadosRedePorMaquina,
    buscarDadosRedePorEmpresa
};