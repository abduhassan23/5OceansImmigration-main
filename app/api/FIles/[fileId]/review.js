// app/api/Files/review.js

import client from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';
import { clearCacheByPattern } from '@/app/libs/middleware/cache';

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { fileHash, status, notes } = body;  // `notes` for additional comments from admin

    if (!fileHash || !status) {
      return NextResponse.json({ status: 400, message: 'Missing required fields' });
    }

    // Update the file status in the database
    const updatedFile = await client.file.update({
      where: { fileHash },
      data: { status },
    });

    if (status === 'reviewed') {
      const userId = updatedFile.userId;
      if (userId) {
        // Create a notification for the user with optional notes
        const notificationContent = notes
          ? `Your document "${updatedFile.name}" has been reviewed. Notes: ${notes}`
          : `Your document "${updatedFile.name}" has been reviewed.`;

        const notification = await client.notification.create({
          data: {
            userId,
            content: notificationContent,
            isRead: false, // Unread by default
          },
        });

        // Clear the cache for user notifications
        clearCacheByPattern(`notifications_${userId}_`);

        return NextResponse.json({
          message: 'File status updated and notification sent!',
          file: updatedFile,
          notification,
        });
      } else {
        return NextResponse.json({
          status: 500,
          message: 'No userId associated with the file, unable to create notification.',
        });
      }
    } else {
      return NextResponse.json({
        message: 'File status updated, no notification sent.',
        file: updatedFile,
      });
    }
  } catch (error) {
    return NextResponse.json({ status: 500, message: 'Error updating file status.', error: error.message });
  }
}
