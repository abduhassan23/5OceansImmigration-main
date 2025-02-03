import { NextResponse } from 'next/server';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/app/firebase/config';
import client from '@/app/libs/prismadb';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const { userId } = url.searchParams;
    
    if (!userId) {
      return new Response(JSON.stringify({ status: 400, message: 'User ID is required' }), { status: 400 });
    }

    // Fetch user from MongoDB
    const user = await client.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isAdmin) {
      return new Response(JSON.stringify({ status: 403, message: 'Access denied' }), { status: 403 });
    }

    // Fetch all files associated with the user
    const files = await client.file.findMany({
      where: { userId },
    });

    // Generate download URLs
    const fileWithUrls = await Promise.all(files.map(async (file) => {
      const fileRef = ref(storage, `users/${file.userId}/uploads/${file.fileHash}`);
      const downloadUrl = await getDownloadURL(fileRef);
      return {
        ...file,
        downloadUrl,
      };
    }));

    return new Response(JSON.stringify({ files: fileWithUrls }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ status: 500, message: 'Error fetching files', error: error.message }), { status: 500 });
  }
}