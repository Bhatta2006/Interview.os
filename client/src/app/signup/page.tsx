'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import useStore from '@/store/useStore';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error("API returned invalid JSON");
      }

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Success
      // Note: The new API only returns { success: true, user: ... }, it might DOES NOT return a JWT token in the user request example.
      // But the existing `login` store expects a token.
      // If the user's provided code example didn't return a token, we might break the login flow.
      // The user's code: return NextResponse.json({ success: true })
      // Wait, if there is no token, we can't login locally.
      // I will assume the user wants me to follow their code EXACTLY.
      // If so, I should redirect to login page? Or auto-login?
      // User said: "It must return 405 Method Not Allowed (not 404)". 
      // User example code did NOT show token generation.
      // I will follow the user's instruction for the route, but I should probably add token generation if I want the app to actually work after signup.
      // However, strict adherence first.

      // Checking local implementation...
      // My local route implementation (step 1018) DID NOT include token generation because I followed the user's snippet blindly?
      // Wait, in step 1014 I wrote the route. I actually DID NOT include jwt.
      // I followed the user snippet: `return NextResponse.json({ success: true })` (User said this).
      // Actually in step 1014 I added `user: { id... }` but no token.

      // So, we cannot `login(res.data.user, res.data.token)`.
      // We should probably redirect to /login.

      router.push('/login?registered=true');

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Create Account</h1>
        <p className="text-center text-gray-400 mb-8">Join SolveIt and master your interviews</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Get Started'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link href="/login" className="text-primary hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
