"use client";
import { FormEvent, useState } from "react";
import { api } from "../../services/api";
import { setToken } from "../../lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const r = await api.post("/auth/login", { email, password });
      setToken(r.data.accessToken);
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.response?.data?.message || "Login failed");
    }
  }
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-md space-y-4 rounded-xl border bg-white p-8 shadow-sm"
      >
        <h1 className="text-2xl font-bold">Login</h1>
        {error && <p className="text-red-600">{error}</p>}
        <input
          className="w-full rounded border p-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded border p-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full rounded bg-black p-3 text-white">
          Login
        </button>
        <p>
          Don't have an account?{" "}
          <Link className="underline" href="/signup">
            Sign up
          </Link>
        </p>
      </form>
    </main>
  );
}
