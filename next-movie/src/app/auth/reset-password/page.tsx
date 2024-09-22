'use client'

import { useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') // Récupérer le token depuis les paramètres de l'URL

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validation des mots de passe (min 6 caractères)
    if (newPassword.length < 6 || newPassword.length > 32) {
      setErrorMessage('Le mot de passe doit contenir entre 6 et 32 caractères.')
      return
    }

    // Vérification si les deux mots de passe sont identiques
    if (newPassword !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.')
      return
    }

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    })

    const data = await res.json()

    if (res.ok) {
      alert('Mot de passe réinitialisé avec succès.')
      router.push('/auth/signin')  // Redirection vers la page de connexion après succès
    } else {
      setErrorMessage(data.error || 'Erreur lors de la réinitialisation du mot de passe.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-purple-600">Réinitialiser le mot de passe</h2>
        
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-1">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-gray-100 text-gray-900 border border-gray-300 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Nouveau mot de passe"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">
              Confirmer mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-gray-100 text-gray-900 border border-gray-300 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Confirmer mot de passe"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200"
          >
            Réinitialiser le mot de passe
          </button>
        </form>
      </div>
    </div>
  )
}
