var database = require("../database/config");

function processosMaximo(idEmpresa, idMaquina, intervalo) {
    intervalo = Number(intervalo) || 1;
    const instrucaoSql = `SELECT ROUND(IFNULL(MAX(leitura),0),2) AS qtde_processos_maximo
        FROM registro_coleta WHERE fkRecurso = 1011
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)}
        AND data_hora >= NOW() - INTERVAL ${intervalo} DAY;`;

    console.log("Executando (processosMaximo):\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function processosMedia(idEmpresa, idMaquina, intervalo) {
    intervalo = Number(intervalo) || 1;
    const instrucaoSql = `SELECT ROUND(IFNULL(AVG(leitura),0),2) AS qtde_processos_media
        FROM registro_coleta WHERE fkRecurso = 1011
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)}
        AND data_hora >= NOW() - INTERVAL ${intervalo} DAY;`

    console.log("Executando (processosMedia): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function threadsMaximo(idEmpresa, idMaquina, intervalo) {
    intervalo = Number(intervalo) || 1;
    const instrucaoSql = `SELECT ROUND(IFNULL(MAX(leitura),0),2) AS qtde_threads_maximo
        FROM registro_coleta WHERE fkRecurso = 1013
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)}
        AND data_hora >= NOW() - INTERVAL ${intervalo} DAY;`

    console.log("Executando (threadsMaximo): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function threadsMedia(idEmpresa, idMaquina, intervalo) {
    intervalo = Number(intervalo) || 1;
    const instrucaoSql = `SELECT ROUND(IFNULL(AVG(leitura),0),2) AS qtde_threads_media
        FROM registro_coleta WHERE fkRecurso = 1013
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)}
        AND data_hora >= NOW() - INTERVAL ${intervalo} DAY;`

    console.log("Executando (threadsMedia): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function servicosMaximo(idEmpresa, idMaquina, intervalo) {
    intervalo = Number(intervalo) || 1;
    const instrucaoSql = `SELECT ROUND(IFNULL(MAX(leitura),0),2) AS qtde_servicos_maximo
        FROM registro_coleta WHERE fkRecurso = 1012
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)}
        AND data_hora >= NOW() - INTERVAL ${intervalo} DAY;`

    console.log("Executando (servicosMaximo): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function servicosMedia(idEmpresa, idMaquina, intervalo) {
    intervalo = Number(intervalo) || 1;
    const instrucaoSql = `SELECT ROUND(IFNULL(AVG(leitura),0),2) AS qtde_servicos_media
        FROM registro_coleta WHERE fkRecurso = 1012
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)}
        AND data_hora >= NOW() - INTERVAL ${intervalo} DAY;`

    console.log("Executando (servicosMedia): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


module.exports = {
    processosMaximo,
    processosMedia,
    threadsMaximo,
    threadsMedia,
    servicosMaximo,
    servicosMedia
};