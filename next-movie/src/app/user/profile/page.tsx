'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      setName(session?.user?.name || '');
      setEmail(session?.user?.email || '');
    } else if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <p>Chargement...</p>;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const res = await fetch('/api/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    });

    if (res.ok) {
        await update();
      setSuccessMessage('Profil mis à jour avec succès');
      router.refresh();
    } else {
      const data = await res.json();
      setErrorMessage(data.error || 'Erreur lors de la mise à jour du profil');
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')) {
      const res = await fetch('/api/user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        alert('Compte supprimé avec succès');
        signOut({ callbackUrl: '/' }); 
      } else {
        const data = await res.json();
        alert(data.error || 'Erreur lors de la suppression du compte');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mon Profil</h1>

      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-lg">
            Nom
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full text-black"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-lg">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full text-black"
            required
          />
        </div>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}

        <button type="submit" className="bg-purple-600 text-white p-2 rounded">
          Mettre à jour le profil
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Supprimer le compte</h2>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 text-white p-2 rounded"
        >
          Supprimer mon compte
        </button>
      </div>
    </div>
  );
}
