// /app/api/notifications/[notificationsId]/route.js
import client from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

export const PATCH = async (req, { params }) => {
  try {
    const { notificationsId } = params; // Use notificationsId as per the dynamic route
    if (!notificationsId) {
      return NextResponse.json({ status: 400, message: 'Notification ID is required' });
    }

    const updatedNotification = await client.notification.update({
      where: { id: notificationsId },
      data: { isRead: true },
    });

    return NextResponse.json(updatedNotification);
  } catch (error) {
    return NextResponse.json({ status: 500, message: 'Error marking notification as read', error: error.message });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    const { notificationsId } = params; // Use notificationsId as per the dynamic route
    if (!notificationsId) {
      return NextResponse.json({ status: 400, message: 'Notification ID is required' });
    }

    await client.notification.delete({
      where: { id: notificationsId },
    });

    return NextResponse.json({ status: 200, message: 'Notification deleted successfully' });
  } catch (error) {
    return NextResponse.json({ status: 500, message: 'Error deleting notification', error: error.message });
  }
};
