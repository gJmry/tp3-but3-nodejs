import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclure le mot de passe
        res.status(200).json({
            status: 'success',
            data: users
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération des utilisateurs'
        });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'Un utilisateur avec cet email existe déjà'
            });
        }

        // Seul un admin peut créer un autre admin
        if (role === 'admin' && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Seul un administrateur peut créer un autre administrateur'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        await user.save();

        // Retourner l'utilisateur sans le mot de passe
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            status: 'success',
            message: 'Utilisateur créé avec succès',
            data: userResponse
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la création de l\'utilisateur'
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Utilisateur non trouvé'
            });
        }

        res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération de l\'utilisateur'
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userId = req.params.id;

        // Seul un admin peut modifier le rôle
        if (role && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Seul un administrateur peut modifier les rôles'
            });
        }

        // Préparer les données à mettre à jour
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (role) updateData.role = role;

        // Si un nouveau mot de passe est fourni, le hasher
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Utilisateur non trouvé'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Utilisateur mis à jour avec succès',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la mise à jour de l\'utilisateur'
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Utilisateur non trouvé'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Utilisateur supprimé avec succès'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la suppression de l\'utilisateur'
        });
    }
};

const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validation des champs requis
        if (!name || !email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Nom, email et mot de passe sont requis'
            });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'Un utilisateur avec cet email existe déjà'
            });
        }

        // Pour l'inscription publique, seul le rôle 'user' est autorisé
        // Les admins peuvent créer d'autres rôles via createUser
        const userRole = role && req.user ? role : 'user';

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: userRole
        });

        await user.save();

        res.status(201).json({
            status: 'success',
            message: 'Utilisateur créé avec succès'
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                status: 'error',
                message: 'Données invalides',
                details: error.message
            });
        }

        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la création de l\'utilisateur'
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation des champs requis
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email et mot de passe sont requis'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Utilisateur non trouvé'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Mot de passe invalide'
            });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            status: 'success',
            message: 'Connexion réussie',
            data: {
                userId: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la connexion'
        });
    }
};

export { getAllUsers, createUser, getUserById, updateUser, deleteUser, signup, login };