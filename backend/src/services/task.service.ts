import { AppDataSource } from "../config/database";
import { Task } from "../entities/Task";
const repo = () => AppDataSource.getRepository(Task);

export async function createTask(userId: string, data: Partial<Task>) {
  return repo().save(repo().create({ ...data, userId }));
}
export async function getTasks(
  userId: string,
  filters: { status?: string; priority?: string; search?: string },
) {
  const qb = repo()
    .createQueryBuilder("task")
    .where("task.userId = :userId", { userId });
  if (filters.status)
    qb.andWhere("task.status = :status", { status: filters.status });
  if (filters.priority)
    qb.andWhere("task.priority = :priority", { priority: filters.priority });
  if (filters.search)
    qb.andWhere(
      "(LOWER(task.title) LIKE LOWER(:search) OR LOWER(COALESCE(task.description, '')) LIKE LOWER(:search))",
      { search: `%${filters.search}%` },
    );
  return qb.orderBy("task.createdAt", "DESC").getMany();
}
export async function getTask(id: string, userId: string) {
  const task = await repo().findOne({ where: { id, userId } });
  if (!task) throw Object.assign(new Error("Task not found"), { status: 404 });
  return task;
}
export async function updateTask(
  id: string,
  userId: string,
  data: Partial<Task>,
) {
  const task = await getTask(id, userId);
  Object.assign(task, data);
  return repo().save(task);
}
export async function deleteTask(id: string, userId: string) {
  const task = await getTask(id, userId);
  await repo().remove(task);
}
