
const modal = document.querySelector("#modal");
const btt_abrir = document.querySelector("#abrir-modal");
const btt_fechar = document.querySelector("#fechar-modal");

btt_abrir.addEventListener('click', () => modal.showModal());
btt_fechar.addEventListener('click', () => modal.close());


modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.close();
});