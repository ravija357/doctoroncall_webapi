'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md px-6">
        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-10">
             <Image
               src="/doctoroncall_webapi/public/doctoroncall_logo_webapi.png"
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
            className="w-full h-20 rounded-2xl border border-gray-200 bg-white px-4 text-lg outline-none focus:border-sky-400"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block mb-2 text-xl font-serif text-black">
            Password
          </label>
          <input
            type="password"
            className="w-full h-20 rounded-2xl border border-gray-200 bg-white px-4 text-lg outline-none focus:border-sky-400"
          />
        </div>

        {/* Forgot password */}
        <div className="mb-4 text-center">
          <button className="text-lg text-sky-400 font-serif">
            Forgot Password?
          </button>
        </div>

        {/* Sign up text */}
        <div className="mb-6 text-center text-lg font-serif text-black">
          Don’t have an account?{' '}
          <Link href="/register" className="text-sky-400">
            SignUp
          </Link>
        </div>

        {/* Login button */}
        <button className="w-full h-20 rounded-2xl bg-sky-400 text-white text-2xl font-serif">
          Login
        </button>
      </div>
    </div>
  );
}
