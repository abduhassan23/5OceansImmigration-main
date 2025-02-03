export const dynamic = 'force-dynamic';

import cors, { runMiddleware } from '@/utils/cors';
import { NextResponse } from 'next/server';

// OPTIONS: Handle preflight requests for CORS
export async function OPTIONS(req, res) {
  try {
    await runMiddleware(req, res, cors);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.status(200).end();
  } catch (error) {
    console.error('Error in OPTIONS request:', error.message);
    return res.status(500).end();
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { firebaseUID, document_id } = body;

    if (!firebaseUID || !document_id) {
      return NextResponse.json(
        { success: false, error: "firebaseUID and document_id are required" },
        { status: 400 }
      );
    }

    const response = await fetch("https://5soundwaves.tech/api/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firebaseUID, document_id }),
    });

    let result;
    try {
      result = await response.json();
    } catch (error) {
      console.error("Error parsing backend response as JSON:", error);
      return NextResponse.json(
        { success: false, error: "Invalid response from backend service" },
        { status: 500 }
      );
    }

    if (!response.ok) {
      console.error("Backend service error:", result);
      return NextResponse.json(
        { success: false, error: result.error || "Failed to generate PDF" },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { success: true, downloadUrl: result.downloadUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error in POST request:", error.message);
    return NextResponse.json(
      { success: false, error: "Unexpected server error occurred" },
      { status: 500 }
    );
  }
}


