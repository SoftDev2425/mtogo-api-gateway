import prisma from '../../prisma/client';
import { RegisterUserInput } from '../types/RegisterUserInput';
import bcrypt from 'bcrypt';

export async function registerUser(data: RegisterUserInput) {
  // check if user with email already exists
  const userExists = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (userExists) {
    throw new Error('User with email already exists');
  }

  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      password: await bcrypt.hash(data.password, 10),
    },
  });

  return user;
}
