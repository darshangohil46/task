"use client";
import { FormEvent, useState } from "react";
import { api } from "../../services/api";
import { setToken } from "../../lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const r = await api.post("/auth/signup", { name, email, password });
      setToken(r.data.accessToken);
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.response?.data?.message || "Signup failed");
    }
  }
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-md space-y-4 rounded-xl border bg-white p-8 shadow-sm"
      >
        <h1 className="text-2xl font-bold">Create account</h1>
        {error && <p className="text-red-600">{error}</p>}
        <input
          className="w-full rounded border p-3"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full rounded border p-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded border p-3"
          placeholder="Password (6+ chars)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full rounded bg-black p-3 text-white">
          Create account
        </button>
        <p>
          Already registered?{" "}
          <Link className="underline" href="/login">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
