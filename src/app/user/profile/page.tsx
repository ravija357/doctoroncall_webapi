"use client";

import { useEffect, useState } from "react";
import AuthGuard from "../../components/AuthGuard";
import { Mail, MapPin, Stethoscope, User, ShieldCheck, PenTool, Calendar, Settings, Moon, Bell, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getImageUrl } from "@/utils/imageHelper";

export default function UserProfilePage() {
  const { user, refreshUser } = useAuth();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Preferences State
  const [preferences, setPreferences] = useState({
    darkMode: false,
    notifications: true,
    newsletter: false
  });

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    if (key === 'darkMode') {
        // Simple class toggle for demo purposes
        document.documentElement.classList.toggle('dark');
    }
  };

  
  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
    address: "Kathmandu, Nepal" // Default or fetched
  });

  useEffect(() => {
    if (user) {
        setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            phone: (user as any).phone || "",
            bio: (user as any).bio || "",
            address: (user as any).address || "Kathmandu, Nepal"
        });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  // Removed incorrect useEffect that set preview from user.image
  // We want to use getImageUrl(user.image) in the render until a new file is selected

  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user?._id) return;
    setLoading(true);

    const data = new FormData();
    if (image) data.append("image", image);
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("phone", formData.phone);
    data.append("bio", formData.bio);
    data.append("address", formData.address);

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/api/auth/${user._id}`, {
          method: "PUT",
          credentials: "include",
          body: data,
        });
    
        if (res.ok) {
            await refreshUser(); // Refresh user context
            alert("Profile updated successfully ✅");
            setImage(null); // Reset file input
            // window.location.reload(); 
        } else {
            alert("Update failed ❌");
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred");
    } finally {
        setLoading(false);
    }
  };



  if (!user) return null;

  return (
    <AuthGuard>
       <div className="min-h-screen bg-blue-50/50 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-slate-900 font-serif">
              My Profile
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Manage your personal information and account settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-blue-100/50 border border-blue-100">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-3xl bg-blue-100 mb-6 overflow-hidden p-1 relative group">
                    <img 
                       src={preview || getImageUrl(user.image, user._id)} 
                       alt="Profile"
                       className="w-full h-full object-cover rounded-2xl"
                    />
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                        <PenTool className="text-white w-8 h-8" />
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                        />
                    </label>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-800">
                    {user.firstName} {user.lastName}
                  </h2>
                  <div className={`flex items-center gap-2 mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user.role === 'doctor' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                     <ShieldCheck className="w-4 h-4" />
                     {user.role === 'doctor' ? 'Doctor Account' : 'Patient Account'}
                  </div>

                  <div className="w-full h-px bg-slate-100 my-8" />

                  <div className="w-full space-y-4">
                     <InfoRow icon={<Mail />} label="Email" value={user.email} />
                     <InfoRow icon={<Calendar />} label="Member Since" value={new Date(user.createdAt || Date.now()).toLocaleDateString()} />
                     <InfoRow icon={<MapPin />} label="Location" value="Kathmandu, Nepal" />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions / Edit Section */}
            <div className="lg:col-span-2 space-y-8">
               
               <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" />
                    Account Settings
                  </h3>
                  
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6 space-y-4">
                     <p className="text-slate-600 leading-relaxed text-sm">
                        Update your personal details here. Click "Save Changes" when done.
                     </p>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">First Name</label>
                            <input 
                                type="text" 
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white text-slate-800 font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Last Name</label>
                            <input 
                                type="text" 
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white text-slate-800 font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                            <input 
                                type="tel" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+977"
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white text-slate-800 font-medium"
                            />
                        </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Address</label>
                            <input 
                                type="text" 
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white text-slate-800 font-medium"
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bio / About</label>
                            <textarea 
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white text-slate-800 font-medium resize-none"
                            />
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-end">
                      <button
                        onClick={handleUpdateProfile}
                        disabled={loading}
                        className={`
                            px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all
                            ${loading 
                                ? 'bg-slate-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-blue-200'
                            }
                        `}
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                  </div>
               </div>

               {/* Preferences Section */}
               <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                   <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                     <Settings className="w-5 h-5 text-purple-500" />
                     App Preferences
                   </h3>
                   
                   <div className="space-y-6">
                        <ToggleRow 
                            icon={<Moon className="w-5 h-5 text-slate-600" />}
                            title="Dark Mode"
                            description="Switch to a darker theme for low-light environments."
                            isActive={preferences.darkMode}
                            onToggle={() => togglePreference('darkMode')}
                        />
                        <ToggleRow 
                            icon={<Bell className="w-5 h-5 text-slate-600" />}
                            title="Push Notifications"
                            description="Receive alerts about appointments and messages."
                            isActive={preferences.notifications}
                            onToggle={() => togglePreference('notifications')}
                        />
                        <ToggleRow 
                            icon={<Sparkles className="w-5 h-5 text-slate-600" />}
                            title="Product Updates"
                            description="Get the latest news and feature updates."
                            isActive={preferences.newsletter}
                            onToggle={() => togglePreference('newsletter')}
                        />
                   </div>
               </div>



            </div>

          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

function InfoRow({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4 group">
       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
         {icon}
       </div>
       <div className="text-left">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{label}</p>
          <p className="text-sm font-bold text-slate-700">{value}</p>
       </div>
    </div>
  )
}

function ToggleRow({ icon, title, description, isActive, onToggle }: any) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer" onClick={onToggle}>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    {icon}
                </div>
                <div>
                    <h4 className="font-bold text-slate-800">{title}</h4>
                    <p className="text-xs text-slate-500">{description}</p>
                </div>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isActive ? 'bg-blue-600' : 'bg-slate-200'}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
        </div>
    )
}
