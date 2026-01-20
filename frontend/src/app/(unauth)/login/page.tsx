'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ REQUIRED for cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // ✅ Save token in cookie
      document.cookie = `token=${data.data.token}; path=/; max-age=604800`;

      // ✅ Redirect after login
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md px-6">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Image
            src="/doctoroncall_logo_webapi.png"
            alt="Doctor On Call logo"
            width={80}
            height={80}
            className="mb-2"
          />
          <h1 className="text-4xl font-serif text-black">Doctor On Call</h1>
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="block mb-2 text-xl font-serif text-black">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-20 rounded-2xl border border-gray-200 px-4 text-lg"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block mb-2 text-xl font-serif text-black">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-20 rounded-2xl border border-gray-200 px-4 text-lg"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        {/* Signup */}
        <div className="mb-6 text-center text-lg font-serif">
          Don’t have an account?{' '}
          <Link href="/register" className="text-sky-400">
            SignUp
          </Link>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full h-20 rounded-2xl bg-sky-400 text-white text-2xl font-serif"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
}
