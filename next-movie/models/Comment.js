import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  movieId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Movie' },
  text: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
}, {
  timestamps: true, 
});

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
