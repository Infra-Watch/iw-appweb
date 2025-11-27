const listaEmpresas = document.getElementById('lista-empresas')
const botaoFechar = document.getElementById('botao-fechar')

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
    const modal = document.getElementById("modal_config")
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
		console.log(json)
		let empresa = json[0][0];
		let query_status = json[1];
		console.log(empresa)
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
	
	console.log(botoesEdicao)
	Array.from(inputs).forEach(elem => {elem.setAttribute('disabled', true)})
	Array.from(botoesEdicao).forEach(botao => {botao.style.display = 'none'})
	tituloModal.textContent = 'Ver Detalhes da Empresa'
	botaoEditar.setAttribute('onclick', 'modoEdicao()')
	botaoEditar.setAttribute('class', 'fa-solid fa-pen-to-square')
}

function exibeErro(str) {alert(str)}