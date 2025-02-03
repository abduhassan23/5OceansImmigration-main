//yarn add react icon 
import React, { useState, useEffect } from "react";
import MainLayout from "../app/mainlayout";
import {
  AiFillCheckCircle,
  AiOutlineCheckCircle,
  AiFillDelete,
  AiFillEdit,
} from "react-icons/ai"; // Prompt 3: Adding icons for marking tasks complete and deleting them

const NotesPage = () => {
  const [noteInput, setNoteInput] = useState("");
  const [notes, setNotes] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Prompt 1: "How can I fetch my notes when the page loads?"

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("/api/notes");
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setNotes(data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchNotes();
  }, []);

  // Prompt 2: "How do I send a POST request to add a new note?"
  const handleAddNote = async () => {
    if (noteInput.trim() === "") return;
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: noteInput }),
      });
      const newNote = await response.json();
      if (newNote.success) {
        // Prepend new note to the top of the list
        setNotes([newNote.data, ...notes]);
        setNoteInput("");
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  // Prompt 4: "How can I delete a note from the list?"

  const handleRemoveNote = async (index) => {
    const note = notes[index];
    try {
      const response = await fetch(`/api/notes?id=${note.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setNotes(notes.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error("Error removing note:", error);
    }
  };

  const handleToggleComplete = async (index) => {
    const note = notes[index];
    try {
      const response = await fetch(`/api/notes?id=${note.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: note.text, completed: !note.completed }),
      });
      const updatedNote = await response.json();
      if (updatedNote.success) {
        setNotes(notes.map((n, i) => (i === index ? updatedNote.data : n)));
      }
    } catch (error) {
      console.error("Error toggling note:", error);
    }
  };

  const handleSaveEdit = async (index) => {
    const note = notes[index];
    try {
      const response = await fetch(`/api/notes?id=${note.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: editInput, completed: note.completed }),
      });
      const updatedNote = await response.json();
      if (updatedNote.success) {
        const updatedNotes = notes.map((n, i) =>
          i === index ? updatedNote.data : n
        );
        setNotes(updatedNotes);
        setEditingIndex(null);
        setEditInput("");
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  return (
    <MainLayout>
      <div className="p-10 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen flex flex-col items-center">
        {/* Box around title and input */}
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-12">
          <h1
            className={`text-5xl font-extrabold mb-8 text-center ${
              isDarkMode
                ? "text-white"
                : "text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-black"
            }`}
          >
            Admin Notes Checklist
          </h1>

          {/* Prompt 3: "Create a simple UI for a checklist using Tailwind CSS. Add icons for marking tasks complete and deleting them using react-icons" */}
          <div className="flex shadow-lg rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-md p-2">
            <input
              type="text"
              placeholder="Add a new task..."
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              className="flex-grow px-4 py-2 text-lg border-none focus:outline-none dark:bg-transparent dark:text-white dark:placeholder-gray-400 bg-transparent text-gray-900"
            />
            <button
              onClick={handleAddNote}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-black text-white font-semibold hover:bg-gradient-to-l transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Display the notes */}
        <ul className="space-y-6 w-full max-w-4xl">
          {notes.length === 0 ? (
            <li className="text-gray-500 dark:text-gray-400 text-center text-lg">
              No tasks added yet. Start by adding a task above.
            </li>
          ) : (
            notes.map((note, index) => (
              <li
                key={index}
                className={`flex justify-between items-center p-6 rounded-xl shadow-xl transform transition-all duration-300 ${
                  note.completed
                    ? "bg-green-50 dark:bg-green-900 bg-opacity-70 line-through text-gray-500 dark:text-gray-400"
                    : "bg-white dark:bg-gray-800 bg-opacity-70 text-gray-700 dark:text-gray-100 hover:scale-102 hover:shadow-lg"
                } backdrop-blur-md`}
              >
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    className="flex-grow px-4 py-2 text-lg border dark:border-gray-600 rounded-md dark:bg-transparent bg-transparent dark:text-white focus:outline-none"
                  />
                ) : (
                  <span
                    className={`cursor-pointer text-lg ${
                      note.completed
                        ? "text-gray-500"
                        : "text-gray-700 dark:text-white"
                    } flex-grow`}
                    onClick={() => {
                      setEditingIndex(index);
                      setEditInput(note.text);
                    }}
                  >
                    {note.text}
                  </span>
                )}

                <div className="flex items-center space-x-4">
                  {editingIndex === index ? (
                    <button
                      onClick={() => handleSaveEdit(index)}
                      className="text-blue-500 hover:text-blue-600 transition-all duration-300 text-2xl"
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleToggleComplete(index)}
                        className={`text-2xl transition-all duration-300 ${
                          note.completed
                            ? "text-green-500"
                            : "text-gray-400 hover:text-green-500"
                        }`}
                        title={
                          note.completed
                            ? "Mark as incomplete"
                            : "Mark as complete"
                        }
                      >
                        {note.completed ? (
                          <AiFillCheckCircle />
                        ) : (
                          <AiOutlineCheckCircle />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setEditingIndex(index);
                          setEditInput(note.text);
                        }}
                        className="text-blue-500 hover:text-blue-600 transition-all duration-300 text-2xl"
                        title="Edit"
                      >
                        <AiFillEdit />
                      </button>

                      <button
                        onClick={() => handleRemoveNote(index)}
                        className="text-red-500 hover:text-red-600 transition-all duration-300 text-2xl"
                        title="Remove"
                      >
                        <AiFillDelete /> {/* Delete icon */}
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </MainLayout>
  );
};

export default NotesPage;
