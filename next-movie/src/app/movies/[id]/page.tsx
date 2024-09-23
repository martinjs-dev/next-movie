"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getMovieDetails } from "@/services/tmdb";
import AddCommentForm from "@/componets/AddCommentForm";

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [movie, setMovie] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]); // Initialisation à un tableau vide
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const data = await getMovieDetails(movieId);
      setMovie(data);
      setLoading(false);
    };

    const fetchComments = async () => {
      const res = await fetch(`/api/comments?movieId=${movieId}`);
      const data = await res.json();
      setComments(data || []);

      // Moyenne des notes
      if (data && data.length > 0) {
        const totalRating = data.reduce(
          (acc: number, comment: any) => acc + comment.rating,
          0
        );
        setAverageRating(totalRating / data.length);
      }
    };

    fetchMovieDetails();
    fetchComments();
  }, [movieId]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="container mx-auto p-4 pt-6 mt-12">
      {movie && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            <p className="text-gray-400 mb-4">{movie.release_date}</p>
            <p className="mb-4">{movie.overview}</p>
            <p className="text-lg">Note: {movie.vote_average}</p>
            <p className="text-lg">Durée: {movie.runtime} minutes</p>
            <p className="text-lg">
              Genres: {movie.genres.map((g: any) => g.name).join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* Section des commentaires */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Commentaires</h2>
        {/* Affichage de la moyenne des notes */}
        {averageRating !== null && (
          <p className="text-lg mt-4">
            <b>
              Moyenne des notes de nos utilisateurs : {averageRating.toFixed(1)} /
              5
            </b>
          </p>
        )}
        {comments.length === 0 ? (
          <p>Aucun commentaire pour ce film.</p>
        ) : (
          comments.map((comment: any) => (
            <div key={comment._id} className="border-b py-4">
              <p>
                <strong>Note:</strong> {comment.rating}/5
              </p>
              <p>{comment.comment}</p>
              <p className="text-gray-500 text-sm">
                Posté par {comment.userId}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Section pour laisser un commentaire */}
      <AddCommentForm movieId={movieId} />
    </div>
  );
}
