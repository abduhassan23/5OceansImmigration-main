import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MainLayout from '../app/mainlayout';

const AdminDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Check for saved theme in localStorage and apply it
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('/api/Announcements');
        const data = await response.json();
        setAnnouncements(data.announcements || []);
      } catch (error) {
        console.error('Error fetching announcements:', error);
        setAnnouncements([]);
      }
    };
    fetchAnnouncements();
  }, []);
  
  const handleAddAnnouncement = async () => {
    if (!title || !content) return;

    try {
      const response = await fetch('/api/Announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();
      setAnnouncements((prev) => [...prev, data.announcement]);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error adding announcement:', error);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await fetch(`/api/Announcements?id=${id}`, {
        method: 'DELETE',
      });

      setAnnouncements((prev) => prev.filter((announcement) => announcement.id !== id));
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen flex">
        <aside className="w-1/4 bg-gray-200 dark:bg-gray-800 p-4">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Admin Dashboard</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/adminpage" className="block py-2 px-4 rounded-md bg-cyan-700 text-white hover:bg-cyan-800 dark:bg-slate-600 dark:hover:bg-slate-700">
                View User Files
              </Link>
            </li>
            <li>
              <Link href="/adminnotes" className="block py-2 px-4 rounded-md bg-cyan-700 text-white hover:bg-cyan-800 dark:bg-slate-600 dark:hover:bg-slate-700">
                Admin Notes
              </Link>
            </li>
            <li>
              <Link
                href="/settingpage"
                className="block py-2 px-4 rounded-md bg-cyan-700 text-white hover:bg-cyan-800 dark:bg-slate-600 dark:hover:bg-slate-700"
              >Settings
              </Link>
            </li>
          </ul>
        </aside>

        <main className="flex-1 p-8 bg-white dark:bg-gray-900">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to Admin Dashboard</h1>
                <p className="mt-2 mb-8 text-lg text-gray-600 dark:text-gray-300">
                  Use the sidebar to navigate between different admin sections.
                </p>
          
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">Announcements</h2>
  
          <section className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Add Announcement</h2>
            <input
              className="border border-gray-400 p-2 rounded-lg w-full mt-2 dark:bg-gray-700 dark:text-white"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="border border-gray-400 p-2 rounded-lg w-full mt-2 dark:bg-gray-700 dark:text-white"
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              className="mt-4 px-4 py-2 hover:bg-cyan-800 bg-cyan-700 dark:bg-slate-600 dark:hover:bg-slate-700 text-white rounded-lg"
              onClick={handleAddAnnouncement}
            >
              Add Announcement
            </button>

            <h2 className="text-2xl font-semibold dark:text-white mt-8 text-center mb-4">
              Important Announcements!
            </h2>
            <ul className="space-y-4 mt-4 mx-auto max-w-2xl">
              {announcements.map((announcement) => (
                <li 
                  key={announcement.id} 
                  className="border border-gray-400 dark:border-white p-4 rounded-md dark:bg-gray-800 text-center"
                >
                  <h3 className="font-bold text-lg dark:text-white">{announcement.title}</h3>
                  <p className="dark:text-white">{announcement.content}</p>
                  <button
                    className="mt-4 px-8 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this announcement?')) {
                        handleDeleteAnnouncement(announcement.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>

          </section>
        </main>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
