const pool = require('../config/db');

exports.listarProdutos = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.nome AS categoria 
       FROM produtos p 
       LEFT JOIN categorias c ON p.categoria_id = c.id`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.buscarProduto = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM produtos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ erro: 'Produto não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.criarProduto = async (req, res) => {
  try {
    const { nome, sabor, categoria_id, descricao, teor_cafeina, volume_ml, preco, imagem_url } = req.body;
    const [result] = await pool.query(
      `INSERT INTO produtos (nome, sabor, categoria_id, descricao, teor_cafeina, volume_ml, preco, imagem_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome, sabor, categoria_id, descricao, teor_cafeina, volume_ml, preco, imagem_url]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};