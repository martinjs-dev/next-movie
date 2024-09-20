'use client'

import { signIn } from 'next-auth/react'
import { FormEvent, useState } from 'react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false, // Pour gérer l'erreur ici
    })

    if (res?.error) {
      alert('Erreur: ' + res.error)
    }
  }

  return (
    <div>
      <h1>Se connecter</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Se connecter</button>
      </form>

      <div>
        <button onClick={() => signIn('google')}>Se connecter avec Google</button>
        <button onClick={() => signIn('facebook')}>Se connecter avec Facebook</button>
        <button onClick={() => signIn('github')}>Se connecter avec GitHub</button>
      </div>

      <p>
        Mot de passe oublié? <a href="/auth/forgot-password">Cliquez ici</a>
      </p>
      <p>
        Vous n'avez pas encore de compte? <a href="/auth/signup">Inscrivez-vous</a>
      </p>
    </div>
  )
}
