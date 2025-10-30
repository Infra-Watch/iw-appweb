 const formEmpresa = document.getElementById('form-empresa');
    const formRepresentante = document.getElementById('form-representante');
    const btnProximo = document.getElementById('btnProximo');
    const btnVoltar = document.getElementById('btnVoltar');

    btnProximo.addEventListener('click', () => {
      formEmpresa.classList.remove('active');
      formRepresentante.classList.add('active');
    });

    btnVoltar.addEventListener('click', () => {
      formRepresentante.classList.remove('active');
      formEmpresa.classList.add('active');
    });