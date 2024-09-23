"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <p>Chargement...</p>;
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;

  const cleanName = (name: string) => {
    return name.trim().replace(/\s+/g, " ");
  };

  const cleanedName = cleanName(name);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!nameRegex.test(cleanedName)) {
      setErrorMessage("Le nom ne doit contenir que des lettres et un espace entre les mots.");
      return;
    }

    if (cleanedName.length < 3 || cleanedName.length > 60) {
      setErrorMessage("Le nom doit comporter entre 3 et 60 caractères.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Veuillez entrer une adresse email valide.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 6 || password.length > 32) {
      setErrorMessage(
        "Le mot de passe doit comporter entre 6 et 32 caractères."
      );
      return;
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    console.log(res)

    const data = await res.json();

    if (res.ok) {
      Swal.fire({
        title: "Succès",
        text: "Votre adresse e-mail a été vérifiée avec succès.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/auth/signin");
      });
    } else {
      Swal.fire({
        title: "Succès",
        text: "Votre adresse e-mail a été vérifiée avec succès.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/auth/signin");
      });
      toast.error("Votre adresse e-mail a été vérifiée avec succès.");
      setErrorMessage(data.error || "Erreur lors de l’inscription.");
    }
  };

  const handleOAuthLogin = (provider: string) => {
    signIn(provider);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-purple-600">
          Créer un compte
        </h2>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-1"
            >
              Nom
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-100 text-gray-900 border border-gray-300 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Nom"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-1"
            >
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

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-1"
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-100 text-gray-900 border border-gray-300 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Mot de passe"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 font-medium mb-1"
            >
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
            S&apos;inscrire
          </button>
        </form>

        <div className="flex items-center justify-center my-6">
          <div className="w-full border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">OU</span>
          <div className="w-full border-t border-gray-300"></div>
        </div>

        {/* Boutons OAuth */}
        <div className="flex justify-between">
          {/* Google Button */}
          <button
            className="w-1/3 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded mx-1 flex items-center justify-center"
            onClick={() => handleOAuthLogin("google")}
          >
            <img
              src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Google
          </button>

          {/* GitHub Button */}
          <button
            className="w-1/3 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded mx-1 flex items-center justify-center"
            onClick={() => handleOAuthLogin("github")}
          >
            <img
              src="https://cdn0.iconfinder.com/data/icons/shift-logotypes/32/Github-512.png"
              alt="GitHub"
              className="w-5 h-5 mr-2"
            />
            GitHub
          </button>

          {/* Facebook Button */}
          <button
            className="w-1/3 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded mx-1 flex items-center justify-center"
            onClick={() => handleOAuthLogin("facebook")}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
              alt="Facebook"
              className="w-5 h-5 mr-2"
            />
            Facebook
          </button>
        </div>

        <p className="text-gray-500 mt-4">
          Vous avez déjà un compte ?{" "}
          <a
            href="/auth/signin"
            className="text-purple-600 hover:text-orange-600 transition duration-200"
          >
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}
