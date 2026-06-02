export default function PaymentRequired() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-10 max-w-md backdrop-blur">
        <h1 className="text-3xl font-light tracking-widest mb-4">Premium Access</h1>
        <p className="text-gray-400 mb-6">
          This feature requires an ABC Pro subscription. Upgrade to unlock advanced
          reports, API access, team collaboration, and priority support.
        </p>
        <a
          href="/pricing"
          className="inline-block px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold transition"
        >
          View Plans
        </a>
      </div>
    </main>
  );
}
