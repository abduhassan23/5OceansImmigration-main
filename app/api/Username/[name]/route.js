import client from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
    try {
        const { name } = params;

        if (!name) {
            return NextResponse.json({
                status: 400,
                message: 'Name parameter is required',
            }, { status: 400 });
        }

        const user = await client.user.findUnique({
            where: {
                email: name.toLowerCase(),
            },
        });

        if (!user) {
            return NextResponse.json({
                status: 404,
                message: 'User not found',
            }, { status: 404 });
        }

        return NextResponse.json({ username: user.name });
    } catch (error) {
        console.error('Error in GET request:', error);
        return NextResponse.json({
            status: 500,
            message: 'Error fetching user by email',
            error: error.message,
        }, { status: 500 });
    }
};

export const PATCH = async (req, { params }) => {
    try {
        const { name } = params; 
        const { newUsername } = await req.json();
  
        if (!name || !newUsername) {
            return NextResponse.json({
                status: 400,
                message: 'Name (email) and newUsername are required',
            }, { status: 400 });
        }
  
        const user = await client.user.findUnique({
            where: {
                email: name.toLowerCase(),
            },
        });
  
        if (!user) {
            return NextResponse.json({
                status: 404,
                message: 'User not found',
            }, { status: 404 });
        }
  
        const updatedUser = await client.user.update({
            where: {
                email: name.toLowerCase(),
            },
            data: {
                name: newUsername,
            },
        });
  
        return NextResponse.json({
            status: 200,
            message: 'Username updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error in PATCH request:', error);
        return NextResponse.json({
            status: 500,
            message: 'Error updating username',
            error: error.message,
        }, { status: 500 });
    }
};