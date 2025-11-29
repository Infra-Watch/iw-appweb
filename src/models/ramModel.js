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


module.exports = {
    porcentagemUsoMaxima,
    porcentagemUsoMedia,
    utilizacaoGbMaxima,
    utilizacaoGbMedia
};