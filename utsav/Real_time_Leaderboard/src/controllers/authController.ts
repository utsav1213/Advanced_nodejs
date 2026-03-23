import { Request, Response } from "express";
import { createUser, findUserByEmail } from "../db/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const user = await createUser(username, email, password);
    if (!user) {
      res.status(500).json({ error: "Failed to create user" });
      return;
    }

    res
      .status(201)
      .json({
        message: "User registered successfully",
        user: { id: user.id, username: user.username, email: user.email },
      });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Registration failed" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const user = await findUserByEmail(email);
    if (!user || !user.password) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Login failed" });
  }
};
