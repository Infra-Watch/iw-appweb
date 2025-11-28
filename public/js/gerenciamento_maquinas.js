const modal = document.getElementById("modal_config")
const input_macaddress = document.getElementById("macaddress_editar")
const input_apelido = document.getElementById("apelido_editar")
const checkbox = document.getElementById('ativacao_editar')
const checkLabel = document.getElementById('checkLabel')

window.addEventListener('load', () => {
    exibirMaquinas();
})

function exibirMaquinas() {
    let idEmpresa = sessionStorage.ID_EMPRESA;
    fetch(`/maquinas/buscarPorEmpresa/${idEmpresa}`
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
        let maquinas = json[0];
        let query_status = json[1];
        console.log(json)
        console.log(maquinas)
        if (maquinas.length > 0) {
            maquinas.forEach(maquina => {
                document.getElementById('lista-maquinas').innerHTML+=`
                    <div class="usuarios">
                    <div class="labels">
                        <p style="width: 20%">${maquina.nome_maquina}</p>
                        <p style="width: 20%">${maquina.mac_address}</p>
                        <p style="width: 10%">${interpretarStatus(maquina.ativacao)}</p>
                        <p style="width: 10%" onclick="configurarMaquina(${maquina.idMaquina}, '${maquina.nome_maquina}', '${maquina.mac_address}', ${maquina.ativacao})"><i class="fa-solid fa-pen-to-square"></i></p>
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

function cadastrarMaquina() {
    const idEmpresa = sessionStorage.ID_EMPRESA;
    const macaddress = document.getElementById('razao').value;
    const apelido = document.getElementById('fantasia').value;

    if(!macaddress || !apelido){
    alert("Preencha todos os campos");
    return;
    }

    fetch("/maquinas/cadastrar", {
        method : "POST",
        headers: {
        "Content-Type":"application/json"
        },
        body: JSON.stringify({
        idEmpresaServer:idEmpresa,
        macAddressServer:macaddress,
        apelidoServer:apelido
        }),
    })

    .then(function (resposta) {
        if (resposta.ok) {
            alert('Máquina realizada com sucesso');
            window.location.reload();
        }else {
            alert("Não foi possível cadastrar a máquina, tente novamente")
        }
    })
    .catch(erro => console.error("Erro ao realizar o fetch:", erro));

}

function configurarMaquina(idMaquina, nome_maquina, mac_address, ativacao) {
    console.log(idMaquina, nome_maquina, mac_address, ativacao)

    modal.setAttribute('idMaquina', idMaquina)
    
    input_macaddress.setAttribute('value', mac_address)
    input_apelido.setAttribute('value', nome_maquina)
    input_apelido.value = nome_maquina
    input_macaddress.value = mac_address
    checkText(ativacao)

    abrirModal(modal)
}

function atualizarMaquina() {
    let idEmpresa = sessionStorage.ID_EMPRESA
    let idMaquina = modal.getAttribute('idMaquina')
    let ativacao = checkbox.checked? 1: 0
    let mac_address = input_macaddress.value
    let apelido = input_apelido.value

    console.log(idEmpresa, idMaquina, mac_address, apelido, ativacao)
    fetch('/maquinas/atualizar', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idEmpresaServer: idEmpresa,
            idMaquinaServer: idMaquina,
            ativacaoServer: ativacao,
            mac_addressServer: mac_address,
            apelidoServer: apelido,
        })
    }).then(function (resposta) {
        if (resposta.ok) {
            window.alert("Máquina editada com sucesso!");
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

function removerMaquina() {
    let idEmpresa = sessionStorage.ID_EMPRESA
    let idMaquina = modal.getAttribute('idMaquina')
    console.log(idEmpresa, idMaquina)

	fetch(`/maquinas/remover/${idEmpresa}/${idMaquina}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json"
		}
	}).then(function (resposta) {
		if (resposta.ok) {
			window.alert("Máquina deletada com sucesso!");
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

function checkText(ativacao) {
    switch (ativacao) {
        case 1:
            checkbox.checked = true;
            break;
        case 0:
            checkbox.checked = false;
            break;
        default:
            break;
    }

    if (checkbox.checked) {
        checkLabel.textContent = 'Ativa'
    } else {
        checkLabel.textContent = 'Inativa'
    }
}

function interpretarStatus(ativacao) {
	let str = '';
	if (!ativacao) {
		str = `Inativa`
	} else {
		str =  `Ativa`
	}
	return str
};

function exibeErro(str) {
    alert(str);
}