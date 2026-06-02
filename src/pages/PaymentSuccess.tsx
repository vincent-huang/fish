import { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const [status, setStatus] = useState<string>("Verifying payment...");
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("order_id");

  useEffect(() => {
    if (orderId) {
      fetch(`/api/order/${orderId}`)
        .then(r => r.json())
        .then(data => {
          if (data.status === "active") {
            setStatus("Payment confirmed! Your Pro access is now active.");
          } else {
            setStatus("Processing your payment. It may take a moment to activate.");
          }
        })
        .catch(() => setStatus("Unable to verify payment. Please contact support."));
    }
  }, [orderId]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-white/5 border border-green-500/20 rounded-2xl p-10 max-w-md backdrop-blur">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-3xl font-light tracking-widest mb-4">Thank You!</h1>
        <p className="text-gray-300">{status}</p>
        {orderId && (
          <p className="text-gray-500 text-sm mt-4">Order: {orderId}</p>
        )}
        <a
          href="/"
          className="inline-block mt-6 px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
        >
          Back to App
        </a>
      </div>
    </main>
  );
}
