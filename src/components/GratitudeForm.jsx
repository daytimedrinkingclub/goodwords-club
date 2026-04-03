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
        className="relative mb-10 overflow-hidden rounded-[2rem] border border-white/70 bg-white/60 p-5 shadow-[0_22px_60px_rgba(236,72,153,0.1)] backdrop-blur-sm md:p-7"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(96,165,250,0.12),_transparent_24%)]" />

        <div className="relative z-10 mb-5">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-800 md:text-3xl">
            Share a note of gratitude
          </h2>
        </div>

        <div className="relative z-10 grid gap-4 md:grid-cols-2 md:gap-5">
          <div className="rounded-[1.35rem] border border-white/80 bg-white/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-600">
              Name <span className="text-slate-400">optional</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-base text-slate-700 outline-none transition duration-200 placeholder:text-slate-400 focus:border-pink-300 focus:ring-4 focus:ring-pink-200/60"
              placeholder="Anonymous"
            />
          </div>

          <div className="rounded-[1.35rem] border border-white/80 bg-white/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] md:row-span-2">
            <label
              htmlFor="content"
              className="mb-2 block text-sm font-medium text-slate-600"
            >
              What are you grateful for?
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setError("");
              }}
              className="min-h-[170px] w-full resize-none rounded-[1.4rem] border border-slate-200/80 bg-white/80 px-4 py-3 text-base leading-relaxed text-slate-700 outline-none transition duration-200 placeholder:text-slate-400 focus:border-pink-300 focus:ring-4 focus:ring-pink-200/60"
              rows="5"
              required
              placeholder="I’m grateful for..."
            ></textarea>
            {error && (
              <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-600">
                {error}
              </div>
            )}
          </div>

          <div className="rounded-[1.35rem] border border-white/80 bg-white/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
            <label htmlFor="tags" className="mb-2 block text-sm font-medium text-slate-600">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-base text-slate-700 outline-none transition duration-200 placeholder:text-slate-400 focus:border-pink-300 focus:ring-4 focus:ring-pink-200/60"
              placeholder="gratitude, family, small joys"
            />
          </div>
        </div>

        <div className="relative z-10 mt-5 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(236,72,153,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(236,72,153,0.34)]"
          >
            Share gratitude
          </button>
        </div>
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
