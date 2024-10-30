import { CustomRequest } from '../types/CustomRequest';
import { loginSchema } from '../validations/loginSchema';
import { Response } from 'express';
import { ZodError } from 'zod';
import { login } from '../services/auth.service';
import { registerUserSchema } from '../validations/registerUserSchema';
import { validateRequiredFields } from '../utils/validateRequiredFields';
import { registerUser } from '../services/user.service';

async function handleLoginUser(req: CustomRequest, res: Response) {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    loginSchema.parse({ email, password });

    await login(email, password, rememberMe ? false : true, res);
  } catch (error) {
    // type guard to narrow the type of `error`
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({ errors: errorMessages });
    } else if (error instanceof Error) {
      // Handle general errors with a clear error message
      return res.status(401).json({ message: error.message });
    }

    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

async function handleLoginRestaurant(req: CustomRequest, res: Response) {
  try {
    const { email, password } = req.body;

    if (email === 'validEmail@mtogo.com' && password === 'validPassword') {
      req.session.user = { id: '', email, role: 'customer' };
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

async function handleLogout(req: CustomRequest, res: Response) {
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

async function handleRegisterUser(req: CustomRequest, res: Response) {
  try {
    const { firstName, lastName, phone, email, password } = req.body;

    const requiredFields = [
      'firstName',
      'lastName',
      'phone',
      'email',
      'password',
    ];
    const errors = validateRequiredFields(req.body, requiredFields);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    registerUserSchema.parse({
      firstName,
      lastName,
      phone,
      email,
      password,
    });

    const user = await registerUser({
      firstName,
      lastName,
      phone,
      email,
      password,
    });

    res.status(200).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({ errors: errorMessages });
    } else if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }

    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function handleRegisterRestaurant(req: CustomRequest, res: Response) {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    res.status(200).json({ message: 'Restaurant registered' });
  } catch (error) {
    console.log(error);
  }
}

export default {
  handleLoginUser,
  handleLoginRestaurant,
  handleLogout,
  handleRegisterUser,
  handleRegisterRestaurant,
};
