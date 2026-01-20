'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 🔥 REQUIRED FOR COOKIES
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || 'Login failed');
        setLoading(false);
        return;
      }

      // ✅ SUCCESS → GO TO DASHBOARD
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md px-6">
        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-10">
          <Image
            src="/doctoroncall_logo_webapi.png"
            alt="Doctor On Call logo"
            width={80}
            height={80}
          />
          <h1 className="text-4xl font-serif text-black mt-2">
            Doctor On Call
          </h1>
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
            className="w-full h-20 rounded-2xl border border-gray-200 px-4 text-lg outline-none"
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
            className="w-full h-20 rounded-2xl border border-gray-200 px-4 text-lg outline-none"
          />
        </div>

        {/* Signup */}
        <div className="mb-6 text-center text-lg font-serif text-black">
          Don’t have an account?{' '}
          <Link href="/register" className="text-sky-400">
            SignUp
          </Link>
        </div>

        {/* Login button */}
        <button
          type="button"
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
