const idEmpresa = sessionStorage.ID_EMPRESA;
const intervalo = sessionStorage.INTERVALO_DIAS != undefined ? sessionStorage.INTERVALO_DIAS : 1;

const selectMaquinas = document.getElementById('maquina-exibe');
const painelGeral = document.getElementById('graficos');

let intervaloAtualizacao;
let graficoProcessos = null;
let graficoThreads = null;

window.addEventListener('load', () => {
  exibirMaquinas();
  iniciarGraficos();
});

selectMaquinas.addEventListener('change', () => {
  atualizarGraficos();
});

async function iniciarGraficos() {
  intervaloAtualizacao = setInterval(atualizarGraficos, 10000);
}

async function atualizarGraficos() {
  const idMaquina = selectMaquinas.value;

  if (!idMaquina || idMaquina == 0) {
    painelGeral.innerHTML = `<h1>Selecione uma máquina para visualizar os detalhes</h1>`;
    return;
  }

  exibirKpis();
  const componentes = await buscarLeiturasHistoricas();
  plotarGraficos(componentes);
}

async function buscarLeiturasHistoricas() {
  const idMaquina = selectMaquinas.value;
  const res = await fetch(`/sistema/leituras/${idEmpresa}/${idMaquina}`);
  const dados = await res.ok ? await res.json() : [];

  const processos = [];
  const servicos = [];
  const threads = [];
  const cpu = [];
  const ram = [];

  for (let i = 0; i < dados.length; i++) {
    if (dados[i].fkRecurso === 1011) processos.push(dados[i].leitura);
    else if (dados[i].fkRecurso === 1012) servicos.push(dados[i].leitura);
    else if (dados[i].fkRecurso === 1013) threads.push(dados[i].leitura);
    else if (dados[i].fkRecurso === 1001) cpu.push(dados[i].leitura);
    else if (dados[i].fkRecurso === 1004) ram.push(dados[i].leitura);
  }

  return { processos, servicos, threads, cpu, ram };
}

function exibirMaquinas() {
  fetch(`/maquinas/buscarPorEmpresa/${idEmpresa}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.ok ? res.json() : null)
    .then(json => {
      if (!json) return;
      const maquinas = json[0];
      maquinas.forEach(maquina => {
        selectMaquinas.innerHTML += `<option value="${maquina.idMaquina}">${maquina.nome_maquina} | ${maquina.mac_address}</option>`;
      });
    })
    .catch(erro => console.error(erro));
}

function exibirKpis() {
  const idMaquina = selectMaquinas.value;
  if (!idMaquina || idMaquina == 0) return;

  const bkp = document.querySelectorAll('.kpis .kpi b');
  bkp.forEach(b => b.innerHTML = '...');

  fetch(`/sistema/kpis/${idEmpresa}/${idMaquina}`)
    .then(res => res.ok ? res.json() : null)
    .then(json => {
      if (!json) {
        bkp.forEach(b => b.innerHTML = '-');
        return;
      }

      const processosMax = Number(json.qtd_processos_maxima) || 0;
      const processosMed = Number(json.qtd_processos_media) || 0;
      const threadsMax = Number(json.qtd_threads_maxima) || 0;
      const threadsMed = Number(json.qtd_threads_media) || 0;
      const servicosMax = Number(json.qtd_servicos_maxima) || 0;
      const servicosMed = Number(json.qtd_servicos_media) || 0;

      if (bkp.length >= 6) {
        bkp[0].innerHTML = `${processosMax}`;
        bkp[1].innerHTML = `${processosMed}`;
        bkp[2].innerHTML = `${threadsMax}`;
        bkp[3].innerHTML = `${threadsMed}`;
        bkp[4].innerHTML = `${servicosMax}`;
        bkp[5].innerHTML = `${servicosMed}`;
      }
    })
    .catch(err => {
      console.error(err);
      bkp.forEach(b => b.innerHTML = 'erro');
    });
}

function plotarGraficos(componentes) {
  const categorias = componentes.processos.map((_, i) => i + 1);

  if (graficoProcessos) graficoProcessos.destroy();
  if (graficoThreads) graficoThreads.destroy();

  configProcessos(componentes, categorias);
  configThreads(componentes, categorias);
}

function configProcessos(componentes, categorias) {
  const options = {
    chart: {
      type: 'line',
      height: 350,
      zoom: { enabled: true }
    },
    series: [
      { name: 'CPU %', data: componentes.cpu },
      { name: 'Memória (MB)', data: componentes.ram },
      { name: 'Threads', data: componentes.threads },
      { name: 'Processos', data: componentes.processos }
    ],
    xaxis: { categories: categorias, range: 20 },
    tooltip: { shared: true },
    colors: ['#ED145B', '#0762C8', '#198754', '#FFC107'],
  };

  graficoProcessos = new ApexCharts(
    document.querySelector("#chart-apex-evolucao"),
    options
  );
  graficoProcessos.render();
}

function configThreads(componentes, categorias) {
  document.querySelector("#chart-apex-correlacao").innerHTML = "";

  const scatterData = componentes.processos.map((p, i) => {
    const t = componentes.threads[i] || 0;
    const s = componentes.servicos[i] || 1;
    return {
      x: p,
      y: t,
      z: s,
      fillColor: s > 20 ? '#ED145B' : '#0762C8'
    };
  });

  const options = {
    chart: { type: 'scatter', height: 350, toolbar: { show: false } },
    series: [{ name: "Correlação", data: scatterData }],
    xaxis: { title: { text: "Processos" }, categories: false},
    yaxis: { title: { text: "Threads" } },
    dataLabels: { enabled: false }
  };

  graficoThreads = new ApexCharts(
    document.querySelector("#chart-apex-correlacao"),
    options
  );
  graficoThreads.render();
}

function dataFormatada(dataString) {
  const data = new Date(dataString);
  return data.toLocaleString();
}

function exibeErro(msg) {
  alert(msg);
}
