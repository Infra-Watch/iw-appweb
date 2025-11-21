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
                        <p style="width: 10%" onclick="configurarMaquina(${maquina.idMaquina})"><i class="fa-solid fa-ellipsis"></i></p>
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

window.addEventListener('load', () => {
    exibirMaquinas();
})

function interpretarStatus(ativacao) {
	let str = '';
	if (!ativacao) {
		str = `Desligada`
	} else {
		str =  `Ligada`
	}
	return str
};

function exibeErro(str) {
    alert(str);
}