const listaEmpresas = document.getElementById('lista-empresas')
const botaoFechar = document.getElementById('botao-fechar')
const razaosocialElem = document.getElementById('razao_social-editar')
const nomefantasiaElem = document.getElementById('nome_fantasia-editar')
const cnpjElem = document.getElementById('cnpj-editar')
const estadoElem = document.getElementById('estado-editar')
const cidadeElem = document.getElementById('cidade-editar')
const cepElem = document.getElementById('cep-editar')
const numeroElem = document.getElementById('numero-editar')
const complementoElem = document.getElementById('complemento-editar')
const nomeElem = document.getElementById('nome_representante-editar')
const emailElem = document.getElementById('email_representante-editar')
const telefoneElem = document.getElementById('telefone_representante-editar')
const modal = document.getElementById("modal_config")

window.addEventListener('load', () => {
    exibirEmpresas();
})

botaoFechar.addEventListener('click', () => {modoVisualizacao()})

function exibirEmpresas() {
    fetch('/empresas/buscarTodas'
		, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			}
		}        
    )
	.then((response) => {
		if (response.ok) {
			return response.json();
		} else {
			exibeErro('Não foi possível exibir');
			return response.text().then(texto => console.error(texto));
		}
	})
	.then((json) => {
		if(!json)return;
		let empresas = json[0];
		let query_status = json[1];
		empresas.forEach((empresa) => {
			listaEmpresas.innerHTML += `
                <div class="usuarios">
                <div class="labels">
                    <p style="width: 20%">${empresa.nome_fantasia}</p>
                    <p style="width: 20%">${empresa.cnpj}</p>
                    <p style="width: 20%">${empresa.nome_representante}</p>
                    <p style="width: 20%">${empresa.chave_acesso_adm}</p>
                    <p style="width: 10%" onclick="configurarEmpresa(${empresa.idEmpresa})"><i class="fa-solid fa-arrow-up-right-from-square"></i></p>
                </div>
                </div>
			`
		})
	})
	.catch((error) => {
		console.error(error);
	})
}

function configurarEmpresa(idEmpresa){
	modal.setAttribute('empresa', idEmpresa)
	fetch(`/empresas/buscar/${idEmpresa}`
		, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			}
		}    
	)
	.then((response) => {
		if (response.ok) {
			return response.json()
		} else {
			exibeErro('Não foi possível exibir');
			return response.text().then(texto => console.error(texto));
		}
	})
	.then((json) => {
		if(!json)return;
		let empresa = json[0][0];
		let query_status = json[1];
		Object.entries(empresa).forEach(([key, value]) => {
			let elem = document.getElementById(`${key}-editar`)
			if (elem) {
				elem.setAttribute('value', ((value==''||value==undefined)?'Não informado':value))
				elem.setAttribute('disabled', true)
			}
		})
	})
	.catch((error) => {
		console.error(error);
	})

    abrirModal(modal)
	modoVisualizacao()
}

function atualizarEmpresa() {
	let idEmpresa = modal.getAttribute('empresa')
	let razaosocial = razaosocialElem.value
	let nomefantasia = nomefantasiaElem.value
	let cnpj = cnpjElem.value
	let estado = estadoElem.value
	let cidade = cidadeElem.value
	let cep = cepElem.value
	let numero = numeroElem.value
	let complemento = complementoElem.value
	let nome = nomeElem.value
	let email = emailElem.value
	let telefone = telefoneElem.value

	fetch('/empresas/atualizar', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
				idEmpresaServer: idEmpresa,
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
				telefoneServer: telefone
            })
        }).then(function (resposta) {
            if (resposta.ok) {
                window.alert("Cadastro de empresa editado com sucesso!");
				configurarEmpresa(idEmpresa)
				fecharModal(modal_confirma)
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

function excluirEmpresa() {
	let idEmpresa = modal.getAttribute('empresa')
	fetch(`/empresas/remover/${idEmpresa}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json"
		}
	}).then(function (resposta) {
		if (resposta.ok) {
			window.alert("Empresa deletada com sucesso!");
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

function modoEdicao() {
	let inputs = document.getElementsByTagName('input')
	let botoesEdicao = document.getElementsByClassName('botao-edicao')
	let tituloModal = document.getElementById('titulo-modal')
	let botaoEditar = document.getElementById('botao-editar')
	
	Array.from(inputs).forEach(elem => {elem.removeAttribute('disabled')})
	Array.from(botoesEdicao).forEach(botao => {botao.style.display = 'block'})
	tituloModal.textContent = 'Editar Empresa'
	botaoEditar.setAttribute('onclick', 'modoVisualizacao()')
	botaoEditar.setAttribute('class', 'fa-solid fa-eye')
}

function modoVisualizacao() {
	let inputs = document.getElementsByTagName('input')
	let botoesEdicao = document.getElementsByClassName('botao-edicao')
	let tituloModal = document.getElementById('titulo-modal')
	let botaoEditar = document.getElementById('botao-editar')
	
	Array.from(inputs).forEach(elem => {elem.setAttribute('disabled', true)})
	Array.from(botoesEdicao).forEach(botao => {botao.style.display = 'none'})
	tituloModal.textContent = 'Ver Detalhes da Empresa'
	botaoEditar.setAttribute('onclick', 'modoEdicao()')
	botaoEditar.setAttribute('class', 'fa-solid fa-pen-to-square')
}

function exibeErro(str) {alert(str)}