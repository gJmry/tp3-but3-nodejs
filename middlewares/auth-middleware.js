import jwt from 'jsonwebtoken';
import 'dotenv/config';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : authHeader;

    if (!token) {
        return res.status(403).json({
            status: 'error',
            message: 'Un jeton est requis pour l\'authentification'
        });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Jeton invalide'
        });
    }
};

const checkRole = (roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: 'error',
            message: 'Non autorisé - utilisateur non authentifié'
        });
    }

    if (!roles.includes(req.user.role)) {
        return res.status(403).json({
            status: 'error',
            message: 'Accès refusé - rôle insuffisant'
        });
    }

    next();
};

export { verifyToken, checkRole };