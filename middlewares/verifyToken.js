const jwt = require('jsonwebtoken');
const config = require('../config/dbconfig');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extraire le token du header Authorization
    if (!token) {
        return res.status(403).json({ success: false, msg: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, config.secret);
        req.user = decoded; // Ajouter les informations de l'utilisateur au request pour les fonctions CRUD
        next(); // Passer au middleware suivant
    } catch (error) {
        return res.status(401).json({ success: false, msg: 'Unauthorized' });
    }
};

module.exports = verifyToken;
