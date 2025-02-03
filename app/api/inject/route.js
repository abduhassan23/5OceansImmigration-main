import cors, { runMiddleware } from '../../../utils/cors';
import { NextResponse } from 'next/server';
import client from '@/app/libs/prismadb';
import { exec } from 'child_process';

export const dynamic = 'force-dynamic';

// OPTIONS: Handle preflight CORS requests
export async function OPTIONS(req) {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*'); // Replace * with your domain for production
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return new Response(null, { status: 204, headers });
}

// POST: Save form data in MongoDB
export const POST = async (req) => {
  try {
    // Add CORS headers
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');

    // Parse request body
    const formData = await req.json();
    const { firebaseUID, ...data } = formData;

    // Validate required fields
    if (!firebaseUID) {
      return new Response(
        JSON.stringify({ success: false, error: 'firebaseUID is required' }),
        { status: 400, headers }
      );
    }

    // Save the data to the database
    const createdEntry = await client.formData.create({
      data: {
        firebaseUID,
        data,
      },
    });

    console.log('Form data saved successfully:', createdEntry);

    return new Response(
      JSON.stringify({ success: true, createdEntry }),
      { status: 201, headers }
    );
  } catch (error) {
    console.error('Error saving form data:', error.message);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to save form data' }),
      { status: 500 }
    );
  }
};

// GET: Generate PDF for the given firebaseUID
export const GET = async (req, res) => {
  try {
    await runMiddleware(req, res, cors);

    const { searchParams } = new URL(req.url);
    const firebaseUID = searchParams.get('firebaseUID');

    if (!firebaseUID) {
      return NextResponse.json(
        { success: false, error: 'firebaseUID is required' },
        { status: 400 }
      );
    }

    const formDataEntries = await client.formData.findMany({
      where: { firebaseUID },
      select: { data: true },
    });

    if (!formDataEntries || formDataEntries.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No form data found for this user' },
        { status: 404 }
      );
    }

    const generatedFiles = await Promise.all(
      formDataEntries.map((entry) => {
        const command = `docker exec pdf_app_container /app/.venv/bin/python /app/combinedscript.py --uid ${firebaseUID} --data '${JSON.stringify(entry.data)}'`;

        return new Promise((resolve) => {
          exec(command, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error executing script: ${stderr || error.message}`);
              resolve(null);
            } else {
              const lines = stdout.trim().split('\n');
              resolve({ data: entry.data, url: lines[lines.length - 1] });
            }
          });
        });
      })
    );

    const validFiles = generatedFiles.filter((file) => file !== null);

    if (validFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate any PDFs' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, files: validFiles }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
};
