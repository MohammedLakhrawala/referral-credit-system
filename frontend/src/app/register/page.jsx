"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((s) => s.auth);

  const [form, setForm] = useState({ name: "", email: "", password: "", referralCode: "" });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(registerUser(form));
    if (res.meta.requestStatus === "fulfilled") {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
        <div className="max-w-md w-full bg-white p-6 rounded shadow">
          <h2 className="text-2xl mb-4 font-semibold">Create account</h2>
          <form onSubmit={onSubmit} className="space-y-3">
            <input name="name" required placeholder="Full name" value={form.name} onChange={onChange} className="w-full p-2 border rounded" />
            <input name="email" required type="email" placeholder="Email" value={form.email} onChange={onChange} className="w-full p-2 border rounded" />
            <input name="password" required type="password" placeholder="Password" value={form.password} onChange={onChange} className="w-full p-2 border rounded" />
            <input name="referralCode" placeholder="Referral code (optional)" value={form.referralCode} onChange={onChange} className="w-full p-2 border rounded" />
            <button type="submit" className="w-full py-2 rounded bg-slate-800 text-white">
              {auth.loading ? "Creating..." : "Create account"}
            </button>
            {auth.error && (<div className="text-red-600 text-sm">{auth.error}</div>)}
            <div className="text-sm text-slate-500 mt-2">Already have an account? <a className="text-blue-600" href="/login">Login</a></div>
          </form>
        </div>
      </main>
    </>
  );
}
