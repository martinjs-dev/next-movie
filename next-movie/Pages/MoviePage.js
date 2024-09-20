import React, { useState } from 'react';
import dbConnect from '../lib/dbConnect';
import Comment from '../models/Comment';
import CommentPopup from '../components/CommentPopup';

const MoviePage = ({ movie }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [existingComment, setExistingComment] = useState(null);

  const handleOpenPopup = (comment = null) => {
    setExistingComment(comment);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setExistingComment(null);
  };

  const handleSubmitComment = async (commentData) => {
    try {
      const data = {
        userId: "UserId",
        movieId: movie._id,
        text: commentData.text.trim(),
        rating: commentData.rating
      };

      await dbConnect();

      
      const newComment = await Comment.create(data);
      console.log(newComment); 

      handleClosePopup();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du commentaire :", error);
      alert("Une erreur s'est produite lors de l'enregistrement du commentaire.");
    }
  };

  return (
    <div>
      <h1>{movie.title}</h1>

      <button onClick={() => handleOpenPopup()} className="bg-blue-500 text-white rounded px-4 py-2">
        Ajouter un Commentaire
      </button>

      
      {existingComment && (
        <button onClick={() => handleOpenPopup(existingComment)} className="bg-yellow-500 text-white rounded px-4 py-2">
          Modifier le Commentaire
        </button>
      )}

      <CommentPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        movieId={movie._id}
        userId={"UserId"}
        existingComment={existingComment}
        onSubmit={handleSubmitComment}
      />
    </div>
  );
};

// Fonction pour récupérer les données du film (SSR)
export async function getServerSideProps(context) {
  await dbConnect();

  const { id } = context.params;
  const movie = await Movie.findById(id);

  return {
    props: {
      movie: JSON.parse(JSON.stringify(movie)),
    },
  };
}

export default MoviePage;
