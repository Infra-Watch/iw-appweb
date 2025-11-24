var database = require("../database/config")

function buscarPorMaquina(idEmpresa, idMaquina, intervalo) {
    var instrucaoSql = `CALL buscar_componentes(${idEmpresa}, ${idMaquina}, ${intervalo});`;

    return database.executar(instrucaoSql);
}

module.exports = {
    buscarPorMaquina
};