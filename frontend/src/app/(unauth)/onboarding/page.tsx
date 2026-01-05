'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  
  const slides = [
    { title: 'Welcome to DoctorOnCall', desc: 'Book doctors instantly', icon: '👨‍⚕️' },
    { title: 'Find Your Doctor', desc: '24/7 availability', icon: '🏥' },
    { title: 'Get Started', desc: 'Join thousands of patients', cta: 'Continue' }
  ];

  const current = slides[step];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-white flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-sky-100 p-10 space-y-8">
        {/* Progress dots */}
        <div className="flex justify-center gap-3">
          {[0,1,2].map(i => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-full transition-all shadow-sm ${i === step ? 'bg-sky-500 shadow-sky-200' : 'bg-gray-300'}`}
            />
          ))}
        </div>
        
        <div className="text-center space-y-6">
          <div className="text-6xl mx-auto mb-6">{current.icon}</div>
          <h1 className="text-4xl font-serif font-bold text-gray-900 drop-shadow-sm">
            {current.title}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed px-4">
            {current.desc}
          </p>
          
          <div className="space-y-4">
            {step < 2 ? (
              <>
                <button 
                  onClick={() => setStep(step + 1)}
                  className="w-full h-14 rounded-2xl bg-sky-400 text-white font-serif font-semibold text-lg shadow-xl hover:shadow-2xl hover:bg-sky-500 transition-all"
                >
                  Next
                </button>
                <button 
                  onClick={() => router.push('/login')}
                  className="w-full text-sm text-gray-500 font-serif hover:text-gray-700 underline"
                >
                  Skip
                </button>
              </>
            ) : (
              <button 
                onClick={() => router.push('/login')}
                className="w-full h-16 bg-sky-400 text-white rounded-2xl font-serif font-bold text-xl shadow-2xl hover:shadow-3xl hover:bg-sky-500 transition-all"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
