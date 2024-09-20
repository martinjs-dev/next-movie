'use client'

import { useState, FormEvent } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()

    if (res.ok) {
      alert('Un lien de réinitialisation du mot de passe vous a été envoyé par email.')
    } else {
      alert('Erreur: ' + data.error)
    }
  }

  return (
    <div>
      <h1>Mot de passe oublié</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <button type="submit">Envoyer le lien de réinitialisation</button>
      </form>
    </div>
  )
}
