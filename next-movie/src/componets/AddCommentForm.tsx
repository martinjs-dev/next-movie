"use client";

import { useState } from "react";
import { useSession} from "next-auth/react"; 
// import { useRouter } from "next/router";

export default function AddCommentForm({ movieId }: { movieId: string }) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [errorMessage, setErrorMessage] = useState("");
  const { data:  status } = useSession(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (comment.trim() === "") {
      setErrorMessage("Le commentaire ne peut pas être vide.");
      return;
    }

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movieId, comment, rating }),
    });

    if (res.ok) {
      alert("Commentaire ajouté avec succès");
      setComment("");
      setRating(5);
    } else {
      setErrorMessage("Erreur lors de l’ajout du commentaire");
    }
  };

  
  if (status === "unauthenticated") {
    return (
      <div className="mt-8 bg-gray-200 p-4 rounded text-center">
        <p className="mb-4 text-black"><b>Vous devez être connecté pour laisser un commentaire.</b></p>
        <a href="/auth/signin"><button
          className="bg-purple-600 text-white p-2 rounded"
        >
          Se connecter
        </button></a>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Laisser un commentaire</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label className="mb-2 font-bold">Note</label>
          <div className="flex justify-between">
            {[5, 4, 3, 2, 1].map((value) => (
              <label key={value} className="flex items-center">
                <input
                  type="radio"
                  name="rating"
                  value={value}
                  checked={rating === value}
                  onChange={() => setRating(value)}
                  className="mr-2"
                />
                {value} étoile{value > 1 ? "s" : ""}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-lg">
            Commentaire:
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="p-2 border border-gray-300 text-black rounded w-full"
            rows={4}
            placeholder="Laisser un commentaire..."
          />
        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <button type="submit" className="bg-purple-600 text-white p-2 rounded">
          Ajouter un commentaire
        </button>
      </form>
    </div>
  );
}
