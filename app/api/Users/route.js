import client from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

// Handle POST request to create a new user
export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, firebaseUID } = body;

        if (!name || !email || !firebaseUID) {
            return NextResponse.json({
                status: 400,
                message: 'Missing required fields: name, email, or firebaseUID',
            });
        }

        // Save user data to MongoDB
        const user = await client.user.create({
            data: {
                name,
                email,
                firebaseUID,  
            },
        });

        return NextResponse.json({
            message: 'User data saved successfully!',
            user,
        });
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: 'Error saving user data.',
            error: error.message,
        });
    }
}


// Handle GET request to fetch user by email or firebaseUID
export async function GET(req) {
    try {
        const url = new URL(req.url);
        const email = url.searchParams.get('email');
        const firebaseUID = url.searchParams.get('firebaseUID');

        if (firebaseUID) {
            const user = await client.user.findUnique({
                where: {
                    firebaseUID,
                },
            });

            if (!user) {
                return NextResponse.json({
                    status: 404,
                    message: 'User not found',
                }, { status: 404 });
            }

            return NextResponse.json({
                name: user.name,
                isAdmin: user.isAdmin,
                firebaseUID: user.firebaseUID, 
            });
        } else if (email) {
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
                name: user.name,
                isAdmin: user.isAdmin,
                firebaseUID: user.firebaseUID, 
            });
        } else {
            // Fetch all users if no email or firebaseUID is provided
            const users = await client.user.findMany();
            return NextResponse.json(users);
        }
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: 'Error fetching users',
            error: error.message,
        }, { status: 500 });
    }
}


