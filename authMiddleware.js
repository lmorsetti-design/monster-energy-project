exports.protegerRota = (req, res, next) => {
  if (req.session && req.session.usuarioId) {
    next();
  } else {
    res.status(401).json({ erro: 'Você precisa estar logado para acessar isso.' });
  }
};