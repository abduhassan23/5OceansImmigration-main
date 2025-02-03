import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Handle GET request to fetch a specific post
export async function GET(req, { params }) {
  const { postId } = params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        Thread: true, // Include thread details
        User: true, // Include user details
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// Handle PATCH request to update a specific post
export async function PATCH(req, { params }) {
  const { postId } = params;
  const { content } = await req.json();

  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { content },
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// Handle DELETE request to remove a specific post
export async function DELETE(req, { params }) {
  const { postId } = params;

  try {
    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 204 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}