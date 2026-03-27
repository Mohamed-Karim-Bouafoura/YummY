"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser, SignInButton } from '@clerk/nextjs'; // Add Clerk
import { Pizza, CreditCard, Loader2, User } from 'lucide-react';

export default function PizzaPage() {
  const { isLoaded, isSignedIn, user } = useUser(); // Clerk Auth State
  const [crusts, setCrusts] = useState<any[]>([]);
  const [toppings, setToppings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCrust, setSelectedCrust] = useState<any>(null);
  const [selectedToppings, setSelectedToppings] = useState<any[]>([]);
  const [address, setAddress] = useState("");

  useEffect(() => {
    async function fetchData() {
      const { data: c } = await supabase.from('crusts').select('*');
      const { data: t } = await supabase.from('toppings').select('*');
      setCrusts(c || []);
      setToppings(t || []);
      setSelectedCrust(c?.[0]);
      setLoading(false);
    }
    fetchData();
  }, []);

  const totalPrice = (selectedCrust?.price || 0) + 
    selectedToppings.reduce((sum, t) => sum + t.price, 12.00);

  const handleCheckout = async () => {
    if (!isSignedIn) return alert("Please sign in to order!");

    const { data, error } = await supabase.from('orders').insert([{
      user_email: user.primaryEmailAddress?.emailAddress, // Clerk Email
      delivery_address: address,
      delivery_date: new Date().toISOString().split('T')[0],
      delivery_hour: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      crust_id: selectedCrust.id,
      total_price: totalPrice,
      status: 'pending'
    }]).select();

    if (error) alert("Error: " + error.message);
    else alert("Order placed for " + user.firstName + "!");
  };

  if (!isLoaded || loading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      {/* AUTH HEADER */}
      <div className="flex justify-between items-center mb-8 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-2">
          <Pizza className="text-orange-500" size={32} />
          <h1 className="text-2xl font-bold">Pizza Studio</h1>
        </div>
        {isSignedIn ? (
          <div className="flex items-center gap-2 text-sm font-medium">
            <User size={16} /> {user.firstName}
          </div>
        ) : (
          <SignInButton mode="modal">
            <button className="bg-black text-white px-4 py-2 rounded-lg text-sm">Sign In to Order</button>
          </SignInButton>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* SELECTIONS */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-lg font-bold mb-4">1. Crust Type</h2>
            <div className="grid grid-cols-3 gap-3">
              {crusts.map((c) => (
                <button key={c.id} onClick={() => setSelectedCrust(c)} 
                  className={`p-4 rounded-xl border-2 text-center transition ${selectedCrust?.id === c.id ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}>
                  <div className="font-bold">{c.name}</div>
                  <div className="text-xs text-gray-500">+${c.price}</div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-4">2. Toppings</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {toppings.map((t) => {
                const isSelected = selectedToppings.some(st => st.id === t.id);
                return (
                  <button key={t.id} 
                    onClick={() => isSelected 
                      ? setSelectedToppings(selectedToppings.filter(st => st.id !== t.id))
                      : setSelectedToppings([...selectedToppings, t])}
                    className={`p-3 rounded-xl border-2 text-left flex justify-between items-center ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-100'}`}>
                    <span className="text-sm font-medium">{t.name}</span>
                    <span className="text-xs text-gray-400">${t.price}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-4">3. Delivery</h2>
            <textarea 
              className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-orange-500 outline-none" 
              placeholder="Full Address & Phone Number" 
              onChange={(e) => setAddress(e.target.value)} 
            />
          </section>
        </div>

        {/* SUMMARY CARD */}
        <div className="bg-white border-2 border-gray-100 p-6 rounded-2xl h-fit shadow-sm">
          <h2 className="font-bold text-xl mb-4">Summary</h2>
          <div className="space-y-3 text-sm text-gray-600 mb-6">
            <div className="flex justify-between"><span>Base</span><span>$12.00</span></div>
            <div className="flex justify-between"><span>{selectedCrust?.name}</span><span>${selectedCrust?.price.toFixed(2)}</span></div>
            {selectedToppings.map(t => (
              <div key={t.id} className="flex justify-between text-orange-600 italic">
                <span>+ {t.name}</span><span>${t.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="text-3xl font-black text-gray-900 mb-6">${totalPrice.toFixed(2)}</div>
          
          <button 
            disabled={!isSignedIn || !address}
            onClick={handleCheckout} 
            className="w-full bg-orange-500 disabled:bg-gray-300 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition shadow-lg shadow-orange-200">
            <CreditCard size={20} /> {isSignedIn ? "Order Now" : "Sign In to Order"}
          </button>
        </div>
      </div>
    </div>
  );
}