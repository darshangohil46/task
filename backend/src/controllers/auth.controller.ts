import { Request, Response, NextFunction } from "express";
import { loginSchema, signupSchema } from "../validators/auth.validator";
import * as service from "../services/auth.service";
import { AuthRequest } from "../types/auth.types";
export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const d = signupSchema.parse(req.body);
    res.status(201).json(await service.signup(d.name, d.email, d.password));
  } catch (e) {
    next(e);
  }
}
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const d = loginSchema.parse(req.body);
    res.json(await service.login(d.email, d.password));
  } catch (e) {
    next(e);
  }
}
export async function me(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.json({ user: await service.me(req.user!.userId) });
  } catch (e) {
    next(e);
  }
}
