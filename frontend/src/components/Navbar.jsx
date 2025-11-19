"use client";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <nav className="w-full bg-slate-900 text-slate-100 p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-xl font-semibold">Refer & Earn</Link>
        <Link href="/dashboard" className="text-sm opacity-80">Dashboard</Link>
      </div>

      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-80">{user.name}</span>
            <button onClick={handleLogout} className="text-sm px-3 py-1 rounded bg-slate-700">Logout</button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link href="/login" className="text-sm">Login</Link>
            <Link href="/register" className="text-sm">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
