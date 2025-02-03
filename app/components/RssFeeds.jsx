import React, { useEffect, useRef, useState } from "react";

const RSSFeeds = () => {
  const [feeds, setFeeds] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const res = await fetch("/api/Rss"); // Replace with your actual API endpoint
        const data = await res.json();
        setFeeds(data.items);
      } catch (error) {
        console.error("Error fetching RSS feeds:", error);
      }
    };

    fetchFeeds();
  }, []);

  const keyframes = `
  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }
`;

  return (
    <div className="rss-feed-section py-16 bg-gray-50 dark:bg-gray-900">
      <style>{keyframes}</style>
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100">
        Latest Canadian Immigration News 📰
      </h2>

      <div className="relative overflow-hidden">
        <div
          className="flex gap-6"
          style={{
            display: "flex",
            animation: "scroll 40s linear infinite",
            whiteSpace: "nowrap",
          }}
        >
          {feeds.length > 0 ? (
            <>
              {/* Render feeds twice for seamless looping */}
              {feeds.concat(feeds).map((feed, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-[300px] h-[350px] flex-shrink-0 flex flex-col justify-between"
                >
                  <div className="flex-grow">
                    <h3
                      className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4"
                      style={{
                        whiteSpace: "normal",
                        overflow: "visible",
                        wordWrap: "break-word",
                      }}
                    >
                      {feed.title}
                    </h3>
                    <p
                      className="text-gray-600 dark:text-gray-300 text-sm mb-4"
                      style={{
                        whiteSpace: "normal",
                        overflow: "visible",
                        wordWrap: "break-word",
                      }}
                    >
                      {feed.description}
                    </p>
                  </div>
                  <a
                    href={feed.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto block w-full text-center bg-blue-600 dark:bg-blue-500 text-white rounded-md py-2 hover:bg-blue-500 dark:hover:bg-blue-400 transition"
                  >
                    Read Article
                  </a>
                </div>
              ))}
            </>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Loading feeds...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RSSFeeds;
