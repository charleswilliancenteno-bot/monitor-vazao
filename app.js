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
  const volumeM3 = volumeLitros / 1000;
  
  // Diferença de tempo em horas
  const horas = (tFim - tIni) / (1000 * 60 * 60);

  if (horas <= 0) {
    alert("A hora final deve ser posterior à hora inicial.");
    return;
  }

  const vazaoLh = volumeLitros / horas;
  const vazaoM3h = vazaoLh / 1000;
  const eficiencia = (vazaoM3h / bombaM3h) * 100;

  // Exibir resultados na tela
  document.getElementById('resDeltaH').innerText = deltaH.toFixed(1);
  document.getElementById('resVolumeL').innerText = volumeLitros.toLocaleString('pt-BR');
  document.getElementById('resVolumeM3').innerText = volumeM3.toFixed(2);
  document.getElementById('resVazaoLh').innerText = vazaoLh.toFixed(0).toLocaleString('pt-BR');
  document.getElementById('resVazaoM3h').innerText = vazaoM3h.toFixed(2);
  document.getElementById('resEficiencia').innerText = eficiencia.toFixed(1);
  document.getElementById('resultado').style.display = 'block';

  // Salvar no histórico local
  const medicao = {
    data: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
    vazaoM3h: vazaoM3h.toFixed(2),
    volumeM3: volumeM3.toFixed(2),
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

  if(historico.length === 0) {
    lista.innerHTML = '<li style="color:#a0aec0; text-align:center;">Nenhuma medição registrada ainda.</li>';
    return;
  }

  historico.slice(0, 5).forEach(med => {
    const li = document.createElement('li');
    const volM3Text = med.volumeM3 ? ` | Vol: <strong>${med.volumeM3} m³</strong>` : '';
    li.innerHTML = `<strong>${med.data}</strong><br>Vazão: <strong>${med.vazaoM3h} m³/h</strong>${volM3Text} | Eficiência: <strong>${med.eficiencia}%</strong>`;
    lista.appendChild(li);
  });
}

window.onload = function() {
  const agora = new Date();
  const umaHoraAtras = new Date(agora.getTime() - (60 * 60 * 1000));
  
  const toLocalISO = (dt) => {
    const tzOffset = dt.getTimezoneOffset() * 60000;
    return new Date(dt.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  document.getElementById('horaInicial').value = toLocalISO(umaHoraAtras);
  document.getElementById('horaFinal').value = toLocalISO(agora);

  renderHistorico();
};
