"use client";

import AuthGuard from "../../components/AuthGuard";

export default function AdminUsersPage() {
  return (
    <AuthGuard role="admin">
      <div style={{ padding: 20 }}>
        <h1>Admin – Users</h1>

        <table border={1} cellPadding={10}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>dummy-id</td>
              <td>dummy@email.com</td>
            </tr>
          </tbody>
        </table>
      </div>
    </AuthGuard>
  );
}
