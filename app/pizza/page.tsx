"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser, SignInButton, Show, UserButton } from '@clerk/nextjs';
import { Pizza, CreditCard, Loader2, MapPin, User } from 'lucide-react';

export default function PizzaPage() {
  const { isLoaded, isSignedIn, user } = useUser();
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
    if (!isSignedIn || !user) return;

    // Use username instead of primaryEmailAddress
    const identifier = user.username || user.firstName || "Guest";

    const { data, error } = await supabase.from('orders').insert([{
      user_email: identifier, // Still using the column name 'user_email' but saving the username
      delivery_address: address,
      delivery_date: new Date().toISOString().split('T')[0],
      delivery_hour: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      crust_id: selectedCrust.id,
      total_price: totalPrice,
      status: 'pending'
    }]).select();

    if (error) alert("Error: " + error.message);
    else alert(`Order placed for Chef ${identifier}!`);
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      {/* AUTH HEADER */}
      <div className="flex justify-between items-center mb-8 p-4 bg-white border rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <Pizza className="text-orange-500" size={32} />
          <h1 className="text-2xl font-bold tracking-tight">Pizza Studio</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Show when="signed-in">
            <div className="flex items-center gap-3 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
              <User size={16} className="text-orange-600" />
              <span className="text-sm font-bold text-orange-700">
                {user?.username || "Chef"}
              </span>
              <UserButton />
            </div>
          </Show>

          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-sm font-bold transition">
                Sign In
              </button>
            </SignInButton>
          </Show>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* SELECTIONS */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-lg font-bold mb-4">1. Choose Your Crust</h2>
            <div className="grid grid-cols-3 gap-3">
              {crusts.map((c) => (
                <button key={c.id} onClick={() => setSelectedCrust(c)} 
                  className={`p-4 rounded-xl border-2 transition-all ${selectedCrust?.id === c.id ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200' : 'border-gray-100 hover:border-gray-300'}`}>
                  <div className="font-bold">{c.name}</div>
                  <div className="text-xs text-gray-500">+${c.price.toFixed(2)}</div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-4">2. Add Toppings</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {toppings.map((t) => {
                const isSelected = selectedToppings.some(st => st.id === t.id);
                return (
                  <button key={t.id} 
                    onClick={() => isSelected 
                      ? setSelectedToppings(selectedToppings.filter(st => st.id !== t.id))
                      : setSelectedToppings([...selectedToppings, t])}
                    className={`p-3 rounded-xl border-2 flex justify-between items-center transition-all ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-gray-300'}`}>
                    <span className="text-sm font-medium">{t.name}</span>
                    <span className="text-xs text-gray-400">${t.price.toFixed(2)}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-4">3. Delivery Details</h2>
            <div className="relative">
              <MapPin className="absolute top-4 left-4 text-gray-400" size={18} />
              <textarea 
                className="w-full p-4 pl-12 rounded-xl border-2 border-gray-100 focus:border-orange-500 outline-none" 
                placeholder="Where should we drop off the pizza?" 
                rows={3}
                onChange={(e) => setAddress(e.target.value)} 
              />
            </div>
          </section>
        </div>

        {/* SUMMARY CARD */}
        <div className="bg-gray-900 text-white p-6 rounded-3xl h-fit shadow-2xl sticky top-10">
          <h2 className="font-bold text-xl mb-6 border-b border-gray-800 pb-4">Order Summary</h2>
          <div className="space-y-4 text-sm mb-8">
            <div className="flex justify-between text-gray-400"><span>Base Pizza</span><span>$12.00</span></div>
            <div className="flex justify-between text-gray-400"><span>{selectedCrust?.name}</span><span>+${selectedCrust?.price.toFixed(2)}</span></div>
            {selectedToppings.map(t => (
              <div key={t.id} className="flex justify-between text-orange-400 font-medium italic">
                <span>+ {t.name}</span><span>+${t.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-end mb-8">
            <span className="text-gray-400">Total</span>
            <span className="text-4xl font-black text-white">${totalPrice.toFixed(2)}</span>
          </div>
          
          <button 
            disabled={!isSignedIn || !address || address.length < 5}
            onClick={handleCheckout} 
            className="w-full bg-orange-500 disabled:bg-gray-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition shadow-lg shadow-orange-900/20">
            <CreditCard size={20} /> 
            <Show when="signed-in">Order Now</Show>
            <Show when="signed-out">Sign In to Order</Show>
          </button>
        </div>
      </div>
    </div>
  );
}