import authController from '../controllers/auth.controller';
import express from 'express';

const router = express.Router();

router.post('/login/user', authController.handleLoginUser);
router.post('/login/restaurant', authController.handleLoginRestaurant);

router.post('/logout', authController.handleLogout);

router.post('/register/user', authController.handleRegisterUser);
router.post('/register/restaurant', authController.handleRegisterRestaurant);

export default router;
