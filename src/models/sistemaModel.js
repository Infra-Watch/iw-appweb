var database = require("../database/config");

function qtdProcessosMaxima(idEmpresa,idMaquina, intervalo) {
    intervalo = Number(intervalo) || 1;
    const instrucaoSql = `SELECT ROUND(IFNULL(MAX(leitura),0),2) AS qtd_processos_maxima
        FROM registro_coleta WHERE fkRecurso = 1011
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)}
        AND data_hora >= NOW() - INTERVAL ${intervalo} DAY;`;
    
    console.log("Executando (qtdProcessosMaxima):\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function qtdProcessosMedia(idEmpresa,idMaquina,intervalo) {
    intervalo = Number(intervalo) || 1;
    const instrucaoSql = `SELECT ROUND(IFNULL(AVG(leitura),0),2) AS qtd_processos_media
        FROM registro_coleta WHERE fkRecurso = 1011
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)}
        AND data_hora >= NOW() - INTERVAL ${intervalo} DAY;`

    console.log("Executando (qtdProcessosMedia): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function qtdThreadsMaxima(idEmpresa,idMaquina,intervalo) {
    intervalo = Number(intervalo) || 1;
    const instrucaoSql = `SELECT ROUND(IFNULL(MAX(leitura),0),2) AS qtd_threads_maxima
        FROM registro_coleta WHERE fkRecurso = 1013
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)}
        AND data_hora >= NOW() - INTERVAL ${intervalo} DAY;`

    console.log("Executando (qtdThreadsMaxima): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function qtdThreadsMedia(idEmpresa,idMaquina,intervalo) {
    intervalo = Number(intervalo) || 1;
    const instrucaoSql = `SELECT ROUND(IFNULL(AVG(leitura),0),2) AS qtd_threads_media
        FROM registro_coleta WHERE fkRecurso = 1013
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)}
        AND data_hora >= NOW() - INTERVAL ${intervalo} DAY;`

    console.log("Executando (qtdThreadsMedia): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function qtdServicosMaxima(idEmpresa,idMaquina,intervalo) {
    intervalo = Number(intervalo) || 1;
    const instrucaoSql = `SELECT ROUND(IFNULL(MAX(leitura),0),2) AS qtd_servicos_maxima
        FROM registro_coleta WHERE fkRecurso = 1012
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)}
        AND data_hora >= NOW() - INTERVAL ${intervalo} DAY;`

    console.log("Executando (qtdServicosMaxima): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function qtdServicosMedia(idEmpresa,idMaquina,intervalo) {
    intervalo = Number(intervalo) || 1;
    const instrucaoSql = `SELECT ROUND(IFNULL(AVG(leitura),0),2) AS qtd_servicos_media
        FROM registro_coleta WHERE fkRecurso = 1012
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)}
        AND data_hora >= NOW() - INTERVAL ${intervalo} DAY;`

    console.log("Executando (qtdServicosMedia): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    qtdProcessosMaxima,
    qtdProcessosMedia,
    qtdThreadsMaxima,
    qtdThreadsMedia,
    qtdServicosMaxima,
    qtdServicosMedia
};