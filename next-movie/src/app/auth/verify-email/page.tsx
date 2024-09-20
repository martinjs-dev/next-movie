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
      const data = await res.json()

      if (res.ok) {
        setMessage('Votre email a été vérifié avec succès.')
      } else {
        setMessage('Le lien est invalide ou expiré.')
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div>p
      <h1>Vérification de l'email</h1>
      <p>{message}</p>
    </div>
  )
}
