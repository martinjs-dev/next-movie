import { Schema, model, models, Types } from "mongoose";

interface IComment {
  userId: Types.ObjectId;
  movieId: string; 
  comment: string;
  rating: number;
}

const CommentSchema = new Schema<IComment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
});

const Comment = models.Comment || model<IComment>('Comment', CommentSchema);

export default Comment;
