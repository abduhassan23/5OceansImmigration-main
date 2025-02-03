import { NextResponse } from 'next/server';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '@/app/firebase/config';
import client from '@/app/libs/prismadb';

export const DELETE = async (request) => {
    try {
        const url = new URL(request.url);
        const hash = url.pathname.split('/')[3]; // Extract hash from URL

        if (!hash) {
            return NextResponse.json({
                status: 400,
                message: 'File hash is required',
            });
        }

        // Find the file in MongoDB by hash
        const file = await client.file.findFirst({
            where: { fileHash: hash },
        });

        if (!file) {
            return NextResponse.json({
                status: 404,
                message: 'File not found',
            });
        }

        // Delete the file record from MongoDB
        await client.file.delete({
            where: { id: file.id },
        });

        // Delete the file from Firebase Storage
        const storageRef = ref(storage, `users/${file.userId}/uploads/${file.fileHash}`);
        await deleteObject(storageRef);

        return NextResponse.json({
            message: 'File deleted successfully!',
        });
    } catch (error) {
        console.error('Error:', error); // Debugging output
        return NextResponse.json({
            status: 500,
            message: 'Error deleting file',
            error: error.message,
        });
    }
};

export async function GET(req, { params }) {
    try {
        const { hash } = params; // Extract hash from URL parameters

        if (!hash) {
            return NextResponse.json({
                status: 400,
                message: 'File hash is required',
            });
        }

        // Check if file with the given hash exists
        const file = await client.file.findUnique({
            where: { fileHash: hash },
        });

        return NextResponse.json({ exists: !!file });
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: 'Error checking file hash',
            error: error.message,
        });
    }
}

