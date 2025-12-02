var database = require("../database/config");

// ======= BUSCANDO MAQUINAS PARA O SELECT OPTION =======
function buscarPorEmpresa(idEmpresa) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", idEmpresa);

    var instrucaoSql = `CALL buscar_maquinas(${idEmpresa});`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


// ======= KPIs =======
function porcentagemUsoMedia(idEmpresa, idMaquina, intervalo) {
    intervalo = Number(intervalo) || 1;
    const instrucaoSql =
        `SELECT
            ROUND(IFNULL(AVG(leitura),0),2) AS porcentagem_uso_media
            FROM registro_coleta WHERE fkRecurso = 1001
            AND fkEmpresa = ${Number(idEmpresa)}
            AND fkMaquina = ${Number(idMaquina)}
            AND data_hora >= NOW() - INTERVAL ${intervalo} DAY;`;


    console.log("Executando (porcentagemUsoMedia):\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function frequenciaMedia(idEmpresa, idMaquina, intervalo) {
    intervalo = Number(intervalo) || 1;
    const instrucaoSql =
        `SELECT
            ROUND(IFNULL(AVG(leitura),0),2) AS frequencia_media
            FROM registro_coleta WHERE fkRecurso = 1002
            AND fkEmpresa = ${Number(idEmpresa)}
            AND fkMaquina = ${Number(idMaquina)}
            AND data_hora >= NOW() - INTERVAL ${intervalo} DAY;`;

    console.log("Executando (frequenciaMedia): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function temperaturaMedia(idEmpresa, idMaquina, intervalo) {
    intervalo = Number(intervalo) || 1;
    const instrucaoSql =
        `SELECT
            ROUND(IFNULL(AVG(leitura),0),2) AS temperatura_media
            FROM registro_coleta WHERE fkRecurso = 1003
            AND fkEmpresa = ${Number(idEmpresa)}
            AND fkMaquina = ${Number(idMaquina)}
            AND data_hora >= NOW() - INTERVAL ${intervalo} DAY;`;

    console.log("Executando (temperaturaMedia): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


// ======= GRÁFICOS =======
function usoAtual(idEmpresa, idMaquina, idRecurso) {
    const instrucaoSql =
        `SELECT
            MAX(CASE WHEN nivel = 1 THEN valor END) AS limite_amarelo,
            MAX(CASE WHEN nivel = 2 THEN valor END) AS limite_vermelho
            FROM parametro
            WHERE fkEmpresa = ${Number(idEmpresa)}
            AND fkMaquina = ${Number(idMaquina)}
            AND fkRecurso = ${Number(idRecurso)};
            
        SELECT
            p.limite_amarelo,
            p.limite_vermelho,
            rc.ultima_leitura
        FROM (
            SELECT
                MAX(CASE WHEN nivel = 1 THEN valor END) AS limite_amarelo,
                MAX(CASE WHEN nivel = 2 THEN valor END) AS limite_vermelho
        FROM parametro
        WHERE fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)}
        AND fkRecurso = ${Number(idRecurso)}
        ) AS p
        CROSS JOIN (
            SELECT leitura AS ultima_leitura
            FROM registro_coleta
            WHERE fkEmpresa = ${Number(idEmpresa)}
            AND fkMaquina = ${Number(idMaquina)}
            AND fkRecurso = ${Number(idRecurso)}
            ORDER BY data_hora DESC
            LIMIT 1
        ) AS rc;`;
}

function frequenciaAtual(idEmpresa, idMaquina, idRecurso) {
    const instrucaoSql =
        `SELECT
            MAX(CASE WHEN nivel = 1 THEN valor END) AS limite_amarelo,
            MAX(CASE WHEN nivel = 2 THEN valor END) AS limite_vermelho
            FROM parametro
            WHERE fkEmpresa = ${Number(idEmpresa)}
            AND fkMaquina = ${Number(idMaquina)}
            AND fkRecurso = ${Number(idRecurso)};
            
        SELECT
            p.limite_amarelo,
            p.limite_vermelho,
            rc.ultima_leitura
        FROM (
            SELECT
                MAX(CASE WHEN nivel = 1 THEN valor END) AS limite_amarelo,
                MAX(CASE WHEN nivel = 2 THEN valor END) AS limite_vermelho
        FROM parametro
        WHERE fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)}
        AND fkRecurso = ${Number(idRecurso)}
        ) AS p
        CROSS JOIN (
            SELECT leitura AS ultima_leitura
            FROM registro_coleta
            WHERE fkEmpresa = ${Number(idEmpresa)}
            AND fkMaquina = ${Number(idMaquina)}
            AND fkRecurso = ${Number(idRecurso)}
            ORDER BY data_hora DESC
            LIMIT 1
        ) AS rc;`;
}

function temperaturaAtual(idEmpresa, idMaquina, idRecurso) {
    const instrucaoSql =
        `SELECT
            MAX(CASE WHEN nivel = 1 THEN valor END) AS limite_amarelo,
            MAX(CASE WHEN nivel = 2 THEN valor END) AS limite_vermelho
            FROM parametro
            WHERE fkEmpresa = ${Number(idEmpresa)}
            AND fkMaquina = ${Number(idMaquina)}
            AND fkRecurso = ${Number(idRecurso)};
            
        SELECT
            p.limite_amarelo,
            p.limite_vermelho,
            rc.ultima_leitura
        FROM (
            SELECT
                MAX(CASE WHEN nivel = 1 THEN valor END) AS limite_amarelo,
                MAX(CASE WHEN nivel = 2 THEN valor END) AS limite_vermelho
        FROM parametro
        WHERE fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)}
        AND fkRecurso = ${Number(idRecurso)}
        ) AS p
        CROSS JOIN (
            SELECT leitura AS ultima_leitura
            FROM registro_coleta
            WHERE fkEmpresa = ${Number(idEmpresa)}
            AND fkMaquina = ${Number(idMaquina)}
            AND fkRecurso = ${Number(idRecurso)}
            ORDER BY data_hora DESC
            LIMIT 1
        ) AS rc;`;
}

module.exports = {
    buscarPorEmpresa,
    porcentagemUsoMedia,
    frequenciaMedia,
    temperaturaMedia,
    usoAtual,
    frequenciaAtual,
    temperaturaAtual
};