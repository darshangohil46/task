"use client";
import { FormEvent, useEffect, useState } from "react";
import Protected from "../../components/Protected";
import { api } from "../../services/api";
import { logout } from "../../lib/auth";
import { Task, TaskPriority, TaskStatus, User } from "../../types";
const initial = {
  title: "",
  description: "",
  status: "todo" as TaskStatus,
  priority: "medium" as TaskPriority,
  dueDate: "",
};
export default function Dashboard() {
  return (
    <Protected>
      <DashboardInner />
    </Protected>
  );
}
function DashboardInner() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [error, setError] = useState("");
  async function load() {
    try {
      const [t, u] = await Promise.all([
        api.get("/tasks", { params: { search, status, priority } }),
        api.get("/auth/me"),
      ]);
      setTasks(t.data.tasks);
      setUser(u.data.user);
    } catch (e: any) {
      setError(e.response?.data?.message || "Could not load tasks");
    }
  }
  useEffect(() => {
    load();
  }, [search, status, priority]);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form, dueDate: form.dueDate || null };
      if (editing) await api.put(`/tasks/${editing}`, payload);
      else await api.post("/tasks", payload);
      setForm(initial);
      setEditing(null);
      load();
    } catch (e: any) {
      setError(e.response?.data?.message || "Save failed");
    }
  }
  function edit(t: Task) {
    setEditing(t.id);
    setForm({
      title: t.title,
      description: t.description || "",
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate || "",
    });
  }
  async function remove(id: string) {
    if (!confirm("Delete this task?")) return;
    await api.delete(`/tasks/${id}`);
    load();
  }
  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Task Manager</h1>
            <p className="text-gray-500">
              {user?.name} · {user?.email}
            </p>
          </div>
          <button onClick={logout} className="rounded border px-4 py-2">
            Logout
          </button>
        </header>
        {error && <p className="text-red-600">{error}</p>}
        <section className="grid gap-6 md:grid-cols-[360px_1fr]">
          <form
            onSubmit={submit}
            className="h-fit space-y-3 rounded-xl border bg-white p-5"
          >
            <h2 className="font-semibold">
              {editing ? "Edit task" : "New task"}
            </h2>
            <input
              required
              className="w-full rounded border p-2"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              className="w-full rounded border p-2"
              placeholder="Description"
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <select
              className="w-full rounded border p-2"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as TaskStatus })
              }
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              className="w-full rounded border p-2"
              value={form.priority}
              onChange={(e) =>
                setForm({ ...form, priority: e.target.value as TaskPriority })
              }
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              className="w-full rounded border p-2"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
            <div className="flex gap-2">
              <button className="flex-1 rounded bg-black p-2 text-white">
                {editing ? "Update" : "Create"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm(initial);
                  }}
                  className="rounded border px-4"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <input
                className="min-w-48 flex-1 rounded border p-2"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="rounded border p-2"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All status</option>
                <option value="todo">Todo</option>
                <option value="in_progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
              <select
                className="rounded border p-2"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="">All priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            {tasks.length === 0 ? (
              <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
                No tasks found.
              </div>
            ) : (
              tasks.map((t) => (
                <article key={t.id} className="rounded-xl border bg-white p-5">
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{t.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {t.description}
                      </p>
                    </div>
                    <div className="text-right text-xs">
                      <div>{t.priority}</div>
                      <div>{t.status}</div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between text-sm text-gray-500">
                    <span>
                      {t.dueDate ? `Due ${t.dueDate}` : "No due date"}
                    </span>
                    <span className="flex gap-2">
                      <button onClick={() => edit(t)} className="underline">
                        Edit
                      </button>
                      <button
                        onClick={() => remove(t.id)}
                        className="text-red-600 underline"
                      >
                        Delete
                      </button>
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
