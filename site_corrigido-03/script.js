document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('textoInput');
    const tarefasSalvas = JSON.parse(localStorage.getItem('tarefas')) || [];

    tarefasSalvas.forEach(tarefa => criarElementoTarefa(tarefa.texto, tarefa.status));

    input.addEventListener('keypress', function(event) {
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
        salvarTarefa(texto, 'nao-concluido');
        input.value = '';
        input.focus();
    }
}

function criarElementoTarefa(texto, status = 'nao-concluido') {
    const lista = document.getElementById('lista');
    const novoElemento = document.createElement('div');
    novoElemento.className = 'item';

    // Container do conteúdo da tarefa
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';

    // Indicador de status
    const statusIndicator = document.createElement('span');
    statusIndicator.className = `status-indicator status-${status}`;

    // Texto da tarefa
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = texto;
    if (status === 'concluido') {
        taskText.classList.add('texto-concluido');
    }

    // Container para os controles (dropdown e botão)
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'status-container';

    // Dropdown de status
    const selectStatus = document.createElement('select');
    selectStatus.className = 'status-select';
    selectStatus.innerHTML = `
        <option value="nao-concluido" ${status === 'nao-concluido' ? 'selected' : ''}>Não concluído</option>
        <option value="em-desenvolvimento" ${status === 'em-desenvolvimento' ? 'selected' : ''}>Em desenvolvimento</option>
        <option value="concluido" ${status === 'concluido' ? 'selected' : ''}>Concluído</option>
    `;

    selectStatus.addEventListener('change', () => {
        const novoStatus = selectStatus.value;
        statusIndicator.className = `status-indicator status-${novoStatus}`;
        if (novoStatus === 'concluido') {
            taskText.classList.add('texto-concluido');
        } else {
            taskText.classList.remove('texto-concluido');
        }
        atualizarStatusTarefa(texto, novoStatus);
    });

    // Botão de remover
    const botaoRemover = document.createElement('button');
    botaoRemover.className = 'btn-remover';
    botaoRemover.textContent = '✖';
    botaoRemover.onclick = () => {
        novoElemento.remove();
        removerTarefa(texto);
    };

    // Montagem da estrutura
    taskContent.appendChild(statusIndicator);
    taskContent.appendChild(taskText);
    
    controlsContainer.appendChild(selectStatus);
    controlsContainer.appendChild(botaoRemover);
    
    novoElemento.appendChild(taskContent);
    novoElemento.appendChild(controlsContainer);
    
    lista.appendChild(novoElemento);
}

function salvarTarefa(texto, status) {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas.push({ texto, status });
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function removerTarefa(texto) {
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas = tarefas.filter(t => t.texto !== texto);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function atualizarStatusTarefa(texto, status) {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    const tarefa = tarefas.find(t => t.texto === texto);
    if (tarefa) {
        tarefa.status = status;
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }
}