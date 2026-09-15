const pool = require('../config/db');
const bcrypt = require('bcrypt');

exports.registrar = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Preencha todos os campos.' });
    }

    const [existente] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existente.length > 0) {
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, senhaCriptografada]
    );

    res.status(201).json({ mensagem: 'Usuário criado com sucesso!' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const [usuarios] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (usuarios.length === 0) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    const usuario = usuarios[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    req.session.usuarioId = usuario.id;
    req.session.usuarioNome = usuario.nome;

    res.json({ mensagem: 'Login realizado com sucesso!', nome: usuario.nome });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ mensagem: 'Logout realizado.' });
  });
};

exports.status = (req, res) => {
  if (req.session.usuarioId) {
    res.json({ logado: true, nome: req.session.usuarioNome });
  } else {
    res.json({ logado: false });
  }
};