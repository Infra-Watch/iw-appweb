var usuarioModel = require("../models/usuarioModel");

function cadastrar(req, res){
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var chave_acesso = req.body.chave_acessoServer

    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (chave_acesso == undefined) {
        res.status(400).send("Sua chave de acesso está undefined!")
    } else {
        
        usuarioModel.cadastrar(nome, email, senha, chave_acesso)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {
        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String
                    
                    if (resultadoAutenticar.length > 0) {
                        console.log(resultadoAutenticar);
                        res.json({
                            idUsuario: resultadoAutenticar[0][0].idUsuario,
                            idEmpresa: resultadoAutenticar[0][0].idEmpresa,
                            idCategoria: resultadoAutenticar[0][0].idCategoria,
                            nome: resultadoAutenticar[0][0].nome,
                            email: resultadoAutenticar[0][0].email,
                            status_ativacao: resultadoAutenticar[0][0].status_ativacao,
                            permissoes: resultadoAutenticar[0][0].permissoes,
                        });

                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }

            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function buscarPorId(req, res){
    var idUsuario = req.params.idUsuario;
    var idEmpresa = req.params.idEmpresa;

    if (idUsuario == undefined) {
        res.status(400).send("O idUsuario está undefined!");
    } else if (idEmpresa == undefined) {
        res.status(400).send("O idEmpresa está undefined!");
    } else {
        usuarioModel.buscarPorId(idUsuario, idEmpresa)
            .then(
                function (resultado) {
                    if (resultado.length > 0) {
                        res.status(200).json(resultado);
                    } else {
                        res.status(404).send("Nenhum usuário encontrado com os parâmetros informados.");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao buscar o usuário por ID! Erro:", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function buscarPorEmpresaECategoria(req, res){
    var idCategoria = req.params.idCategoria;
    var idEmpresa = req.params.idEmpresa;

    if (idCategoria == undefined) {
        res.status(400).send("O idCategoria está undefined!");
    } else if (idEmpresa == undefined) {
        res.status(400).send("O idEmpresa está undefined!");
    } else {
        usuarioModel.buscarPorId(idCategoria, idEmpresa)
            .then(
                function (resultado) {
                    if (resultado.length > 0) {
                        res.status(200).json(resultado);
                    } else {
                        res.status(404).send("Nenhum usuário encontrado com os parâmetros informados.");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao buscar o usuário por ID! Erro:", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}



module.exports = {
    cadastrar,
    autenticar,
    buscarPorId,
    buscarPorEmpresaECategoria,

}