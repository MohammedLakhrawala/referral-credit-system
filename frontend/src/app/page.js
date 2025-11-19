import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="p-8 bg-white rounded shadow">
          <h1 className="text-2xl font-semibold">Referral & Credit System</h1>
          <p className="mt-2 text-slate-600">Register, share your referral code and earn credit when referred users make their first purchase.</p>
        </div>
      </main>
    </>
  );
}
