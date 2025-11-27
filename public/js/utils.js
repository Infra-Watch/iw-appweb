function habilitar(idElement) {
    idElement.style.display = 'flex'
};
function desabilitar(idElement) {
    idElement.style.display = 'none'
};

function abrirModal(idElement) {
    idElement.showModal();
};
function fecharModal(idElement) {
    idElement.close();
};

function confirmarExecucao(funcao) {
    abrirModal(modal_confirma)
    button_confirma.setAttribute("onclick", `${funcao}`) 
};