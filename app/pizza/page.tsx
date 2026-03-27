"use client";
import React, { useState } from 'react';
import { Pizza, CreditCard, ShoppingCart } from 'lucide-react';

export default function PizzaPage() {
  const [crust, setCrust] = useState("Thin");
  const [toppings, setToppings] = useState<string[]>([]);
  const [address, setAddress] = useState("");

  const allToppings = ["Pepperoni", "Mushrooms", "Extra Cheese", "Olives"];
  const price = 12 + (toppings.length * 1.5) + (crust === "Stuffed" ? 3 : 0);

  const handleCheckout = async () => {
    // This will talk to your Stripe action later
    alert(`Order for ${crust} pizza with ${toppings.join(", ")} sent to ${address}!`);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 mt-10 bg-white border rounded-2xl shadow-sm">
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-6">
        <Pizza className="text-orange-500" /> Custom Pizza Builder
      </h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold mb-3">1. Choose Your Crust</h2>
          <div className="flex gap-4">
            {["Thin", "Thick", "Stuffed"].map((c) => (
              <button key={c} onClick={() => setCrust(c)} className={`px-4 py-2 rounded-lg border ${crust === c ? 'bg-orange-500 text-white' : 'bg-gray-50'}`}>{c}</button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">2. Add Toppings ($1.50 each)</h2>
          <div className="grid grid-cols-2 gap-2">
            {allToppings.map((t) => (
              <label key={t} className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-orange-50">
                <input type="checkbox" onChange={(e) => e.target.checked ? setToppings([...toppings, t]) : setToppings(toppings.filter(x => x !== t))} />
                {t}
              </label>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">3. Delivery Address</h2>
          <textarea className="w-full p-3 border rounded-xl bg-gray-50" placeholder="123 Pizza St, New York..." onChange={(e) => setAddress(e.target.value)} />
        </section>

        <div className="pt-6 border-t flex items-center justify-between">
          <div className="text-2xl font-bold text-orange-600">Total: ${price.toFixed(2)}</div>
          <button onClick={handleCheckout} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition">
            <CreditCard size={20} /> Checkout
          </button>
        </div>
      </div>
    </div>
  );
}