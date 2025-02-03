import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  const { threadId } = params;

  try {
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      include: {
        User: true, 
        posts: true,
      },
    });
    if (!thread) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
    }
    return NextResponse.json(thread, { status: 200 });
  } catch (error) {
    // AI-generated: Error handling for fetching a thread from the database
    console.error('Error fetching thread:', error);
    return NextResponse.json({ error: 'Failed to fetch thread' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  const { threadId } = params;
  const { title, content, category } = await req.json();

  try {
    const updatedThread = await prisma.thread.update({
      where: { id: threadId },
      data: { title, content, category },
    });
    return NextResponse.json(updatedThread, { status: 200 });
  } catch (error) {
    // AI-generated: Error handling for updating a thread in the database
    console.error('Error updating thread:', error);
    return NextResponse.json({ error: 'Failed to update thread' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { threadId } = params;
  try {
    await prisma.thread.delete({
      where: { id: threadId },
    });
    return NextResponse.json({ message: 'Thread deleted successfully' }, { status: 204 });
  } catch (error) {
    // AI-generated: Error handling for deleting a thread from the database
    console.error('Error deleting thread:', error);
    return NextResponse.json({ error: 'Failed to delete thread' }, { status: 500 });
  }
}
