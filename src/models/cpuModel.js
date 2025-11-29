var database = require("../database/config");

function porcentagemUsoMaximaMedia(idEmpresa, idMaquina, intervalo) {
    intervalo = Number(intervalo) || 1;
    const instrucaoSql =
        `SELECT
            ROUND(IFNULL(MAX(leitura),0),2) AS porcentagem_uso_maxima,
            ROUND(IFNULL(AVG(leitura),0),2) AS porcentagem_uso_medio
            FROM registro_coleta WHERE fkRecurso = 1001
            AND fkEmpresa = ${Number(idEmpresa)}
            AND fkMaquina = ${Number(idMaquina)}
            AND data_hora >= NOW() - INTERVAL ${intervalo} DAY;`;


    console.log("Executando (porcentagemUsoMaxima):\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function frequenciaCPUMaximaMedia(idEmpresa, idMaquina, intervalo) {
    intervalo = Number(intervalo) || 1;
    const instrucaoSql =
        `SELECT
	        ROUND(IFNULL(MAX(leitura),0),2) AS frequencia_maxima,
            ROUND(IFNULL(AVG(leitura),0),2) AS frequencia_media
            FROM registro_coleta WHERE fkRecurso = 1002
            AND fkEmpresa = ${Number(idEmpresa)}
            AND fkMaquina = ${Number(idMaquina)}
            AND data_hora >= NOW() - INTERVAL ${intervalo} DAY;`;

    console.log("Executando (porcentagemUsoMedia): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function temperaturaCPUMaximaMedia(idEmpresa, idMaquina, intervalo) {
    intervalo = Number(intervalo) || 1;
    const instrucaoSql =
        `SELECT
	        ROUND(IFNULL(MAX(leitura),0),2) AS temperatura_maxima,
            ROUND(IFNULL(AVG(leitura),0),2) AS temperatura_media
            FROM registro_coleta WHERE fkRecurso = 1003
            AND fkEmpresa = ${Number(idEmpresa)}
            AND fkMaquina = ${Number(idMaquina)}
            AND data_hora >= NOW() - INTERVAL ${intervalo} DAY;`;

    console.log("Executando (porcentagemUsoMedia): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    porcentagemUsoMaximaMedia,
    frequenciaCPUMaximaMedia,
    temperaturaCPUMaximaMedia
};