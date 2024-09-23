'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditUserPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { userId } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/user/${userId}`);
      const data = await res.json();
      setUser(data);
      setName(data.name);
      setEmail(data.email);
      setIsAdmin(data.isAdmin);
      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUser = { name, email, isAdmin, ...(password && { password }) };
    const res = await fetch(`/api/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    });

    if (res.ok) {
      alert('Utilisateur mis à jour avec succès.');
      router.push('/admin/users');
    } else {
      alert('Erreur lors de la mise à jour de l\'utilisateur.');
    }
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Modifier l'utilisateur</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Nom</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Admin</label>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={() => setIsAdmin(!isAdmin)}
          />{' '}
          Rendre admin
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">Mot de passe (laisser vide si inchangé)</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
            placeholder="Nouveau mot de passe"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Mettre à jour
        </button>
      </form>
    </div>
  );
}
