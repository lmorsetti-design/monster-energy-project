async function carregarProdutos() {
  try {
    const resposta = await fetch('/api/produtos');
    const produtos = await resposta.json();

    const container = document.getElementById('lista-produtos');
    container.innerHTML = ''; // limpa antes de montar

    produtos.forEach(produto => {
      const card = document.createElement('div');
      card.className = 'card-produto';

      card.innerHTML = `
  <div class="card-img-wrapper">
  <img class="card-img" src="${produto.imagem_url || '/img/produtos/sem-imagem.png'}" alt="${produto.nome}">
  </div>
  <h2>${produto.nome}</h2>
  <p class="sabor">${produto.sabor || ''}</p>
  <p class="descricao">${produto.descricao || ''}</p>
  <div class="info">
    <span>${produto.volume_ml} ml</span>
    <span>${produto.teor_cafeina} mg cafeína</span>
  </div>
  <p class="preco">R$ ${Number(produto.preco).toFixed(2)}</p>
  <span class="categoria">${produto.categoria || ''}</span>
`;

      container.appendChild(card);
    });

  } catch (erro) {
    console.error('Erro ao buscar produtos:', erro);
    document.getElementById('lista-produtos').innerHTML = 
      '<p>Não foi possível carregar os produtos. Verifique se o servidor está rodando.</p>';
  }
}

carregarProdutos();