import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";

const repo = () => AppDataSource.getRepository(User);
function token(userId: string) {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as any,
  });
}

export async function signup(name: string, email: string, password: string) {
  const normalizedEmail = email.toLowerCase();
  if (await repo().findOne({ where: { email: normalizedEmail } }))
    throw Object.assign(new Error("Email already registered"), { status: 409 });
  const user = repo().create({
    name,
    email: normalizedEmail,
    password: await bcrypt.hash(password, 12),
  });
  const saved = await repo().save(user);
  return {
    accessToken: token(saved.id),
    user: { id: saved.id, name: saved.name, email: saved.email },
  };
}

export async function login(email: string, password: string) {
  const user = await repo().findOne({ where: { email: email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(password, user.password)))
    throw Object.assign(new Error("Invalid email or password"), {
      status: 401,
    });
  return {
    accessToken: token(user.id),
    user: { id: user.id, name: user.name, email: user.email },
  };
}

export async function me(userId: string) {
  const user = await repo().findOne({ where: { id: userId } });
  if (!user) throw Object.assign(new Error("User not found"), { status: 404 });
  return { id: user.id, name: user.name, email: user.email };
}
