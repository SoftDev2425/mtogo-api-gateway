import { z } from 'zod';

const registerUserSchema = z.object({
  firstName: z.string().min(1, 'Please enter a valid first name'),
  lastName: z.string().min(1, 'Please enter a valid last name'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export { registerUserSchema };
