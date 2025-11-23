const idEmpresa = sessionStorage.getItem("ID_EMPRESA");

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
                            <p style="width: 20%">${categoria.permissoes}</p>
                            <p style="width: 20%" onclick="configurarCategoria(${categoria.idCategoria_acesso})"><i class="fa-solid fa-ellipsis"></i></p>
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

function exibeErro(str) {
    alert(str);
}