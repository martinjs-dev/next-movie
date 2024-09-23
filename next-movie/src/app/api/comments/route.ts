import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Comment from '@/models/Comment';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get('movieId');


  await dbConnect();
  const comments = await Comment.find({ movieId });

  return NextResponse.json(comments);
};

export const POST = async (req: Request) => {
  const { movieId, comment, rating } = await req.json();
  const session = await getServerSession(authOptions);

  await dbConnect();
  const newComment = new Comment({
    movieId,
    comment,
    rating,
    userId: session.user.id, 
  });

  await newComment.save();
  return NextResponse.json(newComment);
};
