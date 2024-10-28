import { CustomRequest } from '@/types/CustomRequest';
import { Response } from 'express';

async function login(req: CustomRequest, res: Response) {
  try {
    const { email, password } = req.body;

    if (email === 'validEmail@mtogo.com' && password === 'validPassword') {
      req.session.user = { email, role: 'customer' };
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

async function logout(req: CustomRequest, res: Response) {
  try {
    req.session.destroy(err => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('sid');
      res.status(200).json({ message: 'Logout successful' });
    });
  } catch (error) {
    console.error(error);
  }
}

export default {
  login,
  logout,
};
