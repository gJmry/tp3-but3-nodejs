import express from 'express';
import { getAllUsers, createUser, getUserById, updateUser, signup, login, deleteUser } from '../controllers/user.controller.js';
import { verifyToken, checkRole } from '../middlewares/auth-middleware.js';

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);

userRouter
    .route('/')
    .get(verifyToken, checkRole(['admin']), getAllUsers)
    .post(verifyToken, checkRole(['admin']), createUser);

userRouter
    .route('/:id')
    .get(verifyToken, checkRole(['admin', 'moderator']), getUserById)
    .put(verifyToken, checkRole(['admin']), updateUser)
    .delete(verifyToken, checkRole(['admin']), deleteUser);

export { userRouter };