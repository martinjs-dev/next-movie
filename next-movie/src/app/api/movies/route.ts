import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Movie from '@/models/Movie';
import dbConnect from '@/lib/mongodb';


export const POST = async (req: Request) => {
  const session = await getServerSession(authOptions);
//   if (!session || !session.user?.isAdmin) {
//     return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
//   }

  const { movieIds } = await req.json();

  if (!movieIds || movieIds.length === 0) {
    return NextResponse.json({ error: 'Aucun film sélectionné' }, { status: 400 });
  }
console.log(movieIds)
  await dbConnect();

  try {
    const addedMovies = await Promise.all(
      movieIds.map(async (movieId: string) => {
        const existingMovie = await Movie.findOne({ movieId });
        if (!existingMovie) {
          const newMovie = new Movie({
            movieId,
            userId: session.user.id,
          });
          await newMovie.save();
          return newMovie;
        }
      })
    );
    return NextResponse.json({ message: 'Films ajoutés avec succès', addedMovies });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de l’ajout des films' }, { status: 500 });
  }
};


export const GET = async (req: Request) => {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const all = url.searchParams.get('all'); 
    const page = parseInt(url.searchParams.get('page') || '1', 10); 
    const limit = 20; 

    // Si 'all=true', on renvoie tous les films sans pagination
    if (all === 'true') {
      const allMovies = await Movie.find({});
      return NextResponse.json({
        movies: allMovies.map((movie) => ({ movieId: movie.movieId })),
      });
    }

    // Sinon, renvoie les films avec pagination
    const totalMovies = await Movie.countDocuments();
    const totalPages = Math.ceil(totalMovies / limit);
    const movies = await Movie.find({})
      .skip((page - 1) * limit) 
      .limit(limit);

    return NextResponse.json({
      movies: movies.map((movie) => ({ movieId: movie.movieId })),
      totalPages,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des films :', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des films' },
      { status: 500 }
    );
  }
};


export const DELETE = async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
  }

  const { movieId } = await req.json();

  if (!movieId) {
    return NextResponse.json({ error: 'Aucun film à supprimer' }, { status: 400 });
  }

  await dbConnect();

  try {
    const deletedMovie = await Movie.findOneAndDelete({ movieId });
    if (!deletedMovie) {
      return NextResponse.json({ error: 'Film non trouvé' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Film supprimé avec succès', deletedMovie });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression du film' }, { status: 500 });
  }
};


export const PUT = async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
  }

  const { movieId, newMovieId } = await req.json();

  if (!movieId || !newMovieId) {
    return NextResponse.json({ error: 'Informations manquantes pour la mise à jour' }, { status: 400 });
  }

  await dbConnect();

  try {
    const updatedMovie = await Movie.findOneAndUpdate(
      { movieId },
      { movieId: newMovieId },
      { new: true }
    );
    if (!updatedMovie) {
      return NextResponse.json({ error: 'Film non trouvé ou vous n’avez pas la permission de le mettre à jour' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Film mis à jour avec succès', updatedMovie });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du film' }, { status: 500 });
  }
};
