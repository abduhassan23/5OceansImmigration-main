import client from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export const GET = async (req) => {
    try {
        const url = new URL(req.url);
        const email = url.searchParams.get('email');

        if (!email) {
            return NextResponse.json({
                status: 400,
                message: 'Email parameter is required',
            }, { status: 400 });
        }

        const user = await client.user.findUnique({
            where: {
                email: email.toLowerCase(),
            },
        });

        if (!user) {
            return NextResponse.json({
                status: 404,
                message: 'User not found',
            }, { status: 404 });
        }

        return NextResponse.json({ 
            userId: user.id, 
            isAdmin: user.isAdmin  
        });
    } catch (error) {
        console.error('Error in GET request:', error);
        return NextResponse.json({
            status: 500,
            message: 'Error fetching user by email',
            error: error.message,
        }, { status: 500 });
    }
};


export const PATCH = async (request, { params }) => {
    try {
        const body = await request.json();
        const { id } = params;
        const { name, email } = body;

        const updateUser = await client.user.update({
            where: { id },
            data: { name, email }
        });
        if (!updateUser) {
            return NextResponse.json({ status: 404, message: "User not found" });
        }
        return NextResponse.json(updateUser);
    } catch (error) {
        return NextResponse.json({ status: 500, message: "Error updating user", error });
    }
}

export const DELETE = async (request, { params }) => {
    try {
        const { id } = params; // This should be the firebaseUID passed in the URL params

        // Step 1: Find the user by firebaseUID
        const user = await client.user.findUnique({
            where: {
                firebaseUID: id, // Use the firebaseUID passed in the URL params
            },
            include: { files: true }, // Include related files in the query
        });

        if (!user) {
            return NextResponse.json({ status: 404, message: "User not found" });
        }

        // Step 2: Delete related files first
        await client.file.deleteMany({
            where: {
                userId: user.id, // Assuming `userId` is the foreign key in the `File` model
            },
        });

        // Step 3: Delete the user from the Prisma database
        const deletedUser = await client.user.delete({
            where: { firebaseUID: id }, // Delete by firebaseUID
        });

        if (!deletedUser) {
            return NextResponse.json({ status: 404, message: "User not found in database" });
        }

        return NextResponse.json({
            status: 200,
            message: "User deleted successfully",
        });

    } catch (error) {
        console.error('Error in DELETE request:', error);
        return NextResponse.json({
            status: 500,
            message: 'Error deleting user',
            error: error.message,
        }, { status: 500 });
    }
};
