const listaEmpresas = document.getElementById('lista-empresas')

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
                    <p style="width: 10%" onclick="configurarEmpresa(${empresa.idEmpresa})"><i class="fa-solid fa-ellipsis"></i></p>
                </div>
                </div>
			`
		})
	})
	.catch((error) => {
		console.error(error);
	})
}

window.addEventListener('load', () => {
    exibirEmpresas();
})

function exibeErro(str) {alert(str)}