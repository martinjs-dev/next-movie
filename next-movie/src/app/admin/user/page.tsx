'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user');
        if (!res.ok) {
          throw new Error('Erreur lors de la récupération des utilisateurs');
        }
        const data = await res.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    const confirmed = confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setUsers(users.filter((user) => user._id !== userId));
        alert('Utilisateur supprimé avec succès');
      } else {
        alert('Erreur lors de la suppression de l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      alert('Une erreur est survenue');
    }
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Liste des utilisateurs</h1>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="p-2 text-left">Nom</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Admin</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-t">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.isAdmin ? 'Oui' : 'Non'}</td>
              <td className="p-2">
                <Link href={`/admin/users/${user._id}`}>
                  <button className="bg-blue-500 text-white p-2 rounded mr-2">Modifier</button>
                </Link>
                <button
                  className="bg-red-500 text-white p-2 rounded"
                  onClick={() => handleDelete(user._id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
