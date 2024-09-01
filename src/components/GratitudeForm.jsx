import { useState } from "react";
import { ref, push } from "firebase/database";
import { database } from "../firebase";

const GratitudeForm = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const gratitudeRef = ref(database, "gratitudes");
    push(gratitudeRef, {
      name: name || "Anonymous",
      content,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
      timestamp: Date.now(),
    })
      .then(() => {
        setName("");
        setContent("");
        setTags("");
        setShowFeedback(true);
        setTimeout(() => setShowFeedback(false), 3000);
      })
      .catch((error) => {
        console.error("Error saving gratitude: ", error);
        // Optionally, show an error message to the user
      });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Name (optional)
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Anonymous"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-gray-700 font-bold mb-2"
          >
            What are you grateful for?
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            rows="3"
            required
            placeholder="I'm grateful for..."
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="tags" className="block text-gray-700 font-bold mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="gratitude, happiness, life"
          />
        </div>
        <button
          type="submit"
          className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
        >
          Share Gratitude
        </button>
      </form>
      {showFeedback && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Gratitude shared successfully!
        </div>
      )}
    </>
  );
};

export default GratitudeForm;
