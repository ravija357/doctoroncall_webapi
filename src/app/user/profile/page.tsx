"use client";

import { useEffect, useState } from "react";
import AuthGuard from "../../components/AuthGuard";

export default function UserProfilePage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch logged-in user
  useEffect(() => {
    fetch("http://localhost:3001/api/auth/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((result) => {
        setUserId(result.data._id);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleImageChange = (file: File | null) => {
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    if (!userId) return;

    const formData = new FormData();
    if (image) formData.append("image", image);

    const res = await fetch(`http://localhost:3001/api/auth/${userId}`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });

    alert(res.ok ? "Profile updated successfully ✅" : "Update failed ❌");
  };

  return (
    <AuthGuard role="user">
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #2563eb, #1e40af)",
        }}
      >
        <div
          style={{
            width: 360,
            background: "#ffffff",
            padding: 24,
            borderRadius: 16,
            boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
            textAlign: "center",
          }}
        >
          <h2>User Profile</h2>

          {/* Image Preview */}
          <img
            src={preview || "https://via.placeholder.com/120"}
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: 16,
            }}
          />

          {/* File Input */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
            disabled={loading}
          />

          <br />
          <br />

          {/* Update Button */}
          <button
            onClick={handleUpdateProfile}
            disabled={loading || !image}
            style={{
              opacity: loading || !image ? 0.6 : 1,
              cursor: loading || !image ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Loading user..." : "Update Profile"}
          </button>
        </div>
      </div>
    </AuthGuard>
  );
}
