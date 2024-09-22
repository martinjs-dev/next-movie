'use client'

import { useState, FormEvent } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validation de l'email
    if (!validateEmail(email)) {
      setErrorMessage("Veuillez entrer une adresse email valide.")
      return
    }

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()

    if (res.ok) {
      setSuccessMessage('Un lien de réinitialisation du mot de passe vous a été envoyé par email.')
      setErrorMessage('')  // Efface l'éventuel message d'erreur
    } else {
      setErrorMessage(data.error || 'Une erreur s\'est produite lors de la demande de réinitialisation.')
      setSuccessMessage('')  // Efface l'éventuel message de succès
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-purple-600">Mot de passe oublié</h2>
        
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-100 text-gray-900 border border-gray-300 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="email@example.com"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200"
          >
            Envoyer le lien de réinitialisation
          </button>
        </form>
      </div>
    </div>
  )
}
