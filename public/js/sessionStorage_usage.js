window.onload = () => {
    usuario = document.getElementById("nome_usuario");
    empresa = document.getElementById("nome_empresa");

    usuario.innerHTML = sessionStorage.NOME_USUARIO;
    empresa.innerHTML = sessionStorage.NOME_EMPRESA;
}
