'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashScreen() {
  const router = useRouter();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/onboarding');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex flex-col items-center justify-center p-8">
      <div className="w-32 h-32 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm shadow-2xl">
        <span className="text-4xl font-bold text-white">DOC</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4 drop-shadow-lg">
        DoctorOnCall
      </h1>
      {/* <p className="text-white/80 text-lg text-center px-4 max-w-md">
        Healthcare at your fingertips
      </p> */}
    </div>
  );
}
