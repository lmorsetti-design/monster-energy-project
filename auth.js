const formCadastro = document.getElementById('form-cadastro');
if (formCadastro) {
  formCadastro.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const msgErro = document.getElementById('mensagem-erro');
    const msgSucesso = document.getElementById('mensagem-sucesso');

    msgErro.textContent = '';
    msgSucesso.textContent = '';

    try {
      const resposta = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        msgErro.textContent = dados.erro;
        return;
      }

      msgSucesso.textContent = 'Conta criada! Redirecionando para o login...';
      setTimeout(() => window.location.href = 'login.html', 1500);

    } catch (erro) {
      msgErro.textContent = 'Erro ao conectar com o servidor.';
    }
  });
}

const formLogin = document.getElementById('form-login');
if (formLogin) {
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const msgErro = document.getElementById('mensagem-erro');
    msgErro.textContent = '';

    try {
      const resposta = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // essencial: manda/recebe o cookie de sessão
        body: JSON.stringify({ email, senha })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        msgErro.textContent = dados.erro;
        return;
      }

      window.location.href = 'admin.html';

    } catch (erro) {
      msgErro.textContent = 'Erro ao conectar com o servidor.';
    }
  });
}

const formProduto = document.getElementById('form-produto');
if (formProduto) {


  (async () => {
    try {
      const resposta = await fetch('/api/auth/status', { credentials: 'include' });
      const dados = await resposta.json();

      if (!dados.logado) {
        window.location.href = 'login.html';
      } else {
        document.getElementById('saudacao').textContent = `Olá, ${dados.nome}`;
      }
    } catch (erro) {
      window.location.href = 'login.html';
    }
  })();


  formProduto.addEventListener('submit', async (e) => {
    e.preventDefault();

    const produto = {
      nome: document.getElementById('nome').value,
      sabor: document.getElementById('sabor').value,
      categoria_id: document.getElementById('categoria_id').value,
      descricao: document.getElementById('descricao').value,
      teor_cafeina: document.getElementById('teor_cafeina').value || null,
      volume_ml: document.getElementById('volume_ml').value || null,
      preco: document.getElementById('preco').value,
      imagem_url: ''
    };

    const msgErro = document.getElementById('mensagem-erro');
    const msgSucesso = document.getElementById('mensagem-sucesso');
    msgErro.textContent = '';
    msgSucesso.textContent = '';

    try {
      const resposta = await fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(produto)
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        msgErro.textContent = dados.erro || 'Erro ao adicionar produto.';
        return;
      }

      msgSucesso.textContent = 'Produto adicionado com sucesso!';
      formProduto.reset();

    } catch (erro) {
      msgErro.textContent = 'Erro ao conectar com o servidor.';
    }
  });
}

const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {
  btnLogout.addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = 'login.html';
  });
}