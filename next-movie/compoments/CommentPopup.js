import React, { useState } from 'react';

const CommentPopup = ({ isOpen, onClose, movieId, userId, existingComment, onSubmit }) => {
  const [text, setText] = useState(existingComment ? existingComment.text : '');
  const [rating, setRating] = useState(existingComment ? existingComment.rating : 1);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const trimmedText = text.trim();

    if (trimmedText === '') {
      setError('Le commentaire ne peut pas être vide.');
      return;
    } else {
      setError('');
    }

    onSubmit({ text: trimmedText, rating });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h2 className="text-xl font-semibold mb-4">
          {existingComment ? 'Modifier Commentaire' : 'Ajouter Commentaire'}
        </h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <textarea
            className="border rounded p-2 w-full mb-4"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Écrivez votre commentaire ici..."
            required
          />
          <div className="flex mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <label key={star} className="cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={star}
                  checked={rating === star}
                  onChange={() => setRating(star)}
                  className="hidden"
                />
                <svg
                  className={`h-6 w-6 ${star <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.431 8.164 1.182-5.9 5.734 1.391 8.14L12 18.897l-7.323 3.851 1.391-8.14-5.9-5.734 8.164-1.182L12 .587z" />
                </svg>
              </label>
            ))}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded px-4 py-2 mr-2"
          >
            {existingComment ? 'Mettre à jour' : 'Commenter'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 rounded px-4 py-2"
          >
            Annuler
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentPopup;
