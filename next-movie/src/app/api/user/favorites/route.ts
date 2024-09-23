import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const PUT = async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { movieId } = await req.json();

  await dbConnect();
  const user = await User.findById(session.user.id);

  if (!user) {
    return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
  }

  if (user.favMovies.includes(movieId)) {
    
    user.favMovies = user.favMovies.filter((id: string) => id !== movieId);
  } else {
    
    user.favMovies.push(movieId);
  }

  await user.save();

  return NextResponse.json({ message: "Favoris mis à jour" });
};
