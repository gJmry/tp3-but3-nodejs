import express from 'express';
import { filterTours, getMonthlyPlan, getToursStats, getAllToursController, aliasTopTours, getTourByIdController, createTour, updateTourController, checkBody, deleteTour } from '../controllers/tour.controller.js';
import { verifyToken, checkRole } from '../middlewares/auth-middleware.js';

const tourRouter = express.Router();

tourRouter.route('/top-5-cheap')
    .get(aliasTopTours, getAllToursController);

tourRouter
    .route('/')
    .get(getAllToursController)
    .post(verifyToken, checkRole(['admin', 'moderator']), createTour);

tourRouter.get('/', getAllToursController);

tourRouter.route('/tour-stats')
    .get(verifyToken, checkRole(['admin', 'moderator']), getToursStats);

tourRouter.route('/monthly-plan/:year')
    .get(verifyToken, checkRole(['admin', 'moderator']), getMonthlyPlan);

tourRouter.route('/filter')
    .get(verifyToken, filterTours);

tourRouter
    .route('/:id')
    .get(getTourByIdController)
    .put(verifyToken, checkRole(['admin', 'moderator']), updateTourController)
    .delete(verifyToken, checkRole(['admin']), deleteTour);

export { tourRouter };
