import prisma from '../../libs/prismadb';

// GET request to fetch all notes
// Prompt: Help fix my GET function to fetch all notes, with success and error responses
export async function GET() {
  try {
    const notes = await prisma.note.findMany(); //method used to retrieve multiple records from a table in Prisma
    return new Response(JSON.stringify({ success: true, data: notes }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET /api/notes - Error fetching notes:', error);
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,// internal server error 
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// POST request to create a new note
export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ success: false, message: 'Text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newNote = await prisma.note.create({
      data: {
        text,
        completed: false,
      },
    });

    return new Response(JSON.stringify({ success: true, data: newNote }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('POST /api/notes - Error creating note:', error);
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Prompt: Help me fix this PUT function to update a record by id, with success and error handling.
// PUT request to update a note (mark it as completed/incomplete)
export async function PUT(req) {
  try {
    // Extract the 'id' from the URL search parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ success: false, message: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { text, completed } = await req.json();

    // Update the note by ID
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { text, completed },
    });

    return new Response(JSON.stringify({ success: true, data: updatedNote }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('PUT /api/notes - Error updating note:', error);
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// DELETE request to delete a note
export async function DELETE(req) {
  try {
    // Extract the 'id' from the URL search parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ success: false, message: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Delete the note by ID
    const deletedNote = await prisma.note.delete({
      where: { id },
    });

    return new Response(JSON.stringify({ success: true, data: deletedNote }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('DELETE /api/notes - Error deleting note:', error);
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}