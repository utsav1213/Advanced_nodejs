import client from "./redis";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
}

export const createUser = async (
  username: string,
  email: string,
  password: string,
): Promise<User | null> => {
  const existingUser = await client.get(`username:${username}`);
  if (existingUser) {
    throw new Error("Username already exists");
  }
  const existingEmail = await client.get(`email:${email}`);
  if (existingEmail) {
    throw new Error("Email already exists");
  }

  const userId = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);

  const user: User = {
    id: userId,
    username,
    email,
    password: hashedPassword,
  };

  // Store user data
  await client.hSet(`user:${userId}`, {
    id: userId,
    username,
    email,
    password: hashedPassword,
  });

  // Create lookups
  await client.set(`username:${username}`, userId);
  await client.set(`email:${email}`, userId);

  return { id: userId, username, email };
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const userId = await client.get(`email:${email}`);
  if (!userId) return null;

  const userData = await client.hGetAll(`user:${userId}`);
  if (!userData || !userData.id) return null;

  return userData as unknown as User;
};

export const findUserById = async (userId: string): Promise<User | null> => {
  const userData = await client.hGetAll(`user:${userId}`);
  if (!userData || !userData.id) return null;

  return userData as unknown as User;
};
