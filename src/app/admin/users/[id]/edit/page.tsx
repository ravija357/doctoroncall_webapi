"use client";

import { useParams } from "next/navigation";
import AuthGuard from "../../../../components/AuthGuard";

export default function EditUserPage() {
  const params = useParams();

  return (
    <AuthGuard role="admin">
      <div style={{ padding: 20 }}>
        <h1>Edit User</h1>
        <p>User ID: {params.id}</p>
      </div>
    </AuthGuard>
  );
}
