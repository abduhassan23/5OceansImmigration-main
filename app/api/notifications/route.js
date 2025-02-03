import client from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';
import { getCachedResponse, setCachedResponse, clearCacheByPattern } from '@/app/libs/middleware/cache';

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const firebaseUID = searchParams.get('firebaseUID'); // Updated to use firebaseUID
    const page = parseInt(searchParams.get('page'), 10) || 1;
    const limit = parseInt(searchParams.get('limit'), 10) || 10;
    const skip = (page - 1) * limit;

    if (!firebaseUID) {
      return NextResponse.json({ status: 400, message: 'Firebase UID is required' });
    }

    // Generate a cache key
    const cacheKey = `notifications_${firebaseUID}_page_${page}_limit_${limit}`;
    const cachedNotifications = getCachedResponse(cacheKey);

    if (cachedNotifications) {
      return NextResponse.json(cachedNotifications);
    }

    // Fetch notifications from the database
    const notifications = await client.notification.findMany({
      where: { userId: firebaseUID }, // Updated to use firebaseUID
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const totalNotifications = await client.notification.count({ where: { userId: firebaseUID } });

    const response = {
      status: 200,
      notifications,
      totalPages: Math.ceil(totalNotifications / limit),
      currentPage: page,
    };

    setCachedResponse(cacheKey, response);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ status: 500, message: 'Error fetching notifications', error: error.message });
  }
};

// PATCH handler
export const PATCH = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const firebaseUID = searchParams.get('firebaseUID'); // Updated to use firebaseUID

    if (!firebaseUID) {
      return NextResponse.json({ status: 400, message: 'Firebase UID is required' });
    }

    // Update all notifications to be marked as read for the user
    await client.notification.updateMany({
      where: { userId: firebaseUID, isRead: false }, // Updated to use firebaseUID
      data: { isRead: true },
    });

    const cacheKeyPattern = `notifications_${firebaseUID}_`;
    clearCacheByPattern(cacheKeyPattern);

    return NextResponse.json({ status: 200, message: 'All notifications marked as read' });
  } catch (error) {
    return NextResponse.json({ status: 500, message: 'Error marking notifications as read', error: error.message });
  }
};