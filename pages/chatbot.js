import axios from "axios";
import { useState } from "react";

function Chatbot() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt) return;

    axios
      .post("/api/chat", { prompt })
      .then((res) => {
        const botResponse = res.data.text;

        setChatHistory([
          ...chatHistory,
          { sender: "user", message: prompt },
          { sender: "bot", message: botResponse },
        ]);

        setResponse(botResponse);
        setPrompt("");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      {/* Chat icon to toggle chat window */}
      <button 
        className="fixed bottom-4 left-4 bg-blue-800 text-white p-4 rounded-full shadow-lg z-50 hover:bg-blue-800 transform hover:scale-110 transition duration-200"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        💬
      </button>

      {/* Chat window */}
      {isChatOpen && (
        <div 
          className="fixed bottom-20 left-4 max-w-sm w-72 p-4 bg-white rounded-lg shadow-lg z-50"
        >
          <div className="text-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Chat with Us</h2>
            <p className="text-gray-500">Our team is here to help you!</p>
          </div>

          {/* Chat History */}
          <div className="max-h-48 overflow-y-auto p-3 bg-gray-100 rounded-lg mb-3">
            {chatHistory.map((entry, index) => (
              <div
                key={index}
                className={`mb-2 ${entry.sender === "user" ? "text-right" : "text-left"}`}
              >
                <p
                  className={`inline-block px-3 py-2 rounded-lg ${
                    entry.sender === "user"
                      ? "bg-blue-800 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {entry.message}
                </p>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              type="text"
              className="flex-grow p-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Type your message here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-r-lg font-semibold"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
