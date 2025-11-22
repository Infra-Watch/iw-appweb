
  function cadastrar() {

    const nome_acesso = document.getElementById('nome_acesso').value;
    const descricao = document.getElementById('descricao').value;
    const fkEmpresa = sessionStorage.getItem("ID_EMPRESA");
    const peloMenosUmMarcado = Array.from(checkboxes).some(cb => cb.checked);

    let codigo = gerarCodigoPermissoes();

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
        fkEmpresaServer: fkEmpresa
      }),
    })

      .then(function (resposta) {
        console.log('resposta: ', resposta);

        if (resposta.ok) {
          alert('Cadastro realizada com sucesso');
        } else {
          alert("Não foi possível realizar cadastro, tente novamente!")
        }
      })
      .catch(erro => console.error("Erro ao realizar o fetch:", erro));

  }

function gerarCodigoPermissoes() {
    const checkboxes = document.querySelectorAll('.perm');
    var codigo = "0";

    checkboxes.forEach(cb => {
      if (cb.checked) {
        codigo += '1';
      } else {
        codigo += '0';
      }
    });
}