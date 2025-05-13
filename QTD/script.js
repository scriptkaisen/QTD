function adicionarTexto() {
    const input = document.getElementById('textoInput');
    const lista = document.getElementById('lista');
    const texto = input.value.trim();

    if (texto !== '') {
      const novoElemento = document.createElement('div');
      novoElemento.className = 'item';
      novoElemento.textContent = texto;
      lista.appendChild(novoElemento);

      input.value = '';
      input.focus();
    }
  }