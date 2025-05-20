document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('textoInput');
  const tarefasSalvas = JSON.parse(localStorage.getItem('tarefas')) || [];

  tarefasSalvas.forEach(tarefa => criarElementoTarefa(tarefa.texto, tarefa.concluida));

  input.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      adicionarTexto();
    }
  });

  const checkboxTema = document.getElementById('temaCheckbox');

  if (localStorage.getItem('tema') === 'escuro') {
    document.body.classList.add('tema-escuro');
    checkboxTema.checked = true;
  }

  checkboxTema.addEventListener('change', () => {
    document.body.classList.toggle('tema-escuro');
    const temaAtual = document.body.classList.contains('tema-escuro') ? 'escuro' : 'claro';
    localStorage.setItem('tema', temaAtual);
  });
});

function adicionarTexto() {
  const input = document.getElementById('textoInput');
  const texto = input.value.trim();

  if (texto !== '') {
    criarElementoTarefa(texto);
    salvarTarefa(texto, false);
    input.value = '';
    input.focus();
  }
}

function criarElementoTarefa(texto, concluida = false) {
  const lista = document.getElementById('lista');
  const novoElemento = document.createElement('div');
  novoElemento.className = 'item';
  novoElemento.style.display = 'flex';
  novoElemento.style.justifyContent = 'space-between';
  novoElemento.style.alignItems = 'center';

  const spanTexto = document.createElement('span');
  spanTexto.textContent = texto;
  spanTexto.style.flexGrow = '1';

  if (concluida) {
    spanTexto.style.textDecoration = 'line-through';
    spanTexto.style.color = 'gray';
  }

  const botaoCheck = document.createElement('button');
  botaoCheck.textContent = '✅';
  botaoCheck.style.marginLeft = '10px';
  botaoCheck.style.background = 'transparent';
  botaoCheck.style.border = 'none';
  botaoCheck.style.color = 'green';
  botaoCheck.style.fontWeight = 'bold';
  botaoCheck.style.cursor = 'pointer';

  botaoCheck.onclick = () => {
    const novaConclusao = spanTexto.style.textDecoration !== 'line-through';
    spanTexto.style.textDecoration = novaConclusao ? 'line-through' : 'none';
    spanTexto.style.color = novaConclusao ? 'gray' : 'black';
    atualizarConclusaoTarefa(texto, novaConclusao);
  };

  const botaoRemover = document.createElement('button');
  botaoRemover.textContent = '✖';
  botaoRemover.style.marginLeft = '5px';
  botaoRemover.style.background = 'transparent';
  botaoRemover.style.border = 'none';
  botaoRemover.style.color = 'red';
  botaoRemover.style.fontWeight = 'bold';
  botaoRemover.style.cursor = 'pointer';

  botaoRemover.onclick = () => {
    novoElemento.remove();
    removerTarefa(texto);
  };

  novoElemento.appendChild(spanTexto);
  novoElemento.appendChild(botaoCheck);
  novoElemento.appendChild(botaoRemover);
  lista.appendChild(novoElemento);
}

function salvarTarefa(texto, concluida) {
  const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
  tarefas.push({ texto, concluida });
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function removerTarefa(texto) {
  let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
  tarefas = tarefas.filter(t => t.texto !== texto);
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function atualizarConclusaoTarefa(texto, concluida) {
  const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
  const tarefa = tarefas.find(t => t.texto === texto);
  if (tarefa) {
    tarefa.concluida = concluida;
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
  }
}
