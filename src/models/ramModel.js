var database = require("../database/config");

function porcentagemUsoMaxima(idEmpresa,idMaquina ) {
    const instrucaoSql = `SELECT ROUND(IFNULL(MAX(leitura),0),2) AS porcentagem_uso_maxima
        FROM registro_coleta WHERE fkRecurso = 1004
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)};`;
    
    console.log("Executando (porcentagemUsoMaxima):\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function porcentagemUsoMedia(idEmpresa,idMaquina) {
    
        console.log(idEmpresa)
        console.log(idMaquina)
    const instrucaoSql = `SELECT ROUND(IFNULL(AVG(leitura),0),2) AS porcentagem_uso_media
        FROM registro_coleta WHERE fkRecurso = 1004
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)};`

    console.log("Executando (porcentagemUsoMedia): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function utilizacaoGbMaxima(idEmpresa,idMaquina) {
    const instrucaoSql = `SELECT ROUND(IFNULL(MAX(leitura),0),2) AS utilizacao_gb_maxima
        FROM registro_coleta WHERE fkRecurso = 1005
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)};`

    console.log("Executando (porcentagemUsoMedia): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function utilizacaoGbMedia(idEmpresa,idMaquina) {
    const instrucaoSql = `SELECT ROUND(IFNULL(AVG(leitura),0),2) AS utilizacao_gb_media
        FROM registro_coleta WHERE fkRecurso = 1005
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)};`

    console.log("Executando (porcentagemUsoMedia): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarComponentes(idEmpresa, idMaquina, intervalo = 1) {
    const instrucaoSql = `CALL buscar_componentes(${Number(idEmpresa)}, ${Number(idMaquina)}, ${Number(intervalo)});`;
    console.log("Executando (buscarComponentes): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function previsaoUsoRamPorHora(idEmpresa, idMaquina, dias = 7) {
    const instrucaoSql = `SELECT DATE_FORMAT(data_hora, '%Y-%m-%d %H:00:00') AS hora, 
            ROUND(AVG(leitura), 4) AS media_leitura
        FROM registro_coleta
        WHERE fkRecurso = 1004
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)}
        AND data_hora >= DATE_SUB(NOW(), INTERVAL ${Number(dias)} DAY)
        GROUP BY hora ORDER BY hora;`;

    console.log("Executando (previsaoUsoRamPorHora): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function historicoPorcentagem(idEmpresa, idMaquina, dias = 1) {
    const instrucaoSql = `SELECT leitura AS valor, DATE_FORMAT(data_hora, '%Y-%m-%d %H:%i:%s') AS data_hora
        FROM registro_coleta
        WHERE fkRecurso = 1004
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)}
        AND data_hora >= DATE_SUB(NOW(), INTERVAL ${Number(dias)} DAY)
        ORDER BY data_hora limit 10;`;
    console.log("Executando (historicoPorcentagem): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function historicoGb(idEmpresa, idMaquina, dias = 1) {
    const instrucaoSql = `SELECT leitura AS valor, DATE_FORMAT(data_hora, '%Y-%m-%d %H:%i:%s') AS data_hora
        FROM registro_coleta
        WHERE fkRecurso = 1005
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)}
        AND data_hora >= DATE_SUB(NOW(), INTERVAL ${Number(dias)} DAY)
        ORDER BY data_hora;`;
    console.log("Executando (historicoGb): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    porcentagemUsoMaxima,
    porcentagemUsoMedia,
    utilizacaoGbMaxima,
    utilizacaoGbMedia,
    buscarComponentes,
    previsaoUsoRamPorHora,
    historicoPorcentagem,
    historicoGb
};
