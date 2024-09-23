import { Schema, model, models, Types } from "mongoose";


interface IMovie {
  movieId: string; 
  userId: Types.ObjectId;
}


const MovieSchema = new Schema<IMovie>({
  movieId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

// Modèle Movie
const Movie = models.Movie || model<IMovie>("Movie", MovieSchema);

export default Movie;
