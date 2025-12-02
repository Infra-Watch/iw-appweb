var database = require("../database/config");

function usoMaximoPorcentagem(idEmpresa, idMaquina) {
    const instrucaoSql = `SELECT ROUND(IFNULL(MAX(leitura), 0), 2) AS uso_maximo_porcentagem
        FROM registro_coleta 
        WHERE fkRecurso = 1006 
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)};`;
    
    console.log("Executando (usoMaximoPorcentagem):\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function usoAtualPorcentagem(idEmpresa, idMaquina) {
    const instrucaoSql = `SELECT ROUND(IFNULL(leitura, 0), 2) AS uso_atual_porcentagem
        FROM registro_coleta 
        WHERE fkRecurso = 1006 
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)}
        ORDER BY data_hora DESC LIMIT 1;`;
    
    console.log("Executando (usoAtualPorcentagem):\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function velocidadeLeituraMaxima(idEmpresa, idMaquina) {
    const instrucaoSql = `SELECT ROUND(IFNULL(MAX(leitura), 0), 2) AS velocidade_leitura_maxima
        FROM registro_coleta 
        WHERE fkRecurso = 1008 
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)};`;
    
    console.log("Executando (velocidadeLeituraMaxima):\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function velocidadeLeituraMedia(idEmpresa, idMaquina) {
    const instrucaoSql = `SELECT ROUND(IFNULL(AVG(leitura), 0), 2) AS velocidade_leitura_media
        FROM registro_coleta 
        WHERE fkRecurso = 1008 
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)};`;

    console.log("Executando (velocidadeLeituraMedia): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function velocidadeLeituraAtual(idEmpresa, idMaquina) {
    const instrucaoSql = `SELECT ROUND(IFNULL(leitura, 0), 2) AS velocidade_leitura_atual
        FROM registro_coleta 
        WHERE fkRecurso = 1008 
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)}
        ORDER BY data_hora DESC LIMIT 1;`;

    console.log("Executando (velocidadeLeituraAtual): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function velocidadeEscritaMaxima(idEmpresa, idMaquina) {
    const instrucaoSql = `SELECT ROUND(IFNULL(MAX(leitura), 0), 2) AS velocidade_escrita_maxima
        FROM registro_coleta 
        WHERE fkRecurso = 1007 
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)};`;

    console.log("Executando (velocidadeEscritaMaxima): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function velocidadeEscritaMedia(idEmpresa, idMaquina) {
    const instrucaoSql = `SELECT ROUND(IFNULL(AVG(leitura), 0), 2) AS velocidade_escrita_media
        FROM registro_coleta 
        WHERE fkRecurso = 1007 
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)};`;

    console.log("Executando (velocidadeEscritaMedia): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function velocidadeEscritaAtual(idEmpresa, idMaquina) {
    const instrucaoSql = `SELECT ROUND(IFNULL(leitura, 0), 2) AS velocidade_escrita_atual
        FROM registro_coleta 
        WHERE fkRecurso = 1007 
        AND fkEmpresa = ${Number(idEmpresa)}
        AND fkMaquina = ${Number(idMaquina)}
        ORDER BY data_hora DESC LIMIT 1;`;

    console.log("Executando (velocidadeEscritaAtual): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function pegarDadosGraficoAlertas(idEmpresa, idMaquina) {
    const instrucaoSql = `
        SELECT 
            DATE(c.data_hora) AS dia,
            SUM(CASE WHEN a.nivel = 1 THEN 1 ELSE 0 END) AS qtd_atencao,
            SUM(CASE WHEN a.nivel = 2 THEN 1 ELSE 0 END) AS qtd_critico,
            COUNT(a.idAlerta) AS total_dia
        FROM alerta AS a
        INNER JOIN registro_coleta AS c 
            ON a.fkColeta = c.idColeta
        INNER JOIN recurso_monitorado AS r 
            ON c.fkRecurso = r.idRecurso
        WHERE 
            r.nome LIKE 'disco%' 
            AND c.data_hora >= DATE_SUB(NOW(), INTERVAL 6 DAY)
            AND a.fkEmpresa = ${idEmpresa}
            AND a.fkMaquina = ${idMaquina}
        GROUP BY 
            DATE(c.data_hora)
        ORDER BY 
            dia ASC; 
    `
    console.log("Executando (pegarDadosGraficoAlertas): \n" + instrucaoSql);
    return database.executar(instrucaoSql);

}

function pegarDadosGraficoLeitura(idEmpresa, idMaquina) {
    const instrucaoSql = `
        SELECT 
        DATE_FORMAT(sub.data_hora, '%H:%i:%s') AS momento_grafico,
        sub.velocidade_leitura,
        sub.velocidade_escrita
        FROM (
            SELECT 
                c.data_hora,
                SUM(CASE WHEN c.fkRecurso = 1008 THEN c.leitura ELSE 0 END) AS velocidade_leitura,
                SUM(CASE WHEN c.fkRecurso = 1007 THEN c.leitura ELSE 0 END) AS velocidade_escrita
            FROM registro_coleta AS c
            WHERE 
                c.fkEmpresa = ${idEmpresa}
                AND c.fkMaquina = ${idMaquina}
                AND c.fkRecurso IN (1007, 1008) 
            GROUP BY c.data_hora
            ORDER BY c.data_hora DESC 
            LIMIT 10 
        ) AS sub
        ORDER BY sub.data_hora ASC; 
    `
    console.log("Executando (pegarDadosGraficoLeitura): \n" + instrucaoSql);
    return database.executar(instrucaoSql);

}


module.exports = {
    usoMaximoPorcentagem,
    usoAtualPorcentagem,
    velocidadeLeituraMaxima,
    velocidadeLeituraMedia,
    velocidadeLeituraAtual,
    velocidadeEscritaMaxima,
    velocidadeEscritaMedia,
    velocidadeEscritaAtual,
    pegarDadosGraficoAlertas,
    pegarDadosGraficoLeitura
};