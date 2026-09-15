const express = require('express');
const router = express.Router();
const controller = require('../controllers/produtoController');
const { protegerRota } = require('../middlewares/authMiddleware');

router.get('/', controller.listarProdutos);
router.get('/:id', controller.buscarProduto);
router.post('/', protegerRota, controller.criarProduto);

module.exports = router;