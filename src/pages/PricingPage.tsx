import { useEffect, useState } from "react";

interface PlanInfo {
  plan_id: string;
  name: string;
  purchase_type: string;
  interval?: string;
  trial_days?: number;
}

interface Product {
  product_id: string;
  name: string;
  price: number;
  currency: string;
  plans: PlanInfo[];
}

export default function PricingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products/plans")
      .then(r => r.json())
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCheckout = async (productId: string, planId: string) => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, plan_id: planId }),
    });
    const data = await res.json();
    if (data.checkout_url) {
      window.location.href = data.checkout_url;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-light tracking-widest mb-2">Choose Your Plan</h1>
      <p className="text-gray-400 mb-12">Unlock the full potential</p>

      {loading ? (
        <p className="text-gray-500">Loading plans...</p>
      ) : (
        <div className="flex gap-6 flex-wrap justify-center">
          {products.map(p => (
            <div
              key={p.product_id}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 w-80 backdrop-blur"
            >
              <h2 className="text-xl font-semibold mb-1">{p.name}</h2>
              <p className="text-4xl font-bold mt-4">
                NT${(p.price / 100).toFixed(0)}
                <span className="text-lg text-gray-400 font-normal">/月</span>
              </p>
              {p.plans.map(plan => (
                <button
                  key={plan.plan_id}
                  onClick={() => handleCheckout(p.product_id, plan.plan_id)}
                  className="w-full mt-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold transition"
                >
                  {plan.trial_days ? `免費試用 ${plan.trial_days} 天` : "立即訂閱"}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
