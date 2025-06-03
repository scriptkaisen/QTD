document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('textoInput');
    const tarefasSalvas = JSON.parse(localStorage.getItem('tarefas')) || [];
    const botaoEditar = document.getElementById('botaoEditar');

    tarefasSalvas.forEach(tarefa => criarElementoTarefa(tarefa.texto, tarefa.status, tarefa.createdAt, tarefa.dueDate));

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

    // Modo de edição
    let editMode = false;
    botaoEditar.addEventListener('click', () => {
        editMode = !editMode;
        botaoEditar.style.backgroundColor = editMode ? '#10B981' : '#4f46e5';
        
        const itens = document.querySelectorAll('.item');
        itens.forEach(item => {
            const textSpan = item.querySelector('.task-text');
            const dateSpan = item.querySelector('.task-date');
            
            if (editMode) {
                // Ativa edição do texto
                textSpan.contentEditable = true;
                textSpan.focus();
                textSpan.style.borderBottom = '1px dashed #4f46e5';
                
                // Transforma a data em input date
                const currentDate = dateSpan.getAttribute('data-due-date') || '';
                dateSpan.innerHTML = `<input type="date" class="date-input" value="${currentDate}">`;
                
                // Foca no input de data se já estiver preenchido
                if (currentDate) {
                    dateSpan.querySelector('.date-input').focus();
                }
            } else {
                // Desativa edição do texto
                textSpan.contentEditable = false;
                textSpan.style.borderBottom = 'none';
                
                // Atualiza a data
                const dateInput = dateSpan.querySelector('.date-input');
                let dueDate = '';
                if (dateInput) {
                    dueDate = dateInput.value;
                    dateSpan.textContent = dueDate ? formatShortDate(dueDate) : '';
                    dateSpan.setAttribute('data-due-date', dueDate);
                }
                
                // Atualiza o localStorage
                const novoTexto = textSpan.textContent;
                const status = item.querySelector('.status-select').value;
                atualizarTarefa(novoTexto, status, dueDate);
            }
        });
    });
});

// Funções auxiliares para formatação de data
function formatShortDate(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function formatTooltipDate(isoString) {
    if (!isoString) return 'Sem data de entrega';
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Função para atualizar a tarefa no localStorage
function atualizarTarefa(novoTexto, status, dueDate) {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    const index = tarefas.findIndex(t => t.texto === novoTexto || t.status === status);
    if (index !== -1) {
        tarefas[index].texto = novoTexto;
        tarefas[index].status = status;
        tarefas[index].dueDate = dueDate;
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }
}

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

function criarElementoTarefa(texto, status = 'nao-concluido', createdAt = new Date().toISOString(), dueDate = '') {
    const lista = document.getElementById('lista');
    const novoElemento = document.createElement('div');
    novoElemento.className = 'item';
    
    // Tooltip mostra data de criação e entrega
    const tooltipText = `Criado em: ${formatTooltipDate(createdAt)}${dueDate ? `\nEntrega: ${formatTooltipDate(dueDate)}` : ''}`;
    novoElemento.setAttribute('data-tooltip', tooltipText);

    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';

    const statusIndicator = document.createElement('span');
    statusIndicator.className = `status-indicator status-${status}`;

    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = texto;
    if (status === 'concluido') {
        taskText.classList.add('texto-concluido');
    }

    const taskDate = document.createElement('span');
    taskDate.className = 'task-date';
    taskDate.textContent = dueDate ? formatShortDate(dueDate) : '';
    taskDate.setAttribute('data-due-date', dueDate);

    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'status-container';

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

    const botaoRemover = document.createElement('button');
    botaoRemover.className = 'btn-remover';
    botaoRemover.textContent = '✖';
    botaoRemover.onclick = () => {
        novoElemento.remove();
        removerTarefa(texto);
    };

    taskContent.appendChild(statusIndicator);
    taskContent.appendChild(taskText);
    taskContent.appendChild(taskDate);
    
    controlsContainer.appendChild(selectStatus);
    controlsContainer.appendChild(botaoRemover);
    
    novoElemento.appendChild(taskContent);
    novoElemento.appendChild(controlsContainer);
    
    lista.appendChild(novoElemento);
}

function salvarTarefa(texto, status) {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas.push({ 
        texto, 
        status,
        createdAt: new Date().toISOString(),
        dueDate: ''
    });
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