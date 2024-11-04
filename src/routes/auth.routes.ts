import authController from '../controllers/auth.controller';
import express from 'express';

const router = express.Router();

//make a get that returns an error stating that the call should be post - bad request- try post
router.get('/login/user', (_req, res) => {
  res.status(400).json({ message: 'Login should be done via POST' });
});
router.post('/login/user', authController.handleLoginUser);
router.post('/login/restaurant', authController.handleLoginRestaurant);

router.post('/logout', authController.handleLogout);

router.post('/register/user', authController.handleRegisterUser);
router.post('/register/restaurant', authController.handleRegisterRestaurant);

export default router;
