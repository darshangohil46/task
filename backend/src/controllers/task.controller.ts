import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth.types";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/task.validator";
import * as service from "../services/task.service";
export async function create(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const d = createTaskSchema.parse(req.body);
    res
      .status(201)
      .json({ task: await service.createTask(req.user!.userId, d as any) });
  } catch (e) {
    next(e);
  }
}
export async function list(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { status, priority, search } = req.query;
    res.json({
      tasks: await service.getTasks(req.user!.userId, {
        status: status as string,
        priority: priority as string,
        search: search as string,
      }),
    });
  } catch (e) {
    next(e);
  }
}
export async function get(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.json({
      task: await service.getTask(req.params.id as string, req.user!.userId),
    });
  } catch (e) {
    next(e);
  }
}
export async function update(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const d = updateTaskSchema.parse(req.body);
    res.json({
      task: await service.updateTask(
        req.params.id as string,
        req.user!.userId,
        d as any,
      ),
    });
  } catch (e) {
    next(e);
  }
}
export async function remove(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    await service.deleteTask(req.params.id as string, req.user!.userId);
    res.json({ message: "Task deleted successfully" });
  } catch (e) {
    next(e);
  }
}
