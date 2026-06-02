export default function PaymentFailed() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-white/5 border border-red-500/20 rounded-2xl p-10 max-w-md backdrop-blur">
        <div className="text-5xl mb-4">❌</div>
        <h1 className="text-3xl font-light tracking-widest mb-4">Payment Failed</h1>
        <p className="text-gray-400 mb-6">
          Your payment could not be processed. Please try again or use a different
          payment method.
        </p>
        <div className="flex gap-3 justify-center">
          <a
            href="/pricing"
            className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold transition"
          >
            Try Again
          </a>
          <a
            href="/"
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            Back to App
          </a>
        </div>
      </div>
    </main>
  );
}
