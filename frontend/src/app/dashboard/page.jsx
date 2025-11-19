"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOverview, buyProduct } from "@/store/slices/dashboardSlice";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((s) => s.auth);
  const dashboard = useSelector((s) => s.dashboard);

  useEffect(() => {
    // redirect to login if not authenticated
    if (!auth.token) {
      router.push("/login");
      return;
    }
    dispatch(fetchOverview());
  }, [auth.token, dispatch, router]);

  const onBuy = async () => {
    const res = await dispatch(buyProduct());
    // refresh overview after purchase
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(fetchOverview());
      alert(res.payload.message || "Purchase successful");
    } else {
      alert(res.payload || "Purchase failed");
    }
  };

  if (!auth.token) return null; // router will redirect

  return (
    <>
      <Navbar />
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white rounded shadow">
              <div className="text-sm text-slate-500">Referral code</div>
              <div className="font-mono mt-1">{dashboard.overview?.referralCode || "—"}</div>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <div className="text-sm text-slate-500">Credits</div>
              <div className="font-mono mt-1">{dashboard.overview?.credits ?? 0}</div>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <div className="text-sm text-slate-500">Total purchases</div>
              <div className="font-mono mt-1">{dashboard.overview?.totalPurchases ?? 0}</div>
            </div>
          </div>

          <div className="mb-6">
            <button onClick={onBuy} className="px-4 py-2 rounded bg-emerald-600 text-white">Buy Product</button>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Recent referrals</h2>
            {dashboard.overview?.recentReferrals?.length ? (
              <table className="w-full text-left">
                <thead className="text-sm text-slate-500">
                  <tr>
                    <th className="py-2">Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.overview.recentReferrals.map((r) => (
                    <tr key={r.id} className="border-t">
                      <td className="py-2">{r.name || "—"}</td>
                      <td>{r.email || "—"}</td>
                      <td>{r.status}</td>
                      <td>{new Date(r.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-sm text-slate-500">No referrals yet.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
