const jwt = require('jsonwebtoken');
const config = require('config')

module.exports = function admin(req, res, next) {
    const user = jwt.decode(req.header('x-auth-token'), config.get('jwtPrivateKey'));
    if (!user.isAdmin) return res.status(403).send('Access denied');
    next();
}