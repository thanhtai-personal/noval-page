// components/UserInfo.tsx
'use client';

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../lib/api';

export default function UserInfo() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchWithAuth('/auth/me')
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  if (!user) return <p>Chưa đăng nhập</p>;

  return (
    <div>
      <p>Xin chào, {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}
