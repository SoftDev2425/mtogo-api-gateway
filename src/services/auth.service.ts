import prisma from '../../prisma/client';
import bcrypt from 'bcrypt';
import { redisClient } from '../redis/client';
import { Response } from 'express';

const MAX_SESSIONS = 3;

async function login(
  email: string,
  password: string,
  rememberMe: boolean,
  res: Response,
) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }

  // Get the current session tokens for the user
  const userSessionsKey = `userSessions-${user.id}`;
  const userSessions = await redisClient.lRange(userSessionsKey, 0, -1);

  // If the user has 3 sessions, remove the oldest one
  if (userSessions.length >= MAX_SESSIONS) {
    const oldestSessionToken = userSessions[0];
    await redisClient.del(`sessionToken-${oldestSessionToken}`);
    await redisClient.lPop(userSessionsKey);
  }

  // Generate a new session token
  const sessionToken = crypto.randomUUID();
  const sessionTokenExpiry = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24; // 30 days if rememberMe is true, else 1 day

  const sessionData = {
    userId: user.id,
    role: user.role,
    createdAt: new Date().toISOString(),
  };

  // Store the session token in Redis with the user ID as the value
  await redisClient.set(
    `sessionToken-${sessionToken}`,
    JSON.stringify(sessionData),
    {
      EX: sessionTokenExpiry,
    },
  );

  // Add the new session token to the user's session list
  await redisClient.rPush(userSessionsKey, sessionToken);
  await redisClient.expire(userSessionsKey, sessionTokenExpiry);

  // Return the token to the user via a cookie
  res.cookie('sessionToken', sessionToken, {
    maxAge: sessionTokenExpiry * 1000,
    httpOnly: true,
  });

  return res.status(200).json({ message: 'Login successful!' });
}

export { login };
