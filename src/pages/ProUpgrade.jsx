import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Zap, Crown, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';

const PLANS = [
  {
    id: 'yearly',
    label: 'Yearly',
    price: '₹399',
    sub: '₹33/month',
    badge: '🔥 Most Popular',
    badgeColor: 'bg-orange-500',
    highlight: true,
    amount: 39900,
    description: 'Best value — save 33%',
  },
  {
    id: 'monthly',
    label: 'Monthly',
    price: '₹49',
    sub: 'Billed monthly',
    badge: null,
    highlight: false,
    amount: 4900,
    description: 'Pay month by month',
  },
  {
    id: 'lifetime',
    label: 'Lifetime',
    price: '₹999',
    sub: 'One-time payment',
    badge: '💎 Best Value',
    badgeColor: 'bg-purple-600',
    highlight: false,
    amount: 99900,
    description: 'Pay once, keep forever',
  },
];

const FEATURES = [
  { icon: '🖤', text: 'Blackout Mode — battery saver counting' },
  { icon: '🎨', text: '15+ Exclusive premium themes' },
  { icon: '🎵', text: '30+ Professional meditation sounds' },
  { icon: '☁️', text: 'Cloud sync across all devices' },
  { icon: '📊', text: 'Advanced analytics & insights' },
  { icon: '🔥', text: 'Streak freeze — 1 free pass/week' },
  { icon: '🚫', text: 'Ad-free experience' },
  { icon: '⚡', text: 'Priority support' },
];

export default function ProUpgrade() {
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      if (u?.role === 'pro' || localStorage.getItem('japa_isPro') === 'true') setIsPro(true);
    }).catch(() => {});
  }, []);

  const handleUpgrade = async () => {
    if (!user) {
      base44.auth.redirectToLogin(createPageUrl('ProUpgrade'));
      return;
    }

    const plan = PLANS.find(p => p.id === selectedPlan);
    setLoading(true);

    const razorpayKey = localStorage.getItem('japa_razorpayKey') || '';
    if (!razorpayKey) {
      alert('Razorpay key not configured. Please add your Razorpay key in the app settings.\n\nTo test: open browser console and run:\nlocalStorage.setItem("japa_razorpayKey", "rzp_test_YOURKEY")');
      setLoading(false);
      return;
    }

    // Load Razorpay script (avoid duplicate)
    const existingScript = document.querySelector('script[src*="razorpay"]');
    const loadScript = existingScript
      ? Promise.resolve()
      : new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = resolve;
          document.body.appendChild(script);
        });

    loadScript.then(() => {
      const options = {
        key: razorpayKey,
        amount: plan.amount,
        currency: 'INR',
        name: 'JapaTap Counter',
        description: `Pro Subscription — ${plan.label}`,
        prefill: {
          email: user.email,
          name: user.full_name,
        },
        theme: { color: '#f59e0b' },
        handler: function(response) {
          localStorage.setItem('japa_isPro', 'true');
          localStorage.setItem('japa_proPlan', selectedPlan);
          localStorage.setItem('japa_paymentId', response.razorpay_payment_id);
          setIsPro(true);
          setLoading(false);
          window.location.href = createPageUrl('ProSuccess');
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => setLoading(false));
      rzp.open();
    });
  };

  if (isPro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="text-7xl mb-4">💎</div>
        <h1 className="text-3xl font-bold mb-2">You're Pro!</h1>
        <p className="text-white/70 mb-2">Plan: <span className="capitalize font-semibold text-amber-300">{localStorage.getItem('japa_proPlan') || 'Pro'}</span></p>
        <p className="text-white/60 text-sm mb-8">All premium features are active.</p>
        <Link to={createPageUrl('Home')} className="px-8 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 font-semibold transition-all">
          Back to App
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/20 backdrop-blur-md border-b border-white/10 px-4 py-4 flex items-center gap-3">
        <Link to={createPageUrl('Home')} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold flex-1">Upgrade to Pro 💎</h1>
      </div>

      <div className="p-5 pb-32 space-y-6 max-w-md mx-auto">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="text-center py-4">
          <div className="text-6xl mb-3">💎</div>
          <h2 className="text-2xl font-bold mb-1">Unlock Premium Features</h2>
          <p className="text-white/60 text-sm">7-day free trial • Cancel anytime</p>
        </motion.div>

        {/* Features list */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 space-y-3">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xl w-8 text-center">{f.icon}</span>
              <span className="text-sm text-white/90">{f.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Plan selection */}
        <div className="space-y-3">
          <h3 className="font-bold text-white/80 uppercase tracking-wider text-sm">Choose Your Plan</h3>
          {PLANS.map((plan, i) => (
            <motion.button
              key={plan.id}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full relative p-4 rounded-2xl border-2 text-left transition-all ${
                selectedPlan === plan.id
                  ? 'border-amber-400 bg-amber-500/20'
                  : 'border-white/20 bg-white/10 hover:border-white/40'
              }`}
            >
              {plan.badge && (
                <span className={`absolute -top-2.5 left-4 px-2 py-0.5 rounded-full text-xs font-bold text-white ${plan.badgeColor}`}>
                  {plan.badge}
                </span>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-lg">{plan.label} — {plan.price}</div>
                  <div className="text-white/60 text-sm">{plan.sub}</div>
                  <div className="text-white/50 text-xs mt-0.5">{plan.description}</div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  selectedPlan === plan.id ? 'border-amber-400 bg-amber-400' : 'border-white/40'
                }`}>
                  {selectedPlan === plan.id && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Trial note */}
        <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
          <Shield className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <p className="text-white/70 text-sm">7-day free trial included on all plans. Cancel within 7 days and you won't be charged.</p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-amber-950 to-transparent">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full max-w-md mx-auto block py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-lg shadow-xl shadow-amber-900/50 hover:from-amber-300 hover:to-orange-400 transition-all disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Opening Payment...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Crown className="w-5 h-5" />
              Start Free Trial — {PLANS.find(p => p.id === selectedPlan)?.price}
            </span>
          )}
        </motion.button>
        <p className="text-center text-white/40 text-xs mt-2">Secured by Razorpay</p>
      </div>
    </div>
  );
}