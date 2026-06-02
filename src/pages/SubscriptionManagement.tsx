import { useEffect, useState } from "react";

interface Subscription {
  subscription_id: string;
  product_name: string;
  status: string;
  amount: number;
  currency: string;
  current_period_end: string;
  trial_end?: string;
}

export default function SubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/subscriptions")
      .then(r => r.json())
      .then(data => setSubscriptions(data.subscriptions || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (subscriptionId: string) => {
    if (!confirm("Are you sure you want to cancel your subscription?")) return;
    setCancelling(subscriptionId);
    try {
      await fetch(`/api/subscriptions/${subscriptionId}/cancel`, { method: "POST" });
      setSubscriptions(prev =>
        prev.map(s =>
          s.subscription_id === subscriptionId ? { ...s, status: "cancelling" } : s
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setCancelling(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center px-4 py-20">
      <h1 className="text-4xl font-light tracking-widest mb-2">My Subscription</h1>
      <p className="text-gray-400 mb-12">Manage your plan</p>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : subscriptions.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-md w-full text-center backdrop-blur">
          <p className="text-gray-400 mb-4">You don't have an active subscription.</p>
          <a
            href="/pricing"
            className="inline-block px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold transition"
          >
            View Plans
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full max-w-lg">
          {subscriptions.map(sub => (
            <div
              key={sub.subscription_id}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{sub.product_name}</h2>
                  <p className="text-gray-400 text-sm">
                    NT${(sub.amount / 100).toFixed(0)} / month
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    sub.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {sub.status}
                </span>
              </div>
              <p className="text-gray-500 text-xs mt-3">
                Current period ends:{" "}
                {new Date(sub.current_period_end).toLocaleDateString()}
              </p>
              {sub.status === "active" && (
                <button
                  onClick={() => handleCancel(sub.subscription_id)}
                  disabled={cancelling === sub.subscription_id}
                  className="mt-4 text-sm text-red-400 hover:text-red-300 transition disabled:opacity-50"
                >
                  {cancelling === sub.subscription_id ? "Cancelling..." : "Cancel Subscription"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
