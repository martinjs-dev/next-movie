'use client' // Active le rendu côté client

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') // Récupérer le token depuis les paramètres de l'URL
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) return

      const res = await fetch(`/api/auth/verify-email?token=${token}`)
      // const data = await res.json()

      if (res.ok) {
        setMessage('Votre email a été vérifié avec succès.')
      } else {
        setMessage('Le lien est invalide ou expiré.')
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-purple-600">Vérification de l&apos;email</h2>
        <p className={`text-lg font-semibold ${message.includes('succès') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      </div>
    </div>
  )
}
