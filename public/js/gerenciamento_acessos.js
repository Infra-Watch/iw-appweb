const idEmpresa = sessionStorage.getItem("ID_EMPRESA");
const modal = document.getElementById("modal_config")
const input_categoria = document.getElementById("nome_acesso_editar")
const input_descricao = document.getElementById("descricao_editar")
const check_dashboard = document.getElementById("check_dashboard")
const check_maquinas = document.getElementById("check_maquinas")
const check_acessos = document.getElementById("check_acessos")

window.addEventListener('load', () => {
    exibirCategorias();
})

function cadastrar() {
    
    let checkboxes = document.querySelectorAll('.perm');
    const nome_acesso = document.getElementById('nome_acesso').value;
    const descricao = document.getElementById('descricao').value;
    const peloMenosUmMarcado = Array.from(checkboxes).some(cb => cb.checked);
    const codigo = gerarCodigoPermissoes();

    if (!nome_acesso || !descricao) {
      alert("Preencha todos os campos");
      return;
    }

    if (!peloMenosUmMarcado) {
      alert("Selecione pelo menos uma permissão.");
      return;
    }

    fetch("/acessos/cadastrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nomeAcessoServer: nome_acesso,
        descricaoServer: descricao,
        codPermissoesServer: codigo,
        fkEmpresaServer: idEmpresa
      }),
    })

      .then(function (resposta) {
        console.log('resposta: ', resposta);

        if (resposta.ok) {
            alert('Cadastro realizada com sucesso');
            window.location.reload();
        } else {
          alert("Não foi possível realizar cadastro, tente novamente!")
        }
      })
      .catch(erro => console.error("Erro ao realizar o fetch:", erro));
}

function exibirCategorias() {
    fetch(`/acessos/buscarPorEmpresa/${idEmpresa}`
    , {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }
    )
    .then((resposta) => {
        if (resposta.ok) {
            return resposta.json();
        } else {
            exibeErro('Não foi possível exibir máquinas');
            return resposta.text().then(texto => console.error(texto));
        
        }
    })
    .then((json) => {
        if(!json)return;
        let categorias = json[0];
        let query_status = json[1];
        console.log(json)
        console.log(categorias)
        if (categorias.length > 0) {
            categorias.forEach(categoria => {
            
                console.log(JSON.parse(categoria.chaves_geradas))
                document.getElementById('lista-acessos').innerHTML+=`
                    <div class="usuarios">
                        <div class="labels">
                            <p style="width: 20%">${categoria.categoria}</p>
                            <p style="width: 20%">${categoria.descricao}</p>
                            <p style="width: 20%">${traduzirPermissoes(categoria.permissoes)}</p>
                            <p style="width: 20%" onclick="configurarCategoria(${categoria.idCategoria_acesso}, '${categoria.categoria}', '${categoria.descricao}', '${categoria.permissoes}')"><i class="fa-solid fa-pen-to-square"></i></p>
                        </div>
                    </div>
                `
            });
        } else {

        }
    })
    .catch((erro) => {
        console.error(erro);
    });
}

function configurarCategoria(idCategoria, categoria, descricao, permissoes){
  console.log(idCategoria, categoria, descricao, permissoes)
  
  modal.setAttribute('idCategoria', idCategoria)

  input_categoria.setAttribute('value', categoria)
  input_descricao.setAttribute('value', descricao)
  input_categoria.value = categoria
  input_descricao.value = descricao
  setarChecks(permissoes);

  abrirModal(modal)
}

function atualizarAcesso() {
  let idEmpresa = sessionStorage.ID_EMPRESA
  let idCategoria = modal.getAttribute('idCategoria')
  let categoria = input_categoria.value
  let descricao = input_descricao.value
  let permissoes = permissoesEditar()

  console.log(idEmpresa, idCategoria, categoria, descricao, permissoes)

  fetch('/acessos/atualizar', {
    method: "PUT",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        idEmpresaServer: idEmpresa,
        idCategoriaServer: idCategoria,
        categoriaServer: categoria,
        descricaoServer: descricao,
        permissoesServer: permissoes,
    })
  }).then(function (resposta) {
    if (resposta.ok) {
      window.alert("Categoria de acessos editada com sucesso!");
      window.location.reload()
    } else if (resposta.status == 404) {
      window.alert("Deu 404!");
    } else {
      alert('Erro ao atualizar cadastro!')
      throw ("Houve um erro ao tentar realizar a postagem! Código da resposta: " + resposta.status);
    }
  }).catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
  });
}

function removerAcesso() {
  let idEmpresa = sessionStorage.ID_EMPRESA
  let idCategoria = modal.getAttribute('idCategoria')
  
  console.log(idEmpresa, idCategoria)
	fetch(`/acessos/remover/${idEmpresa}/${idCategoria}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json"
		}
	}).then(function (resposta) {
		if (resposta.ok) {
			window.alert("Categoria deletada com sucesso!");
			window.location.reload();
		} else if (resposta.status == 404) {
			window.alert("Deu 404!");
		} else {
			throw ("Houve um erro ao tentar realizar a postagem! Código da resposta: " + resposta.status);
		}
	}).catch(function (resposta) {
		console.log(`#ERRO: ${resposta}`);
	});
}

function gerarCodigoPermissoes() {
    let checkboxes = document.querySelectorAll('.perm');
    var codigo = "0";

    checkboxes.forEach(cb => {
      if (cb.checked) {
        codigo += '1';
      } else {
        codigo += '0';
      }
    });
    return codigo;
}

function permissoesEditar() {
    let checkboxes = Array.of(check_dashboard, check_maquinas, check_acessos)
    var codigo = "0";

    checkboxes.forEach(cb => {
      if (cb.checked) {
        codigo += '1';
      } else {
        codigo += '0';
      }
    });
    return codigo;
}

function traduzirPermissoes(permissoes) {
  if (permissoes == 'undefined') {
    return 'Não configurado'
  }

  let permissoesText = [];

  permissoes = permissoes.split('').map(str => {return (Number(str))})
  permissoes[0] == 1? permissoesText.push('Colaborador'): '';
  permissoes[1] == 1? permissoesText.push('Visualizar dashboard'): '';
  permissoes[2] == 1? permissoesText.push('Gerenciamento de máquinas'): '';
  permissoes[3] == 1? permissoesText.push('Gerenciamento de acessos'): '';
  return permissoesText.join()
}

function setarChecks(permissoes) {  
  if (permissoes == 'undefined') {
    check_dashboard.checked = false;
    check_maquinas.checked = false;
    check_acessos.checked = false;
  }

  permissoes = permissoes.split('').map(str => {return (Number(str))})
  permissoes[1] == 1? check_dashboard.checked = true: check_dashboard.checked = false
  permissoes[2] == 1? check_maquinas.checked = true: check_maquinas.checked = false
  permissoes[3] == 1? check_acessos.checked = true: check_acessos.checked = false
}

function exibeErro(str) {
    alert(str);
}