'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'


export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const router = useRouter()
  const { token } = router.query

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

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
      router.push('/auth/signin')
    } else {
      alert('Erreur: ' + data.error)
    }
  }

  return (
    <div>
      <h1>Réinitialiser le mot de passe</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Nouveau mot de passe"
          required
        />
        <button type="submit">Réinitialiser le mot de passe</button>
      </form>
    </div>
  )
}
