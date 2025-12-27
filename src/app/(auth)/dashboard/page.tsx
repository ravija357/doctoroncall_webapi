'use client';

export default function DashboardPage() {
  const categories = [
    { label: 'WheelChair' },
    { label: 'Nutrisi' },
    { label: 'Heart' },
  ];

  const doctors = [
    {
      name: 'Dr. Steave Smith',
      degree: 'MBBS, ND-DNB',
      timing: 'Opening Timings: 9:00am - 5:00pm.',
    },
    {
      name: 'Dr. Josepin Clara',
      degree: 'MBBS, ND-DNB',
      timing: 'Opening Timings: 9:00am - 5:00pm.',
    },
    {
      name: 'Dr. Pravel Smith',
      degree: 'MBBS, ND-DNB',
      timing: 'Opening Timings: 9:00am - 5:00pm.',
    },
    {
      name: 'Dr. Mitchel Starch',
      degree: 'MBBS, ND-DNB',
      timing: 'Opening Timings: 9:00am - 5:00pm.',
    },
   
  ];

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-serif text-black">Find Your Doctor</h1>
          <p className="mt-6 text-2xl font-serif text-black">
            Book an appointment for consultation
          </p>
        </div>
        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden" />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-6 mb-10">
        {categories.map(cat => (
          <div
            key={cat.label}
            className="w-32 h-28 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center bg-white"
          >

           {/*Image of Category of doctors list */}
            <div className="mb-2 text-4xl text-sky-500">🏥</div>
            <span className="text-sky-500 font-serif text-sm">{cat.label}</span>
          </div>
        ))}
      </div>

      {/* Doctor cards */}
      <div className="space-y-6">
        {doctors.map(doc => (
          <div
            key={doc.name}
            className="w-full rounded-3xl bg-white shadow-md border border-gray-100 flex items-center px-6 py-4"
          >
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden mr-4" />

            {/* Info */}
            <div className="flex-1">
              <p className="text-xl font-serif text-black">{doc.name}</p>
              <p className="text-sm font-serif text-black mt-1">{doc.degree}</p>
              <p className="text-sm font-serif text-black mt-2">{doc.timing}</p>
            </div>

            {/* Book button */}
            <button className="ml-4 px-8 py-3 rounded-2xl bg-sky-400 text-white text-lg font-serif">
              Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}