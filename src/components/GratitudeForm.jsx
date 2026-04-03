import { useState } from "react";
import { ref, push } from "firebase/database";
import { database } from "../firebase";
import { validateContent } from "../validateGratitude";

const CELEBRATION_EMOJIS = ["✨", "💖", "🌸", "🫶", "🌼", "💫", "🌷", "🎉"];

const createEmojiBurst = () =>
  Array.from({ length: 28 }, (_, index) => ({
    id: `${Date.now()}-${index}`,
    emoji:
      CELEBRATION_EMOJIS[
        Math.floor(Math.random() * CELEBRATION_EMOJIS.length)
      ],
    left: 4 + Math.random() * 92,
    top: 8 + Math.random() * 72,
    driftX: (Math.random() - 0.5) * 150,
    driftY: -80 - Math.random() * 140,
    delay: Math.random() * 0.22,
    duration: 1.5 + Math.random() * 0.9,
    rotate: (Math.random() - 0.5) * 110,
    size: 1.1 + Math.random() * 0.9,
  }));

const GratitudeForm = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [emojiBurst, setEmojiBurst] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const result = validateContent(content);
    if (!result.valid) {
      setError(result.message);
      return;
    }

    const gratitudeRef = ref(database, "gratitudes");
    const newGratitudeRef = push(gratitudeRef, {
      name: name || "Anonymous",
      content: content.trim(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim().replace(/^#/, ""))
        .filter((tag) => tag !== ""),
      timestamp: Date.now(),
    });

    newGratitudeRef
      .then(() => {
        setName("");
        setContent("");
        setTags("");
        setEmojiBurst(createEmojiBurst());
        onSubmit?.(newGratitudeRef.key);
        setTimeout(() => setEmojiBurst([]), 2400);
      })
      .catch((error) => {
        console.error("Error saving gratitude: ", error);
        setError("Something went wrong. Please try again.");
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
            onChange={(e) => { setContent(e.target.value); setError(""); }}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            rows="3"
            required
            placeholder="I'm grateful for..."
          ></textarea>
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
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
      {emojiBurst.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {emojiBurst.map((particle) => (
            <span
              key={particle.id}
              className="emoji-burst-particle"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                fontSize: `${particle.size}rem`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
                "--burst-drift-x": `${particle.driftX}px`,
                "--burst-drift-y": `${particle.driftY}px`,
                "--burst-rotate": `${particle.rotate}deg`,
              }}
            >
              {particle.emoji}
            </span>
          ))}
        </div>
      )}
    </>
  );
};

export default GratitudeForm;
