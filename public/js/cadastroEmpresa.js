function exibeErro(str) { alert(str) }

const formEmpresa = document.getElementById('form-empresa');
const formRepresentante = document.getElementById('form-representante');
const btnProximo = document.getElementById('btnProximo');
const btnVoltar = document.getElementById('btnVoltar');
const btnCadastrar = document.getElementById('btnCadastrar');

btnVoltar.addEventListener('click', () => {
  formRepresentante.classList.remove('active');
  formEmpresa.classList.add('active');
});

btnProximo.addEventListener('click', () => {
  formEmpresa.classList.remove('active');
  formRepresentante.classList.add('active');
});

function cadastrarEmpresa() {
  let razaosocial = document.getElementById('razaosocial').value;
  let nomefantasia = document.getElementById('nomefantasia').value;
  let cnpj = document.getElementById('cnpj').value;
  let estado = document.getElementById('estado').value;
  let cidade = document.getElementById('cidade').value;
  let cep = document.getElementById('cep').value;
  let numero = document.getElementById('numero').value;
  let complemento = document.getElementById('complemento').value;
  let nome = document.getElementById('nome').value;
  let email = document.getElementById('email').value;
  let telefone = document.getElementById('telefone').value;

  if (razaosocial == '' || nomefantasia == '' || cnpj == '' || estado == '' || cidade == '' || cep == '' || numero == '' || nome == '' || email == '' || telefone == '') {
    exibeErro('Todos os campos obrigatórios devem ser preenchidos!')
    return false

  } else if (razaosocial.length < 3) {
    exibeErro('A razão social deve ter pelo menos 3 caracteres!')
    return false

  } else if (nomefantasia.length < 3) {
    exibeErro('O nome fantasia deve ter pelo menos 3 caracteres!')
    return false

  } else if (cnpj.length != 14) {
    exibeErro('CNPJ inválido! Deve conter 14 dígitos.')
    return false

  } else if (estado.length < 2) {
    exibeErro('Selecione um estado válido!')
    return false

  } else if (cidade.length < 2) {
    exibeErro('A cidade deve ser válida!')
    return false

  } else if (cep.length != 8) {
    exibeErro('CEP inválido! Deve conter 8 dígitos.')
    return false

  } else if (isNaN(numero) || numero <= 0) {
    exibeErro('Número inválido!')
    return false

  } else if (nome.length < 3) {
    exibeErro('O nome do responsável deve ter pelo menos 3 caracteres!')
    return false

  } else if (!email.includes('@') || !email.includes('.')) {
    exibeErro('Email inválido!')
    return false

  } else if (telefone.length < 10) {
    exibeErro('Telefone inválido!')
    return false
  }

  fetch('/empresas/cadastrar', {
    method: 'Post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      razaoSocialServer: razaosocial,
      nomeFantasiaServer: nomefantasia,
      cnpjServer: cnpj,
      estadoServer: estado,
      cidadeServer: cidade,
      cepServer: cep,
      numeroServer: numero,
      complementoServer: complemento,
      nomeServer: nome,
      emailServer: email,
      telefoneServer: telefone,
    }),
  })
    .then(function (resposta) {
      console.log('resposta: ', resposta);

      if (resposta.ok) {
        alert('Cadastro realizado com sucesso!');
        window.location.reload();
      } else {
        throw 'Houve um erro ao tentar realizar o cadastro!';
      }
    })
    .catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
      alert(`#ERRO: ${resposta}`);
    });
};
