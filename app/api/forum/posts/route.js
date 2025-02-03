import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { content, threadId, userId } = await req.json();

    // AI-generated: Validate required fields for creating a new post
    if (!content || !threadId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // AI-generated: Create a new post in Prisma database
    const newPost = await prisma.post.create({
      data: {
        content,
        threadId,
        userId,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    // AI-generated: Error handling for post creation
    console.error('Error creating post:', error);
    return NextResponse.json({
      error: 'Failed to create post',
      details: error.message,
    }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { postId, userId } = await req.json();

    console.log('Request to delete post:', { postId, userId });

    // AI-generated: Fetch the post to verify if it exists and retrieve the userId
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    
    if (!post) { // AI-generated: Return error if post is not found
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // AI-generated: Authorization check to ensure only the creator can delete the post
    if (post.userId !== userId) {
      console.log('Unauthorized attempt to delete post:', { postUserId: post.userId, requestUserId: userId });
      return NextResponse.json(
        { error: "You are not authorized to delete this post" },
        { status: 403 }
      );
    }

    // AI-generated: Delete the post from Prisma database
    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error) {
    // AI-generated: Error handling for post deletion
    console.error('Error deleting post:', error);
    return NextResponse.json({
      error: 'Failed to delete post',
      details: error.message,
    }, { status: 500 });
  }
}
