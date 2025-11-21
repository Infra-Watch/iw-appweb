var database = require("../database/config");

function buscarTodas() {
  var instrucaoSql = `CALL buscar_empresas_geral();`;
  return database.executar(instrucaoSql);
}

function buscarPorId(id) {
  var instrucaoSql = `CALL buscar_empresa(${id})`;

  return database.executar(instrucaoSql);
}

function listar() {
  var instrucaoSql = `SELECT id, razao_social, cnpj, codigo_ativacao FROM empresa`;

  return database.executar(instrucaoSql);
}

function buscarDuplicidade(cnpj, inscestadual, razaosocial) {
  var instrucaoSql = `SELECT * FROM empresa WHERE CNPJ = '${cnpj}' OR inscEstadual = '${inscestadual}' OR razaoSocial = '${razaosocial}'`;

  return database.executar(instrucaoSql);
}

function cadastrarEmpresa(razaosocial, nomefantasia, cnpj, estado, cidade, cep, numero, complemento, nome, email, telefone) {
  var instrucaoSql = `CALL cadastrar_empresa ('${razaosocial}', '${nomefantasia}', '${cnpj}', '${estado}', '${cidade}', '${cep}', '${numero}', '${complemento}', '${nome}', '${email}', '${telefone}')`;

  return database.executar(instrucaoSql);
}

function cadastrarEndereco(fkEmpresa, cep, uf, cidade, bairro,  logradouro, numero, complemento) {
  var instrucaoSql = `INSERT INTO endereco VALUES (default, '${fkEmpresa}', '${cep}', '${uf}', '${cidade}', '${bairro}', '${logradouro}', '${numero}', '${complemento}')`;

  return database.executar(instrucaoSql);
}

function buscarFkEmpresa(cnpj) {
  var instrucaoSql = `SELECT idEmpresa FROM empresa WHERE CNPJ = '${cnpj}' AND idEmpresa > 0`;

  return database.executar(instrucaoSql);
}

module.exports = {
  buscarTodas,
  buscarDuplicidade,
  buscarPorId,
  cadastrarEmpresa,
  cadastrarEndereco,
  buscarFkEmpresa,
  listar
};
