import client from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const headers = {
            'Access-Control-Allow-Origin': '*', 
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers });
        }

        const body = await req.json();
        const { userId, fileHash, fileName } = body;

        // Check if userId, fileHash, and fileName are defined
        if (!userId || !fileHash || !fileName) {
            return NextResponse.json({
                status: 400,
                message: 'Missing required fields',
            });
        }

        // Check if file with the given hash already exists
        const existingFile = await client.file.findFirst({
            where: {
                fileHash,
            },
        });

        if (existingFile) {
            return NextResponse.json({
                status: 409,
                message: 'Duplicate file hash found',
            });
        }

        // Find the user by userId
        const user = await client.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({
                status: 404,
                message: 'User not found',
            });
        }

        // Save file hash, email, and name to MongoDB
        const fileEntry = await client.file.create({
            data: {
                userId: user.id, 
                fileHash,
                name: fileName, 
            },
        });

        return NextResponse.json({
            message: 'File hash saved successfully!',
            file: fileEntry,
        });
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: 'Error saving file hash.',
            error: error.message,
        });
    }
}

// GET request handler to check if files with the given hashes exist
export async function GET(req) {
    try {
        const url = new URL(req.url);
        const hashes = url.searchParams.getAll('hashes[]'); 
        if (hashes.length === 0) {
            return NextResponse.json({
                status: 400,
                message: 'File hashes are required',
            });
        }

        // Check if files with the given hashes exist and retrieve their names and statuses
        const files = await client.file.findMany({
            where: {
                fileHash: {
                    in: hashes, 
                },
            },
            select: {
                fileHash: true,
                name: true,
                status: true, 
            },
        });

        // Create a map of file hashes to names and statuses
        const fileMap = files.reduce((acc, file) => {
            acc[file.fileHash] = { name: file.name, status: file.status };
            return acc;
        }, {});

        return NextResponse.json({ files: fileMap });
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: 'Error checking file hashes',
            error: error.message,
        });
    }
}

export async function PATCH(req) {
    try {
        const body = await req.json();
        const { fileHash, status } = body;

        // Validate the input
        if (!fileHash || !status) {
            return NextResponse.json({
                status: 400,
                message: 'Missing required fields',
            });
        }

        // Update the file status
        const updatedFile = await client.file.update({
            where: { fileHash },
            data: { status },
        });

        return NextResponse.json({
            message: 'File status updated successfully!',
            file: updatedFile,
        });
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: 'Error updating file status.',
            error: error.message,
        });
    }
}


