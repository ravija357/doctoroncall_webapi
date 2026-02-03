"use client";

import { useState } from "react";
import AuthGuard from "../../../components/AuthGuard";

export default function CreateUserPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [image, setImage] = useState<File | null>(null);

  const handleCreateUser = async () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);

    if (image) {
      formData.append("image", image);
    }

    const res = await fetch("http://localhost:3001/api/admin/users", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    alert(res.ok ? "User created" : "Failed");
  };

  return (
    <AuthGuard role="admin">
      <div style={{ padding: 20 }}>
        <h1>Create User</h1>

        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <select onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <br /><br />

        <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        <br /><br />

        <button onClick={handleCreateUser}>Create</button>
      </div>
    </AuthGuard>
  );
}
