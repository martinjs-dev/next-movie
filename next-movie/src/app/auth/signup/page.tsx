'use client'

import { useState, FormEvent } from 'react'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await res.json()

    if (res.ok) {
      alert('Vérifiez votre email pour terminer l’inscription.')
    } else {
      alert('Erreur: ' + data.error)
    }
  }

  return (
    <div>
      <h1>Créer un compte</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          required
        />
        <button type="submit">S`&apos;`inscrire</button>
      </form>

      <p>
        Vous avez déjà un compte? <a href="/auth/signin">Se connecter</a>
      </p>
    </div>
  )
}
