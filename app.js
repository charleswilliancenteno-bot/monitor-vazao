function calcularEGravar() {
  const fator = parseFloat(document.getElementById('fatorTanque').value);
  const bombaM3h = parseFloat(document.getElementById('vazaoBomba').value);
  const hIni = parseFloat(document.getElementById('alturaInicial').value);
  const hFim = parseFloat(document.getElementById('alturaFinal').value);
  const tIni = new Date(document.getElementById('horaInicial').value);
  const tFim = new Date(document.getElementById('horaFinal').value);

  if (isNaN(hIni) || isNaN(hFim) || isNaN(tIni.getTime()) || isNaN(tFim.getTime())) {
    alert("Por favor, preencha todos os campos de altura e horário corretamente.");
    return;
  }

  const deltaH = hFim - hIni;
  const volumeLitros = deltaH * fator;
  
  // Diferença de tempo em horas
  const horas = (tFim - tIni) / (1000 * 60 * 60);

  if (horas <= 0) {
    alert("A hora final deve ser maior que a hora inicial.");
    return;
  }

  const vazaoLh = volumeLitros / horas;
  const vazaoM3h = vazaoLh / 1000;
  const eficiencia = (vazaoM3h / bombaM3h) * 100;

  // Exibir resultados na tela
  document.getElementById('resDeltaH').innerText = deltaH.toFixed(1);
  document.getElementById('resVolume').innerText = volumeLitros.toLocaleString('pt-BR');
  document.getElementById('resVazaoLh').innerText = vazaoLh.toFixed(0).toLocaleString('pt-BR');
  document.getElementById('resVazaoM3h').innerText = vazaoM3h.toFixed(2);
  document.getElementById('resEficiencia').innerText = eficiencia.toFixed(1);
  document.getElementById('resultado').style.display = 'block';

  // Salvar no banco de dados local do celular (localStorage)
  const medicao = {
    data: new Date().toLocaleDateString('pt-BR'),
    vazaoM3h: vazaoM3h.toFixed(2),
    eficiencia: eficiencia.toFixed(1)
  };

  salvarHistorico(medicao);
}

function salvarHistorico(item) {
  let historico = JSON.parse(localStorage.getItem('historicoVazao')) || [];
  historico.unshift(item); // Adiciona no início da lista
  localStorage.setItem('historicoVazao', JSON.stringify(historico));
  renderHistorico();
}

function renderHistorico() {
  const lista = document.getElementById('historicoList');
  let historico = JSON.parse(localStorage.getItem('historicoVazao')) || [];
  lista.innerHTML = '';

  historico.slice(0, 5).forEach(med => {
    const li = document.createElement('li');
    li.innerHTML = `Data: <strong>${med.data}</strong> — Vazão: <strong>${med.vazaoM3h} m³/h</strong> (Eficiência: ${med.eficiencia}%)`;
    lista.appendChild(li);
  });
}

// Carregar histórico ao abrir a página
window.onload = renderHistorico;