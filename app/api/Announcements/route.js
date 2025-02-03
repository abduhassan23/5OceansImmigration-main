import client from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

// GET: Fetch all announcements with pagination
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  try {
    const announcements = await client.announcement.findMany({
      skip: skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalAnnouncements = await client.announcement.count();
    return NextResponse.json({
      status: 200,
      announcements,
      totalPages: Math.ceil(totalAnnouncements / limit),
      currentPage: page,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: 'Error fetching announcements',
      error: error.message,
    });
  }
}

// POST: Add a new announcement
export async function POST(req) {
  const { title, content } = await req.json();

  if (!title || !content) {
    return NextResponse.json({
      status: 400,
      message: 'Title and content are required',
    });
  }

  try {
    const newAnnouncement = await client.announcement.create({
      data: {
        title,
        content,
      },
    });

    return NextResponse.json({
      status: 201,
      announcement: newAnnouncement,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: 'Error creating announcement',
      error: error.message,
    });
  }
}

// DELETE: Remove an announcement by ID
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const announcementId = searchParams.get('id');

  if (!announcementId) {
    return NextResponse.json({
      status: 400,
      message: 'Announcement ID is required',
    });
  }

  try {
    await client.announcement.delete({
      where: { id: announcementId },
    });

    return NextResponse.json({
      status: 200,
      message: 'Announcement deleted successfully',
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: 'Error deleting announcement',
      error: error.message,
    });
  }
}
