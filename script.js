function adicionarTexto() {
  const input = document.getElementById('textoInput');
  const lista = document.getElementById('lista');
  const texto = input.value.trim();

  if (texto !== '') {
    const novoElemento = document.createElement('div');
    novoElemento.className = 'item';
    novoElemento.style.display = 'flex';
    novoElemento.style.justifyContent = 'space-between';
    novoElemento.style.alignItems = 'center';

    // Criar o texto
    const spanTexto = document.createElement('span');
    spanTexto.textContent = texto;
    spanTexto.style.flexGrow = '1';

    // Botão de concluir (✅)
    const botaoCheck = document.createElement('button');
    botaoCheck.textContent = '✅';
    botaoCheck.style.marginLeft = '10px';
    botaoCheck.style.background = 'transparent';
    botaoCheck.style.border = 'none';
    botaoCheck.style.color = 'green';
    botaoCheck.style.fontWeight = 'bold';
    botaoCheck.style.cursor = 'pointer';

    botaoCheck.onclick = () => {
      if (spanTexto.style.textDecoration === 'line-through') {
        spanTexto.style.textDecoration = 'none';
        spanTexto.style.color = 'black';
      } else {
        spanTexto.style.textDecoration = 'line-through';
        spanTexto.style.color = 'gray';
      }
    };

    // Botão de remover (✖)
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
    };

    // Adiciona elementos ao item
    novoElemento.appendChild(spanTexto);
    novoElemento.appendChild(botaoCheck);
    novoElemento.appendChild(botaoRemover);
    lista.appendChild(novoElemento);

    input.value = '';
    input.focus();
  }
}
