// api/Updateemail/route.js
import client from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { email } = params;
  const { newEmail } = await req.json();

  if (!newEmail) {
    return NextResponse.json({ message: "New email is required." }, { status: 400 });
  }

  try {
    // Update email in MongoDB using Prisma
    const updatedUser = await client.user.update({
      where: { email: email },
      data: { email: newEmail },
    });

    if (!updatedUser) {
      return NextResponse.json({ message: "Failed to update email." }, { status: 500 });
    }

    return NextResponse.json({ message: "Email updated successfully." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: `Error updating email: ${error.message}` }, { status: 500 });
  }
}