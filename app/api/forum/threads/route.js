import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// AI-generated: Handles thread fetching, including search functionality with case-insensitive matching.
export async function GET(req) {
  try {
    const userId = req.headers.get('userId'); 
    const { searchTerm } = req.nextUrl.searchParams;

    let threads;
    
    // AI-generated: If a search term is provided, perform a case-insensitive search using Prisma's `contains` with `mode: 'insensitive'`.
    if (searchTerm) {
      threads = await prisma.thread.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { content: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        include: {
          User: { select: { name: true, id: true } }, 
          threadLikes: true, 
        },
      });
    } else {
      threads = await prisma.thread.findMany({
        include: {
          User: { select: { name: true, id: true } },
          posts: true,
          threadLikes: true, 
        },
      });
    }

    // AI-generated: Append `userHasLiked` flag to indicate if the current user liked the thread
    const threadsWithLikes = threads.map(thread => ({
      ...thread,
      userHasLiked: thread.threadLikes.some(like => like.userId === userId),
    }));

    return NextResponse.json(threadsWithLikes, { status: 200 });
  } catch (error) {
    console.error("Error fetching threads:", error);
    return NextResponse.json(
      { error: "Failed to fetch threads", details: error.message },
      { status: 500 }
    );
  }
}


export async function POST(req) {
  try {
    const { title, content, category, userId } = await req.json();

    if (!title || !content || !category || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newThread = await prisma.thread.create({
      data: {
        title,
        content,
        category,
        userId: user.id,
      },
      include: {
        User: { select: { name: true, id: true } }, 
      },
    });

    return NextResponse.json(newThread, { status: 201 });
  } catch (error) {
    console.error("Error creating thread:", error);
    return NextResponse.json(
      {
        error: "Failed to create thread",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const { threadId, userId } = await req.json();

    if (!threadId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingLike = await prisma.threadLikes.findFirst({
      where: {
        userId: userId,
        threadId: threadId,
      },
    });

    let updatedThread;
    
    if (existingLike) {
      await prisma.threadLikes.delete({
        where: {
          id: existingLike.id,
        },
      });

      updatedThread = await prisma.thread.update({
        where: { id: threadId },
        data: {
          likes: { decrement: 1 },
        },
        include: {
          User: true,
          posts: true,
          threadLikes: true, 
        },
      });
    } else {
      // AI-generated: If the user hasn't liked the thread yet, add a like
      await prisma.threadLikes.create({
        data: {
          userId: userId,
          threadId: threadId,
        },
      });

      // AI-generated: Increment the likes count for the thread
      updatedThread = await prisma.thread.update({
        where: { id: threadId },
        data: {
          likes: { increment: 1 },
        },
        include: {
          User: true,
          posts: true,
          threadLikes: true, 
        },
      });
    }

    // AI-generated: Include a flag to indicate if the user has liked the thread
    const threadWithLikes = {
      ...updatedThread,
      userHasLiked: !!existingLike,
    };

    return NextResponse.json(threadWithLikes, { status: 200 });
  } catch (error) {
    console.error("Error toggling likes:", error);
    return NextResponse.json(
      {
        error: "Failed to toggle likes",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// AI-generated: Handles thread deletion, ensures only the thread owner can delete it.
export async function DELETE(req) {
  try {
    const { threadId, userId } = await req.json();

    // AI-generated: Ensure threadId and userId are present
    if (!threadId || !userId) {
      return NextResponse.json(
        { error: "Thread ID and User ID are required" },
        { status: 400 }
      );
    }

    // AI-generated: Verify the thread exists and belongs to the user
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      select: { userId: true },
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    // AI-generated: Ensure only the thread owner can delete the thread
    if (thread.userId !== userId) {
      return NextResponse.json(
        { error: "You are not authorized to delete this thread" },
        { status: 403 }
      );
    }

    // AI-generated: Perform a transaction to delete related likes, posts, and the thread itself
    await prisma.$transaction(async (prisma) => {
      await prisma.threadLikes.deleteMany({
        where: {
          threadId: threadId,
        },
      });

      await prisma.post.deleteMany({
        where: {
          threadId: threadId,
        },
      });

      await prisma.thread.delete({
        where: {
          id: threadId,
        },
      });
    });

    console.log(`Thread ${threadId} and its related records deleted successfully`);
    return NextResponse.json(
      { message: "Thread and related records deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting thread and related records:", error);
    return NextResponse.json(
      {
        error: "Failed to delete thread and related records",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const { threadId, userId, title, content, category } = await req.json();

    if (!threadId || !userId || !title || !content || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      select: { userId: true },
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    // AI-generated: Ensure only the thread owner can update the thread
    if (thread.userId !== userId) {
      return NextResponse.json(
        { error: "You are not authorized to update this thread" },
        { status: 403 }
      );
    }

    const updatedThread = await prisma.thread.update({
      where: { id: threadId },
      data: {
        title,
        content,
        category,
      },
      include: {
        User: { select: { name: true, id: true } }, 
      },
    });

    return NextResponse.json(updatedThread, { status: 200 });
  } catch (error) {
    console.error("Error updating thread:", error);
    return NextResponse.json(
      {
        error: "Failed to update thread",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
